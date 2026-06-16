# Structure: instructional-guide

## Purpose
A how-to meant to be **read on a screen**, not presented from a stage. A single
person follows it at their own pace to accomplish one task. Linear, calm, no
showmanship.

## Default reveal mode
`manual` — the reader advances when they have finished a step. (Kiosk/autobuild
would rush a self-paced reader; avoid.)

## Slide sequence
1. `cover`
2. `agenda` — what we'll do
3. `prerequisites`
4. `step-screenshot` ×N — the steps, in order
5. `callout` — inserted as needed for warnings, tips, gotchas
6. `checklist` — "you're done when…"
7. `recap`
8. `close`

## Density guidance
**Light and calm.** One step per slide, clear screenshot, short imperative
caption. Callouts only where a step genuinely traps people.

## Audience-overridable knobs
- Number of `step-screenshot` repeats (N) and where callouts land.
- Theme, tone, motion intensity — always the audience's (defaults to calm/standard).

## Polls / QR expectation
No polls. QR optional — typically a link to the live tool or a support contact.
