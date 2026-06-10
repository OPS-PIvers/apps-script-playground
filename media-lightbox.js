/* media-lightbox.js — tap any filled <media-slot> / <image-slot> to view it
 * large in a dimmed, stylized modal. Tap the backdrop, press Esc, or hit the
 * close button to dismiss. Works across every slide; no per-slot wiring.
 *
 * Reads the rendered media straight out of each slot's open shadow DOM, so it
 * stays in sync with whatever the presenter dropped (image data-URL or video
 * blob URL). Brand styling is self-contained (Orono Technology palette + Lexend).
 */
(() => {
  if (window.__mediaLightbox) return;
  window.__mediaLightbox = true;

  const BLUE = '#2D3F89', BLUE_DARK = '#1D2A5D', RED = '#AD2122';
  const SLOT_SEL = 'media-slot,image-slot';
  const MIN_W = 140; // ignore tiny thumbnail clones in the deck rail

  // ── overlay (built once) ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent =
    '.mlb-scrim{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;' +
    '  justify-content:center;padding:4vh 4vw;box-sizing:border-box;' +
    '  background:rgba(16,23,52,0.85);opacity:0;pointer-events:none;' +
    '  transition:opacity .2s cubic-bezier(.2,.8,.2,1);' +
    '  font-family:Lexend,system-ui,-apple-system,sans-serif;cursor:zoom-out}' +
    '.mlb-scrim.mlb-on{opacity:1;pointer-events:auto}' +
    '.mlb-stage{display:flex;flex-direction:column;max-width:100%;' +
    '  max-height:100%;cursor:default;opacity:0;transition:opacity .22s cubic-bezier(.2,.8,.2,1)}' +
    '.mlb-scrim.mlb-on .mlb-stage{opacity:1}' +
    '.mlb-frame{background:#fff;border-radius:10px;border-top:4px solid ' + BLUE + ';' +
    '  padding:14px;box-sizing:border-box;' +
    '  box-shadow:0 12px 28px rgba(29,42,93,.42),0 2px 8px rgba(29,42,93,.3);' +
    '  max-width:100%;display:flex;flex-direction:column;gap:12px}' +
    '.mlb-frame img,.mlb-frame video{display:block;max-width:88vw;max-height:76vh;' +
    '  width:auto;height:auto;border-radius:6px;background:#000}' +
    '.mlb-cap{display:flex;align-items:center;gap:12px;margin:0;padding:2px 4px 0;' +
    '  color:#555;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}' +
    '.mlb-cap::before{content:"";width:28px;height:3px;background:' + RED + ';flex:none}' +
    '.mlb-close{position:fixed;top:26px;right:30px;z-index:2147483601;width:52px;height:52px;' +
    '  border-radius:50%;border:0;cursor:pointer;background:#fff;color:' + BLUE_DARK + ';' +
    '  font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center;' +
    '  box-shadow:0 6px 20px rgba(0,0,0,.3);transition:background .15s,color .15s,transform .1s}' +
    '.mlb-close:hover{background:' + BLUE + ';color:#fff}' +
    '.mlb-close:active{transform:translateY(1px)}' +
    '@media (prefers-reduced-motion:reduce){.mlb-scrim,.mlb-stage{transition:none}}';
  document.head.appendChild(style);

  const scrim = document.createElement('div');
  scrim.className = 'mlb-scrim';
  scrim.setAttribute('role', 'dialog');
  scrim.setAttribute('aria-modal', 'true');
  scrim.innerHTML =
    '<button class="mlb-close" aria-label="Close">\u00D7</button>' +
    '<div class="mlb-stage">' +
    '  <div class="mlb-frame"><p class="mlb-cap"></p></div>' +
    '</div>';
  const frame = scrim.querySelector('.mlb-frame');
  const cap = scrim.querySelector('.mlb-cap');
  const closeBtn = scrim.querySelector('.mlb-close');
  let mounted = false, openEl = null;

  // Caption comes only from a real on-slide label — never the drop-here
  // placeholder text, which has no business showing in a presentation.
  function captionFor(slot) {
    const fig = slot.closest('.mediafig,.device,.res-right,.qrwrap');
    const c = fig && fig.querySelector('.mediacap,.devcap,.qrcap');
    return c ? c.textContent.trim() : '';
  }

  // Pull the live media element out of the slot's shadow DOM.
  function mediaFor(slot) {
    const root = slot.shadowRoot;
    if (!root) return null;
    const vid = root.querySelector('video');
    if (vid && vid.getAttribute('src') && vid.style.display !== 'none') {
      const v = document.createElement('video');
      v.src = vid.currentSrc || vid.src;
      v.controls = true; v.autoplay = true; v.loop = true; v.muted = true;
      v.playsInline = true; v.setAttribute('playsinline', '');
      return v;
    }
    const img = root.querySelector('img[src]');
    if (img && img.getAttribute('src')) {
      const i = document.createElement('img');
      i.src = img.currentSrc || img.src;
      i.alt = captionFor(slot);
      return i;
    }
    return null;
  }

  function open(slot) {
    const media = mediaFor(slot);
    if (!media) return;
    openEl = slot;
    const old = frame.querySelector('img,video');
    if (old) old.remove();
    frame.insertBefore(media, cap);
    const text = captionFor(slot);
    cap.textContent = text;
    cap.style.display = text ? '' : 'none';
    if (!mounted) { document.body.appendChild(scrim); mounted = true; }
    // force reflow so the opacity transition runs (timer, not rAF — rAF can
    // be suspended in hidden/offscreen frames and the modal would stay invisible)
    scrim.getBoundingClientRect();
    setTimeout(() => scrim.classList.add('mlb-on'), 10);
    document.addEventListener('keydown', onKey, true);
  }

  function close() {
    if (!mounted) return;
    scrim.classList.remove('mlb-on');
    openEl = null;
    document.removeEventListener('keydown', onKey, true);
    const v = frame.querySelector('video');
    if (v) { try { v.pause(); } catch (e) {} }
    setTimeout(() => {
      if (scrim.classList.contains('mlb-on')) return;
      const m = frame.querySelector('img,video');
      if (m) m.remove();
    }, 240);
  }

  function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }

  scrim.addEventListener('click', (e) => {
    // click anywhere that isn't the media frame closes
    if (!e.composedPath().includes(frame)) close();
  });
  closeBtn.addEventListener('click', close);

  // ── open triggers ─────────────────────────────────────────────────────────
  // A filled image-slot in author mode uses dblclick for reframe, so debounce
  // single clicks there and let a dblclick cancel. Everything else opens at once.
  let pending = null;
  document.addEventListener('click', (e) => {
    const path = e.composedPath();
    if (path.includes(scrim)) return;
    const slot = path.find((n) => n.matches && n.matches(SLOT_SEL));
    if (!slot || !slot.hasAttribute('data-filled')) return;
    if (slot.hasAttribute('data-reframe')) return;
    if (slot.getBoundingClientRect().width < MIN_W) return; // thumbnail clone
    // skip clicks on a slot's own controls / reframe handles
    if (path.some((n) => n.getAttribute &&
        (n.getAttribute('data-act') || n.classList && n.classList.contains('handle')))) return;
    const deferral = slot.tagName === 'IMAGE-SLOT' && slot.hasAttribute('data-editable');
    clearTimeout(pending);
    if (deferral) pending = setTimeout(() => open(slot), 240);
    else open(slot);
  });
  document.addEventListener('dblclick', () => clearTimeout(pending), true);
})();
