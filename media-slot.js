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
    '  background:rgba(255,255,255,.9);padding:4px 6px;border-radius:5px;pointer-events:none}' +
    // ── in-slide autorotating carousel UI (dots + progress) ──────────────────
    // Shown only when the host carries data-carousel (a gallery with >1 item and
    // no presenter drop overriding it). Sits over the bottom of the media; a
    // gentle scrim keeps dots legible over light or dark frames.
    '.carousel{position:absolute;left:0;right:0;bottom:0;z-index:3;display:none;' +
    '  flex-direction:column;align-items:center;gap:7px;padding:14px 8px 9px;' +
    '  background:linear-gradient(to top,rgba(0,0,0,.42),rgba(0,0,0,0));pointer-events:none}' +
    ':host([data-carousel]) .carousel{display:flex}' +
    '.cprog{width:min(60%,260px);height:3px;border-radius:3px;' +
    '  background:rgba(255,255,255,.32);overflow:hidden}' +
    '.cprog i{display:block;height:100%;width:0;background:#fff;border-radius:3px;' +
    '  box-shadow:0 0 0 1px rgba(0,0,0,.08)}' +
    '.cdots{display:flex;gap:7px;pointer-events:auto}' +
    '.cdots button{appearance:none;border:0;padding:0;width:8px;height:8px;border-radius:50%;' +
    '  background:rgba(255,255,255,.5);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.35);' +
    '  transition:background .15s,transform .15s}' +
    '.cdots button[aria-current="true"]{background:#fff;transform:scale(1.25)}' +
    '.cdots button:hover{background:rgba(255,255,255,.85)}' +
    '@media (prefers-reduced-motion:reduce){.cdots button{transition:none}}';

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
        '  <div class="carousel" part="carousel"><div class="cprog"><i></i></div>' +
        '    <div class="cdots"></div></div>' +
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
      this._dots = root.querySelector('.cdots');
      this._prog = root.querySelector('.cprog i');
      this._url = null; this._err = null; this._depth = 0;

      // ── in-slide carousel state ──────────────────────────────────────────
      // items: parsed gallery; idx: current; running: rAF ticking; the four
      // gates below decide whether rotation is allowed at any moment.
      this._items = []; this._idx = 0; this._elapsed = 0;
      this._running = false; this._raf = null; this._lastTs = 0;
      this._active = true;       // slide carries data-deck-active (or no deck)
      this._visible = false;     // big enough + on screen (IntersectionObserver)
      this._hover = false;       // presenter hovering → freeze on this frame
      this._dropActive = false;  // a presenter drop is overriding the gallery
      this._modalOpen = false;   // the lightbox is showing this slot
      this._tickBound = this._tick.bind(this);
      this._onEnded = () => this._next(); // a carousel video reaching its end

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

      // Pause-on-hover so a presenter can dwell on one frame mid-demo. Only a
      // rotating gallery reacts — a lone video keeps playing under the cursor.
      this.addEventListener('mouseenter', () => { this._hover = true; if (this.hasAttribute('data-carousel')) this._evalRun(); });
      this.addEventListener('mouseleave', () => { this._hover = false; if (this.hasAttribute('data-carousel')) this._evalRun(); });
    }

    connectedCallback() {
      if (!this.id && !MediaSlot._warned) {
        MediaSlot._warned = true;
        console.warn('<media-slot> without an id will not persist its dropped media.');
      }
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((t) => this.addEventListener(t, this));
      this._render();
      this._items = this._gallery();
      this._buildCarousel();
      this._watchActive();
      this._load();
      // Play only when actually visible AND large enough (skip deck-stage
      // thumbnails, which are tiny clones — autoplaying dozens would thrash).
      // For a rotating gallery the same signal also gates autorotation, so the
      // carousel only ever advances on the slide the audience is looking at.
      this._io = new IntersectionObserver((ents) => {
        for (const en of ents) {
          const big = en.boundingClientRect.width > 80;
          this._visible = en.isIntersecting && big;
          if (this.hasAttribute('data-carousel')) { this._evalRun(); }
          else if (this._visible) this._video.play && this._video.play().catch(() => {});
          else this._video.pause && this._video.pause();
        }
      }, { threshold: 0.25 });
      this._io.observe(this);
    }
    disconnectedCallback() {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((t) => this.removeEventListener(t, this));
      if (this._io) { this._io.disconnect(); this._io = null; }
      if (this._mo) { this._mo.disconnect(); this._mo = null; }
      this._pause();
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
      // A presenter drop overrides the whole gallery: show it alone, no
      // rotation. Clearing the drop (_clear) restores the rotating gallery.
      if (rec && rec.blob) { this._dropActive = true; this.removeAttribute('data-carousel'); this._show(rec.blob, rec.type); return; }
      this._dropActive = false;
      if (this._items.length > 1) { this.setAttribute('data-carousel', ''); this._go(0); }
      else this._showSrc();
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
      // A drop replaces the gallery: stop rotating and show the drop alone.
      this._dropActive = true;
      this.removeAttribute('data-carousel');
      this._pause();
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
        // Single videos loop forever; a carousel item turns this off in
        // _showItem so its 'ended' event can hand off to the next item.
        this._video.loop = true;
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
      // Clearing a drop reveals the author gallery (rotating again) or src.
      this._dropActive = false;
      if (this._items.length > 1) { this.setAttribute('data-carousel', ''); this._go(0); }
      else this._showSrc();
    }

    _revoke() { if (this._url) { URL.revokeObjectURL(this._url); this._url = null; } }

    // ── in-slide autorotating carousel ─────────────────────────────────────
    // The pipe-separated `gallery` is parsed into {url, video} items. With more
    // than one, the slot rotates through them in place: videos/GIFs play to the
    // end, stills hold for `dwell` seconds (default 5), and dots + a progress
    // bar show position and timing. The lightbox modal is untouched — tapping
    // the slot still opens the full-screen carousel.
    _gallery() {
      const attr = this.getAttribute('gallery') || '';
      return attr.split('|').map((s) => s.trim()).filter(Boolean)
        .map((url) => ({ url, video: /\.(mp4|webm|mov|m4v)([?#]|$)/i.test(url) }));
    }

    // Per-slot dwell for stills, overridable via `dwell` (seconds, or ms if
    // ≥100). Defaults to 5s.
    _dwellMs() {
      const n = parseFloat(this.getAttribute('dwell'));
      if (!Number.isFinite(n) || n <= 0) return 5000;
      return n < 100 ? n * 1000 : n;
    }

    _buildCarousel() {
      if (!this._dots) return;
      this._dots.innerHTML = '';
      if (this._items.length <= 1) return;
      this._items.forEach((it, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show media ' + (i + 1) + ' of ' + this._items.length);
        if (i === 0) b.setAttribute('aria-current', 'true');
        // A dot jumps straight to its item; stop the click here so it doesn't
        // also bubble out to the lightbox's open-on-click handler.
        b.addEventListener('click', (e) => { e.stopPropagation(); this._jump(i); });
        this._dots.appendChild(b);
      });
    }

    // The active slide is the only one allowed to rotate. Outside a deck (no
    // data-deck-active ancestor) the slot is always considered active.
    _watchActive() {
      const slide = this._findSlide();
      this._active = slide ? slide.hasAttribute('data-deck-active') : true;
      // Only a multi-item gallery needs this; single slots and dropped videos
      // keep their original "play whenever on screen" behaviour untouched.
      if (!slide || this._items.length <= 1) return;
      this._mo = new MutationObserver(() => {
        const a = slide.hasAttribute('data-deck-active');
        if (a === this._active) return;
        this._active = a;
        if (!this.hasAttribute('data-carousel')) return; // drop override active
        // Each fresh visit to the slide restarts the gallery from the top so
        // the audience always sees it from item 1.
        if (a) this._go(0);
        else { this._pause(); this._setProg(0); }
      });
      this._mo.observe(slide, { attributes: true, attributeFilter: ['data-deck-active'] });
    }

    // Nearest ancestor that is a direct child of <deck-stage> — i.e. the slide.
    _findSlide() {
      let el = this;
      while (el && el.parentElement) {
        if (el.parentElement.tagName === 'DECK-STAGE') return el;
        el = el.parentElement;
      }
      return null;
    }

    _showItem(i) {
      const it = this._items[i];
      if (!it) return;
      this._video.removeEventListener('ended', this._onEnded);
      this._display(it.url, it.video);
      if (it.video) { this._video.loop = false; this._video.addEventListener('ended', this._onEnded); }
    }

    _go(i) {
      const n = this._items.length;
      if (!n) return;
      this._idx = ((i % n) + n) % n;
      this._elapsed = 0;
      this._showItem(this._idx);
      this._updateDots();
      this._setProg(0);
      this._evalRun();
    }

    _next() { this._pause(); this._go(this._idx + 1); }

    _jump(i) {
      if (i === this._idx) return;
      this._pause();
      this._go(i);
    }

    _updateDots() {
      if (!this._dots) return;
      Array.prototype.forEach.call(this._dots.children, (b, i) => {
        if (i === this._idx) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }

    _setProg(f) {
      if (this._prog) this._prog.style.width = Math.max(0, Math.min(1, f || 0)) * 100 + '%';
    }

    // Decide, from the four gates, whether rotation should be running right now
    // and reconcile the rAF/video state to match.
    _evalRun() {
      const should = this.hasAttribute('data-carousel') && this._items.length > 1 &&
        !this._dropActive && !this._modalOpen &&
        this._active && this._visible && !this._hover;
      if (should) { if (!this._running) this._resume(); }
      else this._pause();
    }

    _resume() {
      this._running = true;
      this._lastTs = performance.now();
      const it = this._items[this._idx];
      if (it && it.video) this._video.play && this._video.play().catch(() => {});
      this._raf = requestAnimationFrame(this._tickBound);
    }

    _pause() {
      this._running = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      const it = this._items[this._idx];
      if (it && it.video) this._video.pause && this._video.pause();
    }

    // rAF loop: videos drive the progress bar by playback position and advance
    // on their 'ended' event; stills accumulate elapsed time and advance once
    // they pass the dwell. Elapsed is preserved across pauses (hover, off-slide)
    // so a still resumes where it left off rather than restarting.
    _tick(ts) {
      if (!this._running) return;
      const dt = ts - this._lastTs; this._lastTs = ts;
      const it = this._items[this._idx];
      if (it && it.video) {
        const v = this._video, d = v.duration || 0;
        this._setProg(d ? v.currentTime / d : 0);
      } else {
        const dwell = this._dwellMs();
        this._elapsed += dt;
        this._setProg(this._elapsed / dwell);
        if (this._elapsed >= dwell) { this._next(); return; }
      }
      this._raf = requestAnimationFrame(this._tickBound);
    }

    // Called by the lightbox so on-slide rotation freezes while the modal owns
    // the gallery, then resumes on close.
    setModalOpen(open) {
      this._modalOpen = !!open;
      if (this.hasAttribute('data-carousel')) this._evalRun();
    }

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
