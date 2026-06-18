---
name: html-slide-deck
description: "Build OPS Tech HTML slide decks with the <deck-stage> engine — presentations, talks, PD sessions, workshops, instructional/how-to decks, documentation decks, product/feature launches, board and leadership briefings, project kickoffs, and family/community info sessions. Use whenever someone asks for a deck, slides, a presentation, a talk, a slideshow, a PD session, a workshop, or wants to add a presentation to the presentations monorepo — even if they don't say 'HTML' or name the engine. Composes a structure (purpose) with an audience (who) over the shared OPS brand and the <deck-stage> framework, and defers brand specifics to the ops-brand-guidelines skill + DESIGN.md. Triggers also on: deck-stage, slides.css, reveal modes, speaker notes, live-poll / audience poll slides, 1920x1080 slides, kiosk/auto-build presentation."
license: MIT License
---

# OPS Tech HTML Slide Decks

This skill builds slide decks as static HTML on the **`<deck-stage>`** engine,
organized as a **monorepo** where every presentation is its own folder. It is
OPS-only: it defers all brand judgment to the **`ops-brand-guidelines`** skill
and its **DESIGN.md**, and it never regenerates the battle-tested engine — that
is seeded verbatim.

## How to think about this skill

You compose a deck from **two orthogonal axes** plus the brand:

- **`structures/`** — the *purpose*. Owns the slide **sequence** and which
  partials appear, in order (showcase, workshop, instructional-guide,
  documentation, launch, feature-overview, briefing, kickoff-roadmap,
  info-session).
- **`audiences/`** — the *who*. Modulates **tone, theme, density, motion
  intensity, jargon, and QR/poll/badge defaults** (internal/{staff, students,
  school-board, parents-community, district-leadership}, external/{conference-peers,
  other-districts, partners-vendors, general-public}).

It's **N + M files, not N × M** — any structure works with any audience.

> **Precedence rule (critical).** On conflict: **audience wins** tone / theme /
> formality / density / motion-intensity; **structure wins** sequence / partials
> / narrative. A structure may name which knobs are audience-overridable.

## Prerequisites

- The **`ops-brand-guidelines`** skill + **DESIGN.md** must be available — this
  skill routes brand decisions there (Mode 1 official vs Mode 2 playful,
  dark-default, logo rules, dark-mode color roles). If they aren't present, ask
  for them before building; don't improvise OPS brand values.
- The deck **must be served over HTTP** to preview (it loads media via `fetch`),
  not opened as `file://`.

## Routing — do this in order

1. **Determine the purpose → pick `structures/<X>.md`.** If it's ambiguous, ask.
   ("a deck for our PD day" → workshop; "show the board our results" → briefing;
   "a conference talk" → showcase.)
2. **Determine the audience → pick `audiences/{internal|external}/<Y>.md`.**
   Default to **`internal/staff`** if unspecified.
3. **Read `ops-brand-guidelines` + DESIGN.md** for the visual identity (mode,
   dark vs light, logo placement on dark, color roles).
4. **Compose with the precedence rule.** The structure sets the slide sequence
   and which partials; the audience sets theme/tone/density/motion-intensity and
   toggles QR/poll/badge defaults.
5. **Assemble the deck folder** (below) from `partials/`, wiring the relative
   `../_brand/*` + `../_framework/*` paths, media slots **empty with descriptive
   placeholders + the right aspect ratio**, and **one speaker note per slide**.
6. **Register** the deck on the root landing page (`index.html`) — see
   "Landing page".
7. **Tell the user** how to preview (serve over HTTP) and, if polls are used,
   the one-time backend deploy + the `poll-config.js` URL.

## The repo layout this skill builds against

```
presentations/                 ← GitHub Pages root (this repo)
  index.html                   ← landing page; one card per deck
  _framework/                  ← the engine (seeded verbatim; never regenerate)
    deck-stage.js  media-slot.js  image-slot.js  media-lightbox.js  live-poll.js
  _brand/
    colors_and_type.css        ← brand tokens
    slides.css                 ← shared archetype + animation CSS
    motion.css  MOTION.md       ← meaningful-motion vocabulary + intensity knob
    poll-config.js             ← window.OPS_POLL_ENDPOINT (blank until deployed)
    poll/vote.html             ← brand-styled voting page
    assets/                    ← logos + torch marks (never recolored/redrawn)
  <deck-slug>/                 ← one folder per presentation
    index.html  +  media/
  poll-backend/                ← Apps Script source (NOT served); deploy once
```

The engine + brand are shared at the repo root (DRY); each deck references **up**
into them with relative paths. On a **cold/fresh monorepo**, lay down this
scaffold and seed `_framework/` + `_brand/` byte-for-byte from this repo (the
canonical source) — never hand-rewrite the engine.

## Scaffolding a deck folder

Create `<deck-slug>/index.html` (kebab-case slug from the title, optionally with
a context token, e.g. `apps-script-playground-mn-2026`). Authored at **1920×1080**.

```html
<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deck Title</title>
<link rel="icon" type="image/png" href="../_brand/assets/orono-torch.png">
<link rel="stylesheet" href="../_brand/colors_and_type.css">
<link rel="stylesheet" href="../_brand/slides.css">
<link rel="stylesheet" href="../_brand/motion.css">
<style>
  /* Per-deck frame variable OVERRIDES (slides.css ships sane defaults) + any
     talk-specific tuning. Keep the shared archetypes in _brand/slides.css. */
  :root { /* override --type-title, --pad-x, etc. only if this deck needs to */ }
</style>
</head><body>
<deck-stage width="1920" height="1080" data-motion="standard">
  <!-- slides: paste partials, swap their text/media, in the structure's order -->
</deck-stage>

<script type="application/json" id="speaker-notes">
[ "One note per slide, in slide order." ]
</script>

<script src="../_framework/image-slot.js"></script>
<script src="../_framework/media-slot.js"></script>
<script src="../_framework/media-lightbox.js"></script>
<script src="../_framework/deck-stage.js"></script>
<!-- only if the deck has a <live-poll>: -->
<!-- <script src="../_brand/poll-config.js"></script><script src="../_framework/live-poll.js"></script> -->
</body></html>
```

Build the body by pulling snippets from **`partials/`** (each file documents the
classes it uses and the fields to swap) in the order the chosen structure
dictates. Set `data-motion` from the audience (`calm` / `standard` / `lively`).

## Framework authoring rules (from deck-stage.js — follow these)

- **Static-HTML slides.** Write slide bodies as plain HTML inside `<deck-stage>`,
  sized via CSS custom properties in the `<style>` block — not generated by a
  script or a JS loop. Static markup is what lets the user click a heading in
  edit mode and retype it; reach for script-generated slides only when the
  content genuinely needs interactivity static HTML can't express.
- **Never set `position` / `inset` / `width` / `height` on a `<section>`** — the
  component absolutely-positions and scales every slide for you.
- **Entrance animations:** the **visible end-state is the base style**; animate
  *from* hidden, gated on `[data-deck-active]` + `prefers-reduced-motion`, with
  **no infinite loops**. This invariant keeps print, reduced-motion, export, and
  the rail thumbnails showing the full slide. Use the reveal idiom — `.anim` /
  `.anim2` / `.anim3` (header & punchline beats), `.cascade` (children reveal
  one-by-one), `.grow-x` — and the motion vocabulary in **`_brand/MOTION.md`**.
- **Speaker notes:** one per slide, in slide order, in the
  `<script type="application/json" id="speaker-notes">` array. Generate notes for
  every deck.
- **Per-slide hooks:** `data-label="…"` (rail label), `data-pin-hero` /
  `data-pin-hide` (corner badge), `data-deck-skip` (omit from nav/print).
- Free with the engine: auto-scaling/letterboxing to any viewport, a resizable
  thumbnail rail (reorder/skip/duplicate/delete), presenter view, and
  `@media print` → clean one-slide-per-page Save-as-PDF.

## Reveal modes (default: manual)

Set on `<deck-stage>`:

| Mode | How to get it | Behavior |
|---|---|---|
| **manual** *(default)* | no `reveal` attribute | speaker reveals each beat with →/Space, then advances slides |
| **autobuild** | `reveal="autobuild"` | the build self-runs on a speech-paced clock; the speaker still advances slides by hand |
| **kiosk** | `?kiosk` / `?autoplay` in the URL, or `reveal="auto"` | self-running build **and** auto-advance after a per-slide dwell |

The presenter can flip **manual ↔ autobuild** live with the **`A`** key (and the
overlay button). That toggle is intentionally **not persisted** — a reload
returns to the file/URL default so an accidental auto-toggle can't outlive the
session. (This is a deliberate choice in the engine; see the OPS-extension
banners in `_framework/deck-stage.js`.)

## Motion intensity (audience knob)

`data-motion="calm | standard | lively"` on `<deck-stage>`, chosen by the
audience layer. `calm` = fades only (briefing, documentation, school-board);
`standard` = the default; `lively` = full vocabulary, a touch bigger (showcase,
launch, conference-peers). Full contract in **`_brand/MOTION.md`**.

## Live polls

For audience interaction, drop a `<live-poll>` (see `partials/live-poll.html` and
`poll-backend/README.md`). It needs the one-time Apps Script backend deploy and
the `_brand/poll-config.js` endpoint URL filled in. Polls run live only while
their slide is on screen and render a static fallback for print/export. Types:
`choice`, `open`, `scale`, `wordcloud`.

## Landing page

The root `index.html` lists every deck as a card, filterable by **Audience** and
**Type** dropdowns plus a search box. When you create a new deck folder,
**register it** by adding one entry to the `DECKS` array in `index.html` (above
the `ADD NEW DECKS ABOVE THIS LINE` marker):
`{ slug, title, type, audience, date, desc }`.

- `type` and `audience` each accept a **string or an array** — every value
  becomes a filter option + a card chip (e.g. `type: ["Showcase"]`,
  `audience: ["Internal", "Staff"]`). Use the structure name for `type` and the
  audience name(s) for `audience`. The `AUDIENCE_ORDER` / `TYPE_ORDER` lists in
  `index.html` set the menu order; any value still works, it just sorts last.
- The legacy `purpose` field is still read as a fallback for `type`.

Cards are de-duped by slug at render, so re-adding an existing deck is a no-op.
Keep slugs stable; they're URLs.

## Reference files in this skill

| Path | What it is |
|---|---|
| `partials/` (+ `README.md`) | Every slide archetype as an HTML snippet + the classes it uses. The building blocks. |
| `structures/` (+ `README.md`) | The 9 purpose templates (slide sequence + partials). |
| `audiences/` (+ `README.md`) | The 9 audience profiles (tone/theme/density/motion/QR/poll). |
| `framework/` | Engine reference + the authoring rules in depth; pointers into `_framework/`. |
| `_brand/MOTION.md` | The motion vocabulary + intensity contract. |

When in doubt on visual identity, defer to **`ops-brand-guidelines` + DESIGN.md**.
When in doubt on the engine, treat the seeded `_framework/` files as canonical.
