# Motion system

The motion vocabulary for OPS Tech HTML decks. It lives in two files:

- **`slides.css`** — the *base text idiom*: `.anim` / `.anim2` / `.anim3` (header
  and punchline beats), `.cascade` (a container whose children reveal
  one-by-one), `.grow-x` (a bar that scales in from the left), and `.featlist`
  (a demo bullet list that auto-cascades on arrival).
- **`motion.css`** — the *expressive vocabulary* for the additions wave:
  `.count-up`, `.grow-bar`, `.draw-line`, `.slide-in-l` / `.slide-in-r`,
  `.draw-timeline`, `.tally`.

Reach for the base idiom for ordinary text and lists. Reach for the expressive
vocabulary only when the motion **carries meaning** — a number counting up, a
bar rising from its axis, two halves entering from opposite edges to *be* a
contrast, milestones drawing along a timeline.

## One curve, one scale

Every reveal shares one easing curve and one duration set. Do not introduce a
per-slide easing.

| Token | Value | Where |
|---|---|---|
| `--reveal-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | slides.css `:root` |
| `--motion-dur-quick` | `0.5s` | motion.css `:root` |
| `--motion-dur-base` | `0.8s` | motion.css `:root` |
| `--motion-dur-slow` | `1.1s` | motion.css `:root` |

The base `.anim`/`.cascade` transitions (in slides.css) run ~0.55–0.9s on the
same curve. `--ease-inout` (colors_and_type.css) is reserved for the opt-in
close-slide spinner only.

## The invariant (every class obeys this)

> The resting state is the **visible end-state**. Only non-active slides
> pre-hide. Everything is wrapped in `@media (prefers-reduced-motion:
> no-preference)` and guarded with `:not([noscale])`.

That is what keeps **print**, **reduced-motion**, the **PPTX / html-to-image
export** (which renders at `noscale`), and the **rail thumbnails** showing the
full, finished slide. A new motion class that hides content at rest will print
blank — don't write one.

The expressive classes auto-reveal on slide **arrival** (when the slide gets
`[data-deck-active]`), not as manual build beats. So a chart animates when its
slide appears, in both manual and auto reveal modes, without interfering with
the speaker's →/Space build of the text around it.

## The vocabulary

| Class | What it does | Notes for the author |
|---|---|---|
| `.count-up` | A number ticks 0 → its value | Resting text = the final number. Pair with the counter script in the partial (it respects reduced-motion and jumps to final). `tabular-nums` is applied so width doesn't jitter. |
| `.grow-bar` | A bar rises from its baseline | `transform-origin: bottom`. For a row of bars, set `--i: 0,1,2,…` on each so they stagger in auto mode. |
| `.draw-line` | An SVG path draws in | Put `pathLength="1"` on the `<path>` so `--len` stays `1`. Resting = fully drawn. |
| `.slide-in-l` / `.slide-in-r` | Halves enter from opposite edges | Use on a two-column comparison so the *motion is the contrast*. The right half is delayed slightly in auto mode. |
| `.draw-timeline` | A horizontal line draws left→right | Put it on the connecting line; put the milestones in a sibling `.cascade` so they reveal along it. |
| `.tally` | A bar eases to its result | For `<live-poll>` result bars. Not gated to arrival — it smooths every live value change; reduced-motion jumps. |

Plus the base idiom from slides.css: `.anim` / `.anim2` / `.anim3`, `.cascade`
(tune with `--cascade-start` / `--cascade-step`), `.grow-x`. The close-slide
word **spinner** + **morph** is an **opt-in flourish only** — use it on a close
slide, never on content.

## Intensity is an audience knob

Set `data-motion` on the `<deck-stage>` element. The **audience** layer chooses
it; structures don't.

```html
<deck-stage width="1920" height="1080" data-motion="standard"> … </deck-stage>
```

| `data-motion` | Effect | Typical audiences |
|---|---|---|
| `calm` | Fades only. The expressive transforms resolve instantly (no bar-rise, no slide-in travel, no path-draw); `.count-up` jumps to its value. The text `.anim`/`.cascade` fade still plays. | briefing, documentation, internal/school-board |
| `standard` | The full vocabulary at normal pace. The default if the attribute is absent. | most decks — staff, students, instructional-guide, feature-overview, info-session, other-districts, partners-vendors, general-public |
| `lively` | The full vocabulary, scaled a touch larger/slower for stage presence (`--motion-scale: 1.15`). | showcase, launch, external/conference-peers |

`calm` never hides content — it removes *travel*, not the element. Everything
still reads on arrival, in print, and under reduced-motion.

## Quick reference for new partials

When you add a partial that animates:

1. Make the base style the **visible end-state**.
2. Pre-hide only on `deck-stage:not([noscale]) > .s:not([data-deck-active])`.
3. Wrap in `@media (prefers-reduced-motion: no-preference)`.
4. Use `--reveal-ease` and a `--motion-dur-*` token (×`--motion-scale`).
5. Don't loop. Don't use a custom easing.
6. Tag the partial with the modes (manual / autobuild / kiosk) and intensities
   it supports.
