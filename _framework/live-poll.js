// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <live-poll> — a live audience poll for <deck-stage> decks.
 *
 * A static deck can't hold a websocket, so "live" = short-interval polling of
 * a shared Google Apps Script backend (one backend per repo; see
 * poll-backend/). The component shows the question, a "scan to vote"
 * affordance (QR + short link to vote.html), and the results, updated every
 * few seconds while its slide is on screen.
 *
 * It mirrors media-slot's discipline:
 *   - polls the backend ONLY while its slide is [data-deck-active]; stops when
 *     the slide leaves and restarts when it returns (no background traffic, no
 *     quota burn while the deck sits on another slide).
 *   - the RESTING state is the visible end-state: on print / export (noscale) /
 *     reduced-motion / before any data arrives, it renders the question + QR +
 *     a zeroed (or last-known) result, so thumbnails and PDFs never go blank.
 *
 * Attributes:
 *   poll-id     (required) namespaces responses in the backend. Keep it stable.
 *   type        choice | open | scale | wordcloud      (default: choice)
 *   question    the prompt shown above the results
 *   interval    poll seconds (default 3; clamped to >=1)
 *   endpoint    backend /exec URL. Optional — defaults to
 *               window.OPS_POLL_ENDPOINT (set by _brand/poll-config.js).
 *   reset-token (optional) enables a presenter "Reset" control that clears this
 *               poll's rows. Keep the token OUT of committed decks — paste it at
 *               runtime, or omit the control and reset from the Sheet.
 *   qr-src      (optional) a pre-generated QR image to use instead of the
 *               on-demand one (for offline rooms / no third-party calls).
 *
 * For type="choice": list options as child <li> (or <option>) elements.
 *   <live-poll poll-id="q1" type="choice" question="Which tool first?">
 *     <li>Attendance</li><li>Agenda sync</li><li>Peer eval</li>
 *   </live-poll>
 * For type="scale": set min / max / min-label / max-label.
 *
 * The vote page (vote.html) POSTs as text/plain so the request is "simple" and
 * skips the CORS preflight Apps Script can't answer; doGet results are read
 * with a plain fetch (Apps Script 302-redirects to googleusercontent.com and
 * fetch follows it). See poll-backend/Code.gs.
 */
/* END USAGE */
(() => {
  if (window.customElements && customElements.get('live-poll')) return;

  const PALETTE = ['--ot-blue', '--ot-red', '--ot-blue-light', '--ot-red-light',
                   '--ot-blue-dark', '--ot-gray'];

  const css = `
    :host { display: block; container-type: inline-size; }
    * { box-sizing: border-box; }
    .wrap { display: flex; flex-direction: column; gap: 28px; height: 100%; }
    .q { font-family: var(--font-display, sans-serif); font-weight: 800;
         font-size: 56px; line-height: 1.12; letter-spacing: -0.02em; margin: 0;
         color: var(--lp-fg, #fff); }
    .body { display: flex; gap: 48px; align-items: stretch; flex: 1 1 auto; min-height: 0; }
    .results { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 18px; min-width: 0; }

    /* choice / scale bars */
    .row { display: grid; grid-template-columns: 1fr; gap: 6px; }
    .row .label { display: flex; justify-content: space-between; align-items: baseline;
                  font-size: 28px; font-weight: 600; color: var(--lp-fg, #fff); }
    .row .pct { font-family: var(--font-mono, monospace); font-size: 24px; color: var(--lp-muted, #c7cbe0); }
    .track { height: 26px; border-radius: 999px; background: var(--lp-track, rgba(255,255,255,0.10)); overflow: hidden; }
    .fill { height: 100%; width: 0; border-radius: 999px; }

    /* open responses */
    .stream { display: flex; flex-direction: column; gap: 12px; overflow: hidden; }
    .stream .item { font-size: 26px; line-height: 1.35; color: var(--lp-fg, #fff);
                    background: var(--lp-card, rgba(255,255,255,0.06));
                    border: 1px solid rgba(120,140,205,0.22);
                    border-radius: 8px; padding: 12px 18px; }

    /* word cloud */
    .cloud { display: flex; flex-wrap: wrap; gap: 10px 22px; align-content: center;
             align-items: center; justify-content: center; flex: 1; }
    .cloud span { font-family: var(--font-display, sans-serif); font-weight: 700; line-height: 1.1; }

    /* scan-to-vote */
    .scan { flex: none; width: 280px; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 16px; }
    .scan .qrbox { width: 240px; height: 240px; background: #fff; border-radius: 14px;
                   padding: 14px; display: flex; align-items: center; justify-content: center; }
    .scan .qrbox img { width: 100%; height: 100%; image-rendering: pixelated; }
    .scan .link { font-family: var(--font-mono, monospace); font-size: 22px;
                  color: var(--lp-muted, #c7cbe0); text-align: center; word-break: break-all; }
    .scan .cta { font-size: 22px; font-weight: 700; text-transform: uppercase;
                 letter-spacing: 0.1em; color: var(--ot-red-light, #e57e7f); }
    .meta { display: flex; align-items: center; gap: 16px; font-size: 22px;
            color: var(--lp-muted, #c7cbe0); font-family: var(--font-mono, monospace); }
    .reset { font: inherit; font-size: 18px; cursor: pointer; color: var(--lp-muted, #c7cbe0);
             background: transparent; border: 1px solid var(--lp-track, rgba(255,255,255,0.18));
             border-radius: 8px; padding: 6px 12px; }
    .reset:hover { color: #fff; border-color: var(--ot-red, #ad2122); }
    @container (max-width: 900px) { .body { flex-direction: column; } .scan { width: 100%; flex-direction: row; } }
  `;

  class LivePoll extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;
      this._type = (this.getAttribute('type') || 'choice').toLowerCase();
      this._pollId = this.getAttribute('poll-id') || 'poll';
      this._interval = Math.max(1, parseFloat(this.getAttribute('interval')) || 3) * 1000;
      this._options = this._readOptions();
      this._last = null;          // last-known aggregate, kept for the static fallback
      this._timer = null;
      this._active = false;
      this._render();
      this._wireGating();
      this._refresh();            // one immediate read so a static capture isn't empty
    }

    disconnectedCallback() { this._stop(); document.removeEventListener('slidechange', this._onSlide); }

    get endpoint() {
      return this.getAttribute('endpoint') || window.OPS_POLL_ENDPOINT || '';
    }

    _readOptions() {
      const opts = Array.from(this.querySelectorAll('li, option'))
        .map((el) => el.textContent.trim()).filter(Boolean);
      return opts;
    }

    // The vote-page URL (absolute, so a phone can open it). Carries the prompt
    // and (for choice/scale) the options so the stateless vote page can render
    // them. vote.html reads the endpoint from its own poll-config.js; an
    // explicit endpoint attribute is forwarded so a one-off deck can point
    // elsewhere. Keep choice option labels short — they ride in the QR.
    _voteUrl() {
      const u = new URL('../_brand/poll/vote.html', location.href);
      u.searchParams.set('poll', this._pollId);
      u.searchParams.set('type', this._type);
      const q = this.getAttribute('question');
      if (q) u.searchParams.set('q', q);
      if (this._type === 'choice' && this._options.length) u.searchParams.set('opts', this._options.join('|'));
      if (this._type === 'scale') {
        u.searchParams.set('min', this.getAttribute('min') || '1');
        u.searchParams.set('max', this.getAttribute('max') || '5');
        if (this.getAttribute('min-label')) u.searchParams.set('minLabel', this.getAttribute('min-label'));
        if (this.getAttribute('max-label')) u.searchParams.set('maxLabel', this.getAttribute('max-label'));
      }
      const ep = this.getAttribute('endpoint');
      if (ep) u.searchParams.set('endpoint', ep);
      return u.href;
    }

    _qrImg() {
      const supplied = this.getAttribute('qr-src');
      if (supplied) return supplied;
      // On-demand QR of the (public, non-sensitive) vote URL. For offline rooms
      // or no third-party calls, set qr-src to a pre-generated PNG instead.
      const data = encodeURIComponent(this._voteUrl());
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${data}`;
    }

    _render() {
      const root = this.attachShadow ? (this.shadowRoot || this.attachShadow({ mode: 'open' })) : null;
      const q = this.getAttribute('question') || '';
      const linkText = this._voteUrl().replace(/^https?:\/\//, '');
      const resetAttr = this.getAttribute('reset-token');
      root.innerHTML = `
        <style>${css}</style>
        <div class="wrap">
          <p class="q">${this._esc(q)}</p>
          <div class="body">
            <div class="results" part="results"></div>
            <div class="scan">
              <span class="cta">Scan to vote</span>
              <div class="qrbox"><img alt="QR code to vote" src="${this._qrImg()}"></div>
              <span class="link">${this._esc(linkText)}</span>
              ${resetAttr ? '<button class="reset" type="button">Reset poll</button>' : ''}
            </div>
          </div>
          <div class="meta"><span class="count">—</span>${this.endpoint ? '' : '<span>· set OPS_POLL_ENDPOINT</span>'}</div>
        </div>`;
      this._resultsEl = root.querySelector('.results');
      this._countEl = root.querySelector('.count');
      const resetBtn = root.querySelector('.reset');
      if (resetBtn) resetBtn.addEventListener('click', () => this._reset());
      this._paint(this._last);   // resting render (zeroed) so it's never blank
    }

    // ── active-slide gating (mirror media-slot): poll only on the live slide ──
    _wireGating() {
      this._section = this.closest('section');
      this._deck = this.closest('deck-stage') ||
        (this.getRootNode() && this.getRootNode().host && this.getRootNode().host.closest
          ? this.getRootNode().host.closest('deck-stage') : null);
      this._onSlide = () => this._syncActive();
      document.addEventListener('slidechange', this._onSlide);
      // No deck (standalone embed) → just poll.
      this._syncActive();
    }

    _isActive() {
      if (!this._section) return true;                 // standalone: always live
      return this._section.hasAttribute('data-deck-active');
    }

    _syncActive() {
      const now = this._isActive();
      if (now === this._active) return;
      this._active = now;
      if (now) this._start(); else this._stop();
    }

    _start() {
      if (this._timer || !this.endpoint) return;
      this._refresh();
      this._timer = setInterval(() => this._refresh(), this._interval);
    }
    _stop() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }

    async _refresh() {
      const ep = this.endpoint;
      if (!ep) return;
      try {
        const url = ep + (ep.includes('?') ? '&' : '?') + 'pollId=' + encodeURIComponent(this._pollId) +
                    '&type=' + encodeURIComponent(this._type);
        const res = await fetch(url, { method: 'GET' });   // simple GET; follows the 302 to googleusercontent
        const data = await res.json();
        this._last = data;
        this._paint(data);
      } catch (e) { /* keep last-known on a transient failure */ }
    }

    async _reset() {
      const token = this.getAttribute('reset-token');
      if (!token || !this.endpoint) return;
      const url = this.endpoint + (this.endpoint.includes('?') ? '&' : '?') +
        'action=reset&pollId=' + encodeURIComponent(this._pollId) + '&token=' + encodeURIComponent(token);
      try { await fetch(url, { method: 'GET' }); this._last = null; this._paint(null); this._refresh(); } catch (e) {}
    }

    // ── result rendering ──
    _paint(data) {
      if (!this._resultsEl) return;
      const t = this._type;
      if (t === 'open') return this._paintOpen(data);
      if (t === 'wordcloud') return this._paintCloud(data);
      if (t === 'scale') return this._paintScale(data);
      return this._paintChoice(data);
    }

    _setCount(n) { if (this._countEl) this._countEl.textContent = (n || 0) + (n === 1 ? ' vote' : ' votes'); }

    _paintChoice(data) {
      const counts = (data && data.counts) || {};
      const opts = this._options.length ? this._options : Object.keys(counts);
      const total = opts.reduce((s, o) => s + (counts[o] || 0), 0);
      this._setCount(total);
      this._resultsEl.innerHTML = opts.map((o, i) => {
        const n = counts[o] || 0;
        const pct = total ? Math.round((n / total) * 100) : 0;
        const color = `var(${PALETTE[i % PALETTE.length]})`;
        return `<div class="row">
          <div class="label"><span>${this._esc(o)}</span><span class="pct">${pct}% · ${n}</span></div>
          <div class="track"><div class="fill tally" style="width:${pct}%;background:${color}"></div></div>
        </div>`;
      }).join('');
    }

    _paintScale(data) {
      const min = parseInt(this.getAttribute('min') || '1', 10);
      const max = parseInt(this.getAttribute('max') || '5', 10);
      const hist = (data && data.histogram) || {};
      const avg = (data && typeof data.average === 'number') ? data.average : 0;
      const total = (data && data.total) || Object.values(hist).reduce((s, n) => s + n, 0);
      this._setCount(total);
      const peak = Math.max(1, ...Object.values(hist));
      let rows = '';
      for (let v = min; v <= max; v++) {
        const n = hist[v] || 0;
        const pct = Math.round((n / peak) * 100);
        rows += `<div class="row">
          <div class="label"><span>${v}</span><span class="pct">${n}</span></div>
          <div class="track"><div class="fill tally" style="width:${pct}%;background:var(--ot-blue)"></div></div>
        </div>`;
      }
      const lo = this.getAttribute('min-label') || '';
      const hi = this.getAttribute('max-label') || '';
      this._resultsEl.innerHTML =
        `<div class="label" style="font-size:40px"><span>Average</span><span class="pct" style="font-size:40px">${avg.toFixed(2)}</span></div>` +
        rows + (lo || hi ? `<div class="meta"><span>${this._esc(lo)}</span><span style="margin-left:auto">${this._esc(hi)}</span></div>` : '');
    }

    _paintOpen(data) {
      const items = (data && data.responses) || [];
      this._setCount(items.length);
      this._resultsEl.innerHTML = items.length
        ? items.slice(-8).reverse().map((s) => `<div class="item">${this._esc(s)}</div>`).join('')
        : `<div class="item" style="opacity:.6">Responses appear here as they come in…</div>`;
      this._resultsEl.className = 'results stream';
    }

    _paintCloud(data) {
      const freq = (data && data.words) || {};
      const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 40);
      const total = entries.reduce((s, [, n]) => s + n, 0);
      this._setCount(total);
      const peak = Math.max(1, ...entries.map(([, n]) => n));
      this._resultsEl.className = 'results';
      this._resultsEl.innerHTML = `<div class="cloud">${
        entries.map(([w, n], i) => {
          const size = 24 + Math.round((n / peak) * 64);
          const color = `var(${PALETTE[i % PALETTE.length]})`;
          return `<span style="font-size:${size}px;color:${color}">${this._esc(w)}</span>`;
        }).join('') || '<span style="opacity:.6;font-size:28px">Words appear here as they come in…</span>'
      }</div>`;
    }

    _esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  }

  customElements.define('live-poll', LivePoll);
})();
