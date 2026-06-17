# Orono Technology · Presentations

A monorepo of OPS Tech HTML slide decks built on the **`<deck-stage>`** engine.
Every presentation is its own folder; the engine and brand are shared at the
root. No build step, no framework, no server — static files all the way down.

**Live:** https://ops-pivers.github.io/ops-presentations/ (landing page)

## Layout

```
index.html            ← landing page; one card per deck (DECKS array)
_framework/           ← the <deck-stage> engine (shared, verbatim)
  deck-stage.js  media-slot.js  image-slot.js  media-lightbox.js  live-poll.js
_brand/               ← OPS Tech brand layer (shared)
  colors_and_type.css   design tokens (colors, type, spacing)
  slides.css            shared slide archetypes + the animation contract
  motion.css  MOTION.md  meaningful-motion vocabulary + intensity knob
  poll-config.js        the one live-poll endpoint URL (blank until deployed)
  poll/vote.html        brand-styled voting page
  assets/               logos + torch marks
<deck-slug>/          ← one folder per deck: index.html + media/
poll-backend/         ← Apps Script source for live polls (NOT served; deploy once)
.claude/skills/html-slide-deck/ ← the skill that builds decks (SKILL.md + partials/structures/audiences)
```

## Decks

- **[apps-script-playground-mn-2026/](apps-script-playground-mn-2026/)** — *The
  Apps Script Playground* (MN Thought Leaders Summit 2026). The reference deck:
  anybody can build highly functional web apps now, with a Google Sheet behind
  them and AI beside you.

## View / present a deck

Decks load media via `fetch`, so serve over HTTP (not `file://`):

```
npx serve .          # or: python -m http.server 8000
# then open http://localhost:<port>/<deck-slug>/
```

- **→ / ←** advance and rewind; the left rail jumps anywhere; **T** toggles the
  rail; **A** flips manual ↔ auto-build; **R** resets.
- Demo clips autoplay muted and loop; click any filled media frame to enlarge it
  (Esc closes).
- Print → Save as PDF gives one slide per page.
- Speaker notes live in `#speaker-notes` in each deck's HTML.

## Building a new deck

Use the **html-slide-deck** skill (`.claude/skills/html-slide-deck/`). It composes a
**structure** (purpose) with an **audience** (who) over the OPS brand, scaffolds
the deck folder wired to `../_framework` + `../_brand`, and registers it on the
landing page. See [`.claude/skills/html-slide-deck/SKILL.md`](.claude/skills/html-slide-deck/SKILL.md).

## Live polls

`<live-poll>` slides need a one-time Google Apps Script backend
([`poll-backend/README.md`](poll-backend/README.md)) and the endpoint URL pasted
into `_brand/poll-config.js`. Then any deck can drop in a poll.
