# Structure: documentation

## Purpose
Reference material. People come to **look something up**, not to be walked
through it. Organized by section with a table of contents, and built to survive
being printed or handed off as a PDF.

## Default reveal mode
`manual`. Documentation is browsed, not built; no auto-advance.

## Slide sequence
1. `cover`
2. `agenda` — used as a table of contents
3. `section-divider`
4. Per section, choose from: `head-block` / `feature-table` / `code-block` / `callout`
   — repeat the divider + section body for each topic
5. `recap` or an index slide
6. `close`

## Density guidance
**Dense-tolerant and print-friendly.** This is the one structure where a packed
slide is fine — full `feature-table`s, complete `code-block`s, dense reference
text. Favor light themes and calm motion so it reads and prints cleanly.

## Audience-overridable knobs
- The per-section partial mix (which of head-block / feature-table / code-block /
  callout each section uses).
- Theme, tone, motion intensity — always the audience's.

## Polls / QR expectation
No polls. QR optional — usually a deep link to the canonical online doc.
