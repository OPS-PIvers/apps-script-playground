# Audiences

An **audience** is the *who* axis of a deck: tone, theme, reading level,
density, formality, motion intensity, and the QR / poll / badge defaults that
suit a particular room. Pick one audience and pair it with one
[structure](../structures/README.md). The two compose: **N structures + M
audiences, not N×M** — the same showcase structure becomes a conference talk or
a board presentation purely by swapping the audience.

Audiences own **feel and presentation**. They stay silent on slide sequence and
which partials appear — that belongs to the structure layer.

## The precedence rule

On conflict:

- **Audience wins** tone, theme (Mode 1 / Mode 2, dark / light), formality,
  density, and `data-motion` intensity (`calm` / `standard` / `lively`, set on
  `<deck-stage>` — see [`_brand/MOTION.md`](../../../_brand/MOTION.md)).
- **Structure wins** the slide sequence, the partials, and the narrative arc.

A structure may also declare a few **audience-overridable knobs** (e.g. reveal
mode, poll/QR defaults); outside those, the structure's sequence is fixed and
the audience only restyles it.

## The default

When no audience is named, use **`internal/staff`**. It is the everyday peer
voice for Orono staff: Mode 1, dark default, standard motion.

## Theme vocabulary (defer specifics to `ops-brand-guidelines` + DESIGN.md)

- **Mode 1 (official)** — the standard, restrained brand presentation.
- **Mode 2 (playful)** — looser latitude (palette can flex; logos stay
  as-issued). Reserved for the audiences noted below.
- **Dark vs light** — slides **default to navy / dark**; light is chosen
  deliberately by the audiences that ask for it (board, leadership, community,
  public). Do not hardcode hex here — pull exact values from the
  `ops-brand-guidelines` skill and DESIGN.md.

## The nine audiences

| Audience | One line |
|---|---|
| [internal/staff](internal/staff.md) **(default)** | Peer tone for Orono staff; some jargon OK. |
| [internal/students](internal/students.md) | Simpler, encouraging; Mode 2 latitude, polls welcome. |
| [internal/school-board](internal/school-board.md) | Formal, concise, decisions first; light + calm. |
| [internal/parents-community](internal/parents-community.md) | Warm, zero jargon, "what it means for you." |
| [internal/district-leadership](internal/district-leadership.md) | Strategic, metrics-forward; light, calm-standard. |
| [external/conference-peers](external/conference-peers.md) | Confident, credibility cues; dark, lively, QR/badge on. |
| [external/other-districts](external/other-districts.md) | Practical, replicable, "you can do this too." |
| [external/partners-vendors](external/partners-vendors.md) | Professional, value-and-fit framing. |
| [external/general-public](external/general-public.md) | Plain language, big visuals; light. |
