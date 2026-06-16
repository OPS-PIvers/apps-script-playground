# Live-poll backend (one per repo)

`<live-poll>` slides need a tiny shared backend to collect votes. It's a Google
Apps Script Web App writing to a Google Sheet — free, inside Workspace, no
server. You deploy this **once** for the whole `presentations` repo; every deck
reuses it. This folder is **not served** by GitHub Pages — it's just the source
you paste into Apps Script.

## What you get

- `Code.gs` — the Web App. `doPost` records a vote; `doGet` returns aggregated
  results (or resets a poll with the token).
- Responses land in a Sheet tab `responses` with columns
  `timestamp · pollId · type · value · sessionId`.

## One-time deploy (~5 minutes)

Recommended: a **standalone** script bound to a **dedicated responses Sheet**.

1. Create a new Google Sheet (e.g. "OPS Poll Responses"). Copy its ID from the
   URL (`/spreadsheets/d/<THIS>/edit`).
2. Go to <https://script.google.com> → **New project**. Delete the stub and
   paste in `Code.gs`.
3. At the top of `Code.gs`:
   - set `SHEET_ID` to the Sheet ID from step 1 (leave blank only if you instead
     created the script *bound* to the Sheet via Extensions → Apps Script);
   - change `RESET_TOKEN` to your own secret string. **Keep this private** — it
     guards the reset action. Don't paste the real token into any committed deck.
4. **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Deploy, authorize when prompted, and copy the **Web app URL** (ends in
     `/exec`).
5. Paste that URL into [`../_brand/poll-config.js`](../_brand/poll-config.js):
   ```js
   window.OPS_POLL_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
   That one line is the only thing that changes after deploy. Leave it **blank**
   in commits if you treat the endpoint as private.

That's it. Every `<live-poll poll-id="…">` in any deck now works.

## Using it in a deck

```html
<live-poll poll-id="kickoff-tool" type="choice"
           question="Which tool should we build first?">
  <li>Attendance dashboard</li>
  <li>Agenda sync</li>
  <li>Peer evaluation</li>
</live-poll>
```

Load order in the deck (end of `<body>`):
`../_framework/live-poll.js` and `../_brand/poll-config.js`.

`type` can be `choice`, `open`, `scale` (set `min`/`max`/`min-label`/`max-label`),
or `wordcloud`. The slide shows a QR + short link; the audience scans it, lands
on `vote.html`, and the results update live while the slide is on screen.

## Resetting between sessions

- From the deck: add `reset-token="…"` to the `<live-poll>` to show a presenter
  "Reset poll" button. Because the token would then be in the deck HTML, only do
  this on a copy you don't commit — or just:
- From the Sheet: delete the rows for that `pollId` (or clear the tab).
- By URL: `…/exec?action=reset&pollId=<id>&token=<RESET_TOKEN>`.

## Notes & limits

- **CORS:** votes POST as `text/plain` (a "simple" request) so the browser skips
  the preflight Apps Script can't answer. Results are read with a plain `GET`;
  Apps Script 302-redirects to `googleusercontent.com` and `fetch` follows it.
  Nothing else to configure.
- **Scale:** room-scale only. A session's worth of votes is trivial; this isn't
  built for thousands of simultaneous writers.
- **Privacy:** `sessionId` is a random per-device string for soft
  double-vote-discouragement — not a login and not personal data.
- **The QR** encodes the public `vote.html` URL. For an offline room or to avoid
  the on-demand QR service, pre-generate a QR PNG and pass `qr-src="…"` on the
  `<live-poll>`.
