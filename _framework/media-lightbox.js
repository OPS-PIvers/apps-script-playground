/* media-lightbox.js — tap any filled <media-slot> / <image-slot> to view it
 * large in a dimmed, stylized modal. Tap the backdrop, press Esc, or hit the
 * close button to dismiss. Works across every slide; no per-slot wiring.
 *
 * Carousel: a slot may declare a `gallery` attribute — a pipe-separated list
 * of media URLs (videos by extension: mp4/webm/mov/m4v; everything else is
 * an image). The slot itself still shows its `src` placeholder on the slide;
 * the modal pages through the whole gallery with on-screen arrows and the
 * ←/→ keys (swallowed here so the deck doesn't change slides underneath).
 * Arrows and the counter only appear when there's more than one item.
 *
 *   <media-slot src="media/10-digital-microscope.mp4"
 *               gallery="media/10-digital-microscope.mp4 | media/10-lab.png">
 *
 * A presenter drag-drop (IndexedDB blob) is prepended as the first item so a
 * last-minute replacement still leads the carousel. Slots without a gallery
 * behave as before: the modal shows the one live media item.
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
  const VIDEO_RE = /\.(mp4|webm|mov|m4v)([?#]|$)/i;
  const abs = (u) => { try { return new URL(u, location.href).href; } catch (e) { return u; } };

  // ── overlay (built once) ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent =
    '.mlb-scrim{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;' +
    '  justify-content:center;padding:4vh 7vw;box-sizing:border-box;' +
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
    // media sits in a relatively-positioned wrapper so the skeleton can lie
    // directly on top of it (not stacked below) while the next item loads
    '.mlb-media{position:relative;align-self:center;max-width:84vw;max-height:76vh;line-height:0}' +
    '.mlb-media[data-loading]{width:min(62vw,900px);aspect-ratio:16/9}' +
    '.mlb-media img,.mlb-media video{display:block;max-width:84vw;max-height:76vh;' +
    '  width:auto;height:auto;border-radius:6px;background:#000}' +
    // skeleton overlay shown while the next carousel item loads — absolutely
    // positioned over the media so it covers it and shimmers, holding the
    // frame's footprint instead of collapsing or stacking a second box below
    '.mlb-skel{position:absolute;inset:0;z-index:2;border-radius:6px;' +
    '  background:#e7eaf3 linear-gradient(100deg,transparent 25%,' +
    '    rgba(255,255,255,.9) 50%,transparent 75%) no-repeat;' +
    '  background-size:200% 100%;animation:mlb-shimmer 1.15s ease-in-out infinite}' +
    '@keyframes mlb-shimmer{0%{background-position:120% 0}100%{background-position:-120% 0}}' +
    '.mlb-cap{display:flex;align-items:center;gap:12px;margin:0;padding:2px 4px 0;' +
    '  color:#555;font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}' +
    '.mlb-cap::before{content:"";width:28px;height:3px;background:' + RED + ';flex:none}' +
    '.mlb-count{margin-left:auto;color:#999;font-weight:600;letter-spacing:.04em;' +
    '  font-variant-numeric:tabular-nums;text-transform:none}' +
    '.mlb-close{position:fixed;top:26px;right:30px;z-index:2147483601;width:52px;height:52px;' +
    '  border-radius:50%;border:0;cursor:pointer;background:#fff;color:' + BLUE_DARK + ';' +
    '  font-size:26px;line-height:1;display:flex;align-items:center;justify-content:center;' +
    '  box-shadow:0 6px 20px rgba(0,0,0,.3);transition:background .15s,color .15s,transform .1s}' +
    '.mlb-close:hover{background:' + BLUE + ';color:#fff}' +
    '.mlb-close:active{transform:translateY(1px)}' +
    '.mlb-nav{position:fixed;top:50%;transform:translateY(-50%);z-index:2147483601;' +
    '  width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;background:#fff;' +
    '  color:' + BLUE_DARK + ';display:flex;align-items:center;justify-content:center;' +
    '  box-shadow:0 6px 20px rgba(0,0,0,.3);transition:background .15s,color .15s,transform .1s}' +
    '.mlb-nav svg{width:22px;height:22px;display:block}' +
    '.mlb-nav:hover{background:' + BLUE + ';color:#fff}' +
    '.mlb-nav:active{transform:translateY(-50%) translateY(1px)}' +
    '.mlb-prev{left:26px}.mlb-next{right:26px}' +
    '.mlb-scrim[data-single] .mlb-nav,.mlb-scrim[data-single] .mlb-count{display:none}' +
    '@media (prefers-reduced-motion:reduce){.mlb-scrim,.mlb-stage{transition:none}' +
    '  .mlb-skel{animation:none}}';
  document.head.appendChild(style);

  const scrim = document.createElement('div');
  scrim.className = 'mlb-scrim';
  scrim.setAttribute('role', 'dialog');
  scrim.setAttribute('aria-modal', 'true');
  scrim.innerHTML =
    '<button class="mlb-close" aria-label="Close">×</button>' +
    '<button class="mlb-nav mlb-prev" aria-label="Previous media">' +
    '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    '   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7"/></svg></button>' +
    '<button class="mlb-nav mlb-next" aria-label="Next media">' +
    '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    '   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9.5 5 7 7-7 7"/></svg></button>' +
    '<div class="mlb-stage">' +
    '  <div class="mlb-frame"><div class="mlb-media"></div>' +
    '    <p class="mlb-cap"><span class="mlb-cap-text"></span>' +
    '    <span class="mlb-count"></span></p></div>' +
    '</div>';
  const frame = scrim.querySelector('.mlb-frame');
  const media = scrim.querySelector('.mlb-media');
  const cap = scrim.querySelector('.mlb-cap');
  const capText = scrim.querySelector('.mlb-cap-text');
  const count = scrim.querySelector('.mlb-count');
  const closeBtn = scrim.querySelector('.mlb-close');
  const prevBtn = scrim.querySelector('.mlb-prev');
  const nextBtn = scrim.querySelector('.mlb-next');
  let mounted = false, openEl = null;
  let items = [], idx = 0;

  // Caption comes only from a real on-slide label — never the drop-here
  // placeholder text, which has no business showing in a presentation.
  function captionFor(slot) {
    const fig = slot.closest('.mediafig,.device,.res-right,.qrwrap');
    const c = fig && fig.querySelector('.mediacap,.devcap,.qrcap');
    return c ? c.textContent.trim() : '';
  }

  // The media the slot is showing right now (drop blob, sidecar data-URL, or
  // author src), as a {url, video} item — pulled from the open shadow DOM.
  function liveItem(slot) {
    const root = slot.shadowRoot;
    if (!root) return null;
    const vid = root.querySelector('video');
    if (vid && vid.getAttribute('src') && vid.style.display !== 'none') {
      return { url: vid.currentSrc || vid.src, video: true };
    }
    const img = root.querySelector('.frame img') || root.querySelector('img');
    if (img && img.getAttribute('src')) {
      return { url: img.currentSrc || img.src, video: false };
    }
    return null;
  }

  // Full carousel list for a slot. Gallery attribute first; the live media
  // is prepended when it isn't already item 0 (covers presenter drops and
  // sidecar replacements). No gallery → just the live item.
  function itemsFor(slot) {
    const live = liveItem(slot);
    const attr = slot.getAttribute('gallery') || '';
    const list = attr.split('|').map((s) => s.trim()).filter(Boolean)
      .map((url) => ({ url, video: VIDEO_RE.test(url) }));
    if (!list.length) return live ? [live] : [];
    if (live && !list.some((it) => abs(it.url) === abs(live.url))) list.unshift(live);
    return list;
  }

  function elFor(item) {
    if (item.video) {
      const v = document.createElement('video');
      v.src = item.url;
      v.controls = true; v.autoplay = true; v.loop = true; v.muted = true;
      v.playsInline = true; v.setAttribute('playsinline', '');
      return v;
    }
    const i = document.createElement('img');
    i.src = item.url;
    i.alt = capText.textContent || '';
    return i;
  }

  // Fully release a <video> before it leaves the DOM: pause(), drop the src,
  // and load() so the browser stops buffering and frees decoder/network
  // resources. Pausing alone leaves background loading running, esp. on mobile.
  function killVideo(v) {
    try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
  }

  function show(i) {
    if (!items.length) return;
    idx = ((i % items.length) + items.length) % items.length; // wrap both ways
    count.textContent = (idx + 1) + ' / ' + items.length;

    // Footprint of the media currently on screen so the wrapper can hold the
    // frame's size during the swap instead of collapsing to a loading blip.
    let holdW = 0, holdH = 0;
    const shown = media.querySelector('img,video');
    if (shown) { const r = shown.getBoundingClientRect(); holdW = r.width; holdH = r.height; }

    // Tear down whatever's in the wrapper (media + any stale skeleton).
    media.querySelectorAll('img,video,.mlb-skel').forEach((n) => {
      if (n.tagName === 'VIDEO') killVideo(n);
      n.remove();
    });

    // New media loads in place; the skeleton lies on top of it (absolute
    // overlay) so it covers the loading frame and shimmers, holding the
    // footprint until the media is actually decodable.
    const el = elFor(items[idx]);
    media.appendChild(el);

    const skel = document.createElement('div');
    skel.className = 'mlb-skel';
    if (holdW && holdH) { media.style.width = holdW + 'px'; media.style.height = holdH + 'px'; }
    else media.setAttribute('data-loading', ''); // default 16/9 footprint
    media.appendChild(skel);

    const reveal = () => {
      // A late load/error from a torn-down item (rapid navigation) must not
      // clear the live item's loading footprint — only act if el is still it.
      if (el.parentNode !== media) return;
      if (skel.parentNode) skel.remove();
      media.style.width = ''; media.style.height = '';
      media.removeAttribute('data-loading');
    };
    el.addEventListener('error', reveal, { once: true });
    if (items[idx].video) {
      el.addEventListener('loadeddata', reveal, { once: true });
    } else if (el.complete && el.naturalWidth) {
      reveal(); // already cached/decoded
    } else {
      el.addEventListener('load', reveal, { once: true });
    }

    // Warm the next image so arrowing feels instant (videos stream anyway).
    const nxt = items[(idx + 1) % items.length];
    if (nxt && !nxt.video) { const pre = new Image(); pre.src = nxt.url; }
  }

  function open(slot) {
    items = itemsFor(slot);
    if (!items.length) return;
    openEl = slot;
    // Freeze the slot's in-slide autorotation while the modal owns the gallery.
    if (typeof slot.setModalOpen === 'function') slot.setModalOpen(true);
    const text = captionFor(slot);
    capText.textContent = text;
    if (items.length > 1) scrim.removeAttribute('data-single');
    else scrim.setAttribute('data-single', '');
    cap.style.display = (text || items.length > 1) ? '' : 'none';
    // Open on whatever the slot is showing right now so a rotating carousel
    // hands off to the modal seamlessly instead of jumping back to item 1.
    const live = liveItem(slot);
    let start = 0;
    if (live) { const i = items.findIndex((it) => abs(it.url) === abs(live.url)); if (i >= 0) start = i; }
    show(start);
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
    if (openEl && typeof openEl.setModalOpen === 'function') openEl.setModalOpen(false);
    openEl = null;
    document.removeEventListener('keydown', onKey, true);
    const v = media.querySelector('video');
    if (v) { try { v.pause(); } catch (e) {} }
    setTimeout(() => {
      if (scrim.classList.contains('mlb-on')) return;
      media.querySelectorAll('img,video,.mlb-skel').forEach((m) => {
        if (m.tagName === 'VIDEO') killVideo(m);
        m.remove();
      });
      media.style.width = ''; media.style.height = '';
      media.removeAttribute('data-loading');
    }, 240);
  }

  // Capture-phase: Esc closes; ←/→ page the carousel and are swallowed so
  // deck-stage's window listener doesn't also change slides behind the modal.
  function onKey(e) {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.stopPropagation();
      e.preventDefault();
      if (items.length > 1) show(idx + (e.key === 'ArrowRight' ? 1 : -1));
    }
  }

  scrim.addEventListener('click', (e) => {
    // click anywhere that isn't the media frame or a control closes
    const path = e.composedPath();
    if (path.includes(frame) || path.includes(prevBtn) || path.includes(nextBtn)) return;
    close();
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(idx - 1));
  nextBtn.addEventListener('click', () => show(idx + 1));

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
