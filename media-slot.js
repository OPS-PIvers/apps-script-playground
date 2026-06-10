/* <media-slot> — user-fillable VIDEO / GIF / image placeholder.
 *
 * A sibling to <image-slot>, built for live-demo decks: drop an MP4/WebM
 * screen recording or an animated GIF and it autoplays, muted and looping,
 * so a presenter can show a workflow without performing it live. Static
 * images (PNG/JPG/WebP) work too.
 *
 * Persistence uses IndexedDB (keyed by the element id), not a JSON sidecar —
 * demo clips are far too large to inline as data URLs. The dropped media
 * therefore survives reloads on the SAME browser/machine (perfect for
 * presenting from one laptop) but does not travel inside the HTML file.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED to survive reload. Distinct per slot.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *   radius       Corner radius px for 'rounded'.          (default 14)
 *   fit          object-fit: cover | contain.            (default 'cover')
 *   placeholder  Empty-state caption.
 *   src          Optional initial/fallback media URL — video vs image is
 *                inferred from the file extension. A user drop (IndexedDB)
 *                overrides it; clearing the drop reveals src again. This is
 *                what lets a deck ship with its media on a static host.
 *
 * Size/layout come from ordinary CSS (width/height inline or from a parent).
 */
(() => {
  const DB = 'media-slots', STORE = 'blobs';
  const ACCEPT = 'video/*,image/*';
  const isVid = (t) => /^video\//i.test(t || '');

  // ── IndexedDB ────────────────────────────────────────────────────────────
  let dbP = null;
  function db() {
    if (dbP) return dbP;
    dbP = new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbP;
  }
  async function idbGet(id) {
    const d = await db();
    return new Promise((res) => {
      const tx = d.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      tx.onsuccess = () => res(tx.result || null);
      tx.onerror = () => res(null);
    });
  }
  async function idbPut(id, rec) {
    const d = await db();
    return new Promise((res) => {
      const tx = d.transaction(STORE, 'readwrite').objectStore(STORE).put(rec, id);
      tx.onsuccess = () => res(true); tx.onerror = () => res(false);
    });
  }
  async function idbDel(id) {
    const d = await db();
    return new Promise((res) => {
      const tx = d.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
      tx.onsuccess = () => res(true); tx.onerror = () => res(false);
    });
  }

  const css =
    ':host{display:inline-block;position:relative;vertical-align:top;width:240px;height:160px;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55)}' +
    '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
    '.frame video,.frame img{position:absolute;inset:0;width:100%;height:100%;display:none;' +
    '  background:#000}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' +
    '  cursor:pointer;user-select:none}' +
    '.empty svg{opacity:.45}.empty .cap{max-width:90%;font-weight:500}' +
    '.empty .sub{font-size:11px}.empty .sub u{text-underline-offset:2px}' +
    '.empty:hover .sub u{color:rgba(0,0,0,.75)}' +
    '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25)}' +
    ':host([data-over]) .frame{outline:2px solid #2a6fdb;outline-offset:-2px;background:rgba(42,111,219,.10)}' +
    ':host([data-over]) .ring{border-color:#2a6fdb}' +
    ':host([data-filled]) .ring{display:none}' +
    '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' +
    '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;white-space:nowrap}' +
    ':host([data-filled]:hover) .ctl{opacity:1;pointer-events:auto}' +
    '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' +
    '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,sans-serif}' +
    '.ctl button:hover{background:rgba(0,0,0,.82)}' +
    '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' +
    '  background:rgba(255,255,255,.9);padding:4px 6px;border-radius:5px;pointer-events:none}';

  const icon =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>';

  class MediaSlot extends HTMLElement {
    static get observedAttributes() { return ['shape', 'radius', 'fit', 'placeholder', 'id', 'src']; }
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + css + '</style>' +
        '<div class="frame" part="frame">' +
        '  <video part="media" muted loop playsinline></video>' +
        '  <img part="media" alt="">' +
        '  <div class="empty" part="empty">' + icon +
        '    <div class="cap"></div><div class="sub">or <u>browse files</u></div></div>' +
        '  <div class="ring"></div>' +
        '</div>' +
        '<div class="ctl"><button data-act="replace">Replace</button>' +
        '  <button data-act="clear">Remove</button></div>' +
        '<input type="file" accept="' + ACCEPT + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._video = root.querySelector('video');
      this._img = root.querySelector('img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._input = root.querySelector('input');
      this._url = null; this._err = null; this._depth = 0;

      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', (e) => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') this._input.click();
        if (act === 'clear') this._clear();
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
    }

    connectedCallback() {
      if (!this.id && !MediaSlot._warned) {
        MediaSlot._warned = true;
        console.warn('<media-slot> without an id will not persist its dropped media.');
      }
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((t) => this.addEventListener(t, this));
      this._render();
      this._load();
      // Play only when actually visible AND large enough (skip deck-stage
      // thumbnails, which are tiny clones — autoplaying dozens would thrash).
      this._io = new IntersectionObserver((ents) => {
        for (const en of ents) {
          const big = en.boundingClientRect.width > 80;
          if (en.isIntersecting && big) this._video.play && this._video.play().catch(() => {});
          else this._video.pause && this._video.pause();
        }
      }, { threshold: 0.25 });
      this._io.observe(this);
    }
    disconnectedCallback() {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((t) => this.removeEventListener(t, this));
      if (this._io) { this._io.disconnect(); this._io = null; }
      this._revoke();
    }
    attributeChangedCallback(name) {
      if (!this.shadowRoot) return;
      this._render();
      // Re-resolve a src change unless a user drop (blob URL) is showing.
      if (name === 'src' && !this._url) this._showSrc();
    }

    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        if (--this._depth <= 0) { this._depth = 0; this.removeAttribute('data-over'); }
      } else if (e.type === 'drop') {
        e.preventDefault(); e.stopPropagation();
        this._depth = 0; this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }

    async _load() {
      const rec = this.id ? await idbGet(this.id) : null;
      if (rec && rec.blob) { this._show(rec.blob, rec.type); return; }
      this._showSrc();
    }

    // Author-supplied src attribute — the no-IndexedDB fallback that makes
    // the media travel with the HTML on a static host (e.g. GitHub Pages).
    _showSrc() {
      const src = this.getAttribute('src');
      if (!src) return;
      const video = /\.(mp4|webm|mov|m4v)([?#]|$)/i.test(src);
      this._revoke();
      this._display(src, video);
    }

    async _ingest(file) {
      this._setErr(null);
      if (!file || !(isVid(file.type) || /^image\//i.test(file.type))) {
        this._setErr('Drop a video (MP4/WebM) or an image/GIF.'); return;
      }
      this._show(file, file.type);
      if (this.id) await idbPut(this.id, { blob: file, type: file.type });
    }

    _show(blob, type) {
      this._revoke();
      this._url = URL.createObjectURL(blob);
      this._display(this._url, isVid(type));
    }

    _display(url, video) {
      const fit = this.getAttribute('fit') || 'cover';
      if (video) {
        this._video.style.objectFit = fit;
        this._video.src = url;
        this._video.style.display = 'block';
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._video.play && this._video.play().catch(() => {});
      } else {
        this._img.style.objectFit = fit;
        this._img.src = url;
        this._img.style.display = 'block';
        this._video.style.display = 'none';
        this._video.removeAttribute('src');
      }
      this._empty.style.display = 'none';
      this.setAttribute('data-filled', '');
    }

    async _clear() {
      this._revoke();
      this._video.removeAttribute('src'); this._img.removeAttribute('src');
      this._video.style.display = 'none'; this._img.style.display = 'none';
      this._empty.style.display = 'flex';
      this.removeAttribute('data-filled');
      if (this.id) await idbDel(this.id);
      this._showSrc(); // clearing a drop reveals the author src again
    }

    _revoke() { if (this._url) { URL.revokeObjectURL(this._url); this._url = null; } }

    _setErr(msg) {
      if (this._err) { this._err.remove(); this._err = null; }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err'; d.textContent = msg;
      this.shadowRoot.appendChild(d); this._err = d;
      setTimeout(() => { if (this._err === d) { d.remove(); this._err = null; } }, 3000);
    }

    _render() {
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';
      else if (shape === 'pill') radius = '9999px';
      else if (shape === 'rect') radius = '0';
      else { const n = parseFloat(this.getAttribute('radius')); radius = (Number.isFinite(n) ? n : 14) + 'px'; }
      this._frame.style.borderRadius = radius;
      this._ring.style.borderRadius = radius;
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop a video or GIF';
    }
  }

  if (!customElements.get('media-slot')) customElements.define('media-slot', MediaSlot);
})();
