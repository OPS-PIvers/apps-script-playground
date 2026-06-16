/**
 * OPS Tech live-poll backend — one shared Apps Script Web App for the whole
 * presentations repo. <live-poll> reads results via doGet; vote.html submits
 * via doPost. Responses land in a bound (or referenced) Google Sheet.
 *
 * Deploy: Extensions → Apps Script (or a standalone project), paste this in,
 * then Deploy → New deployment → Web app, "Execute as: Me",
 * "Who has access: Anyone". Copy the /exec URL into _brand/poll-config.js.
 * Full steps are in README.md.
 *
 * CORS, the only fiddly part:
 *  - Votes arrive as Content-Type: text/plain, which the browser treats as a
 *    "simple" request — no CORS preflight (OPTIONS), which Apps Script can't
 *    answer anyway. We JSON.parse the text body ourselves.
 *  - doGet returns JSON. Apps Script 302-redirects /exec to a
 *    googleusercontent.com URL; fetch() follows the redirect and reads the JSON
 *    fine, so no extra CORS headers are needed.
 *
 * Quotas are room-scale only (a session's worth of votes is trivial); this is
 * not built for thousands of concurrent writers.
 */

// Sheet/tab the responses live in. If this script is BOUND to a Sheet, leave
// SHEET_ID empty and it uses the active spreadsheet. For a standalone script,
// paste the responses Sheet's ID here.
var SHEET_ID = '';
var TAB_NAME = 'responses';

// Shared reset token. Guards ?action=reset so a stray URL can't wipe a poll.
// Keep the REAL token out of any committed deck — set it here only, in the
// script you alone deploy. Rotate it if it leaks.
var RESET_TOKEN = 'CHANGE-ME-then-keep-secret';

// Stopwords dropped from word-cloud aggregation.
var STOPWORDS = ('a an and the to of in on for is are it its this that with as at by '
  + 'be or i you we they he she my your our their').split(' ');

function _sheet() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(TAB_NAME);
  if (!sh) {
    sh = ss.insertSheet(TAB_NAME);
    sh.appendRow(['timestamp', 'pollId', 'type', 'value', 'sessionId']);
  }
  return sh;
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Vote intake. Body is text/plain JSON: {pollId, type, value, sessionId}. */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var pollId = String(body.pollId || '').slice(0, 120);
    if (!pollId) return _json({ ok: false, error: 'missing pollId' });
    var type = String(body.type || 'choice').slice(0, 20);
    var value = String(body.value == null ? '' : body.value).slice(0, 500);
    var sessionId = String(body.sessionId || '').slice(0, 80);
    _sheet().appendRow([new Date(), pollId, type, value, sessionId]);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

/** Results read, or reset. ?pollId=…&type=… → aggregate; ?action=reset&pollId=…&token=… → clear. */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'reset') return _reset(p.pollId, p.token);
  var pollId = p.pollId;
  if (!pollId) return _json({ ok: false, error: 'missing pollId' });
  var type = p.type || 'choice';
  var rows = _rowsFor(pollId);
  if (type === 'scale') return _json(_aggScale(rows));
  if (type === 'open') return _json(_aggOpen(rows));
  if (type === 'wordcloud') return _json(_aggCloud(rows));
  return _json(_aggChoice(rows));
}

function _rowsFor(pollId) {
  var sh = _sheet();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var data = sh.getRange(2, 2, last - 1, 3).getValues(); // pollId, type, value
  var out = [];
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(pollId)) out.push(String(data[i][2]));
  }
  return out;
}

function _aggChoice(values) {
  var counts = {};
  values.forEach(function (v) { if (v) counts[v] = (counts[v] || 0) + 1; });
  return { ok: true, type: 'choice', total: values.length, counts: counts };
}

function _aggScale(values) {
  var hist = {}, sum = 0, n = 0;
  values.forEach(function (v) {
    var num = parseFloat(v);
    if (!isNaN(num)) { hist[num] = (hist[num] || 0) + 1; sum += num; n++; }
  });
  return { ok: true, type: 'scale', total: n, average: n ? sum / n : 0, histogram: hist };
}

function _aggOpen(values) {
  var clean = values.filter(function (v) { return v && v.trim(); });
  return { ok: true, type: 'open', total: clean.length, responses: clean };
}

function _aggCloud(values) {
  var freq = {};
  values.forEach(function (v) {
    String(v).toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).forEach(function (w) {
      w = w.replace(/^['-]+|['-]+$/g, '');
      if (w.length < 2 || STOPWORDS.indexOf(w) !== -1) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  });
  return { ok: true, type: 'wordcloud', words: freq };
}

function _reset(pollId, token) {
  if (token !== RESET_TOKEN) return _json({ ok: false, error: 'bad token' });
  if (!pollId) return _json({ ok: false, error: 'missing pollId' });
  var sh = _sheet();
  var last = sh.getLastRow();
  if (last < 2) return _json({ ok: true, cleared: 0 });
  // Delete bottom-up so row indices stay valid as we splice.
  var ids = sh.getRange(2, 2, last - 1, 1).getValues();
  var cleared = 0;
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(pollId)) { sh.deleteRow(i + 2); cleared++; }
  }
  return _json({ ok: true, cleared: cleared });
}
