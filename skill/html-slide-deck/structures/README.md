# Structures

A **structure** is the *purpose* axis of a deck: the ordered slide sequence and
which partials fill it. Pick one structure for *what the deck is for* (an
external talk, a hands-on workshop, a board briefing) and one **audience** for
*who it's for*. The two compose: **N structures + M audiences, not N×M.** A
showcase deck for the school board and a showcase deck for conference peers are
the same structure with two different audiences swapped in.

Structures own **sequence, partials, and narrative**. They stay silent on
theme, tone, formality, density-as-feel, and motion intensity — those belong to
the [audience layer](../audiences/README.md).

## The precedence rule

On conflict:

- **Audience wins** tone, theme (Mode 1 / Mode 2, dark / light), formality,
  density, and `data-motion` intensity.
- **Structure wins** slide sequence, which partials appear, and the narrative
  arc.

Each structure may name **audience-overridable knobs** — the few choices
(usually reveal mode, poll/QR defaults, density target) it is willing to let the
audience flip. Anything not listed as overridable is fixed by the structure.
The default audience when none is named is [`internal/staff`](../audiences/internal/staff.md).

## What each file documents

Every `structures/*.md` carries: **Purpose**, **Default reveal mode**
(`manual` | `autobuild` | `kiosk`; default `manual`), **Slide sequence**
(ordered partial names, `×N` where a block repeats), **Density guidance**,
**Audience-overridable knobs**, and **Polls / QR expectation**.

## The nine structures

| Structure | Purpose (one line) |
|---|---|
| [showcase](showcase.md) | External talk / keynote — the reference-deck shape. |
| [workshop](workshop.md) | Hands-on PD; learners do the steps as you go. |
| [instructional-guide](instructional-guide.md) | A how-to meant to be read on screen, not presented. |
| [documentation](documentation.md) | Reference material — dense, scannable, print-friendly. |
| [launch](launch.md) | Announce something new with momentum and drama. |
| [feature-overview](feature-overview.md) | Explain one feature to people who already use the product. |
| [briefing](briefing.md) | Decisions and outcomes for a board or cabinet. |
| [kickoff-roadmap](kickoff-roadmap.md) | Align a project team on goals, roles, and timeline. |
| [info-session](info-session.md) | Friendly general explainer for a community / family audience. |
