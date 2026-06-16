# The `<deck-stage>` framework

The engine lives in the monorepo at **`_framework/`** and is seeded **verbatim**
from the canonical source — never regenerate it; patch only inside the
`/* === OPS EXTENSION … === */` banners. This doc is the reference behind the
summary in `SKILL.md`.

| File | Role |
|---|---|
| `_framework/deck-stage.js` | The web component: auto-scaling, thumbnail rail, presenter view, print, speaker notes, reveal modes. |
| `_framework/media-slot.js` | `<media-slot>` — a media placeholder/player with galleries, pan, dwell, lightbox. |
| `_framework/image-slot.js` | `<image-slot>` — an image placeholder with double-click crop/reframe. |
| `_framework/media-lightbox.js` | Click-to-enlarge modal for any filled media slot. |
| `_framework/live-poll.js` | `<live-poll>` — live audience polls (see `poll-backend/README.md`). |

## `<deck-stage>` essentials

```html
<deck-stage width="1920" height="1080">
  <section data-label="Title">…</section>
  <section data-label="Agenda">…</section>
</deck-stage>
```

- Slides are the **direct element children** of `<deck-stage>`. Each is
  auto-tagged `data-screen-label="NN Label"` and
  `data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"`.
- The canvas is a fixed **design size** (default 1920×1080) scaled with
  `transform: scale()` to fit the viewport, letterboxed. `noscale` renders 1:1
  (used by the PPTX/image exporter).
- `@media print` lays every slide out as its own page → clean Save-as-PDF.
- **Public API:** `.index`, `.length`, `.goTo(n)`. **Events:** `slidechange`
  (detail: index, previousIndex, total, slide, reason) and `deckchange` (rail
  edits). Both bubble and compose out of the shadow root.
- **Keyboard:** ←/→, PgUp/PgDn, Space, Home/End, number keys (1–9, 0→10),
  `R` reset, `T` toggle rail, `A` toggle reveal mode. Touch: tap left/right half.

### Per-slide hooks
`data-label="…"` (rail label), `data-pin-hero` / `data-pin-hide` (persistent
corner badge), `data-deck-skip` (omit from nav/print).

### The persistent badge (opt-in)
A light-DOM `<template id="deck-pin">` is cloned into the canvas as a corner
"scan for slides/resources" badge. Opt-in and talk-specific — include the
template only if you want it.

## The animation contract (the one rule new slides must obey)

> The **resting state is the visible end-state**; only non-active slides
> pre-hide. Everything is gated on `[data-deck-active]` + `@media
> (prefers-reduced-motion: no-preference)`, with `:not([noscale])` so the
> exporter shows the full slide.

This is why print, reduced-motion, export, and rail thumbnails never go blank.
The idiom (defined in `_brand/slides.css`):

- `.anim` / `.anim2` / `.anim3` — header and punchline beats (kicker → title →
  lead, then a late footmark; tune the footmark with `--punch`).
- `.cascade` — a container whose direct children reveal one-by-one (tune with
  `--cascade-start` / `--cascade-step`). In **manual** mode the whole cascade is
  one click-beat; in **auto** it staggers.
- `.grow-x` — a bar that scales in from the left (the divider underbar).
- `.featlist` — a demo bullet list that auto-cascades on arrival.

The expressive vocabulary (`_brand/motion.css`, documented in `_brand/MOTION.md`)
adds `.count-up`, `.grow-bar`, `.draw-line`, `.slide-in-l/-r`, `.draw-timeline`,
`.tally`, governed by the `data-motion` intensity knob.

## Build beats (manual mode)

In manual mode each slide reveals one "beat" per →/Space:
- Beat 0 (arrival): the header block (`.anim`/`.title`/`.grow-x`/`.bignum` and
  any standalone `.anim2`).
- Then each **outermost** `.cascade` reveals as one beat (its whole list), and
  each standalone `.anim3` reveals as a beat, in document order.
- Override per element: `data-build="step"` (force its own beat),
  `data-build="arrival"` (pin to beat 0), `data-build="skip"` (always visible),
  `data-build-group` on a container (reveal its whole subtree as one beat).

## Reveal modes — the OPS extension

Upstream had two internal modes (`manual` / `auto`); the `no-autoadvance`
attribute already separated "self-running build" from "auto-advance". The OPS
extension (banner-marked in `deck-stage.js`) surfaces three **named** modes and
an internal `_autoAdvance` flag:

| Mode | Trigger | `data-reveal-mode` | Auto-advance |
|---|---|---|---|
| manual *(default)* | none | `manual` | no |
| autobuild | `reveal="autobuild"` (sugar for `reveal="auto"` + `no-autoadvance`) | `auto` | no |
| kiosk | `?kiosk` / `?autoplay` / `reveal="auto"` | `auto` | yes |

The `A` key / overlay button flips **manual ↔ autobuild** (never kiosk — a live
toggle forces `_autoAdvance=false`). It is **not persisted** by design, so a
reload returns to the file/URL default.

## Media components (quick reference)

- `<media-slot src gallery="a | b | c" placeholder shape="rounded|rect|circle|pill"
  radius fit="cover|contain" pan dwell id>` — empty slots show the placeholder;
  `gallery` auto-rotates; click opens the lightbox; rotation/pan gate on the
  active slide; `id` persists a dropped file in IndexedDB.
- `<image-slot>` — similar, plus double-click crop/reframe when `fit="cover"`.

Ship media slots **empty** with a descriptive `placeholder` and the right aspect
ratio; the author drops in clips/screenshots later.
