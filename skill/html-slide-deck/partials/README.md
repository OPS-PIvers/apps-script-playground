# Slide partials

Copy-paste `<section>` snippets for OPS Tech HTML decks. Each file is a metadata
comment block followed by the snippet. Drop a section in as a direct child of
`<deck-stage>`; swap the placeholder text, names, repos, QR images, and
`<media-slot>` / `<image-slot>` contents.

**Load order in the deck `<head>`:** `colors_and_type.css` → `slides.css` →
`motion.css`, then `deck-stage.js`. Partials that use the expressive motion
classes (`.count-up`, `.grow-bar`, `.slide-in-*`, `.draw-timeline`, `.tally`)
rely on `motion.css`; `live-poll.html` and the poll variant of
`check-understanding.html` also need `../_brand/poll-config.js` **before**
`../_framework/live-poll.js`. The `big-stat` / `kpi-row` count-up needs the
small `<script>` that ships inside `big-stat.html` — include it once per deck.

Theme default is **navy**; **light** is used for data, tables, and dense
content. Titles centre only when they say so; body copy stays left-aligned.

## Tier 1 — scaffolding

| Partial | Purpose |
|---|---|
| `cover.html` | Opening title — wordmark, kicker, display headline, presenter footmark (navy). |
| `section-divider.html` | Numbered act break — ghost big number, heading, grow-x underbar. |
| `agenda.html` | Numbered roadmap of the talk's sections. |
| `presenter-bio.html` | Headshot + name + role + short bio with fact rows. |
| `close.html` | Sign-off — thanks line, resource rows, and a QR. |

## Tier 2 — archetypes (reuse existing slides.css classes)

| Partial | Purpose |
|---|---|
| `statement.html` | One big idea, vertically centred (with an optional red `.hl`). |
| `head-block.html` | The standard content header (kicker + title + lead) to build on. |
| `card-grid.html` | A row of tool/feature cards with a red tag eyebrow (grid3/grid4). |
| `demo-split.html` | Live-demo split — 40% feature column + a big demo media frame. |
| `device-frames.html` | A tool shown on a tablet + a phone, side by side. |
| `architecture.html` | Labelled stack of layers beside a device/media view. |
| `flow-diagram.html` | Left-to-right pipeline of nodes joined by arrows. |
| `reasons-grid.html` | 3-up (whys) / 4-up (pains) reason grid with red top rules. |
| `before-after.html` | Two framed screenshots with the prompt that changed them. |
| `recipe-steps.html` | Vertical numbered steps — one beat at a time. |
| `recipe-cards.html` | Four numbered cards in a row, optional QR per card. |
| `column-map.html` | Three columns of link lists, grouped by audience. |
| `feature-table.html` | Term/definition rows separated by hairlines (glossary). |

## Tier 3 — additions (need the new §9 CSS in slides.css)

| Partial | Purpose |
|---|---|
| `big-stat.html` | One huge count-up number + label + context (navy). |
| `kpi-row.html` | 3–4 count-up metrics across a row. |
| `comparison.html` | Two text columns (old vs new) entering from opposite edges. |
| `feature-matrix.html` | A multi-column compare table with scored cells. |
| `quote.html` | A large pull-quote + attribution. |
| `timeline.html` | Horizontal milestones along a drawn line. |
| `chart-panel.html` | A bar chart on a light card sitting on a navy slide. |
| `callout.html` | Info / warning / neutral box — standalone slide or inline block. |
| `step-screenshot.html` | One instructional step + an annotated screenshot. |
| `checklist.html` | Ticked "before you ship" / "make sure you've got" list. |
| `qa-prompt.html` | A big "Questions?" line + how-to-reach-me rows. |
| `two-up.html` | A balanced 50/50 split — text + media (or text + text). |
| `hero-announcement.html` | Bigger, darker "Introducing…" launch reveal. |
| `cta.html` | One clear call-to-action + a scan-to-act QR. |
| `full-bleed.html` | One media filling the slide with a caption overlay. |
| `code-block.html` | A syntax-styled mono code panel. |
| `prompt-panel.html` | "Here's the exact prompt" panel (reusable .ba-prompt). |
| `learning-objectives.html` | "By the end you'll be able to…" outcomes. |
| `prerequisites.html` | "What you need before we start." |
| `try-it-now.html` | A hands-on timed activity with steps + a QR. |
| `recap.html` | "What we covered" — closing takeaways. |
| `check-understanding.html` | A comprehension check; can wrap a `<live-poll>`. |
| `people-grid.html` | A grid of people (team / contributors). |
| `live-poll.html` | A live audience poll (choice / open / scale / wordcloud). |
