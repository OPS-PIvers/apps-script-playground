# The Apps Script Playground

Slide deck for the **MN Thought Leaders Summit · 2026** session by the Orono Public Schools Technology Department.

**Core message:** anybody can build highly functional web apps now — with a Google Sheet behind them and AI beside you.

## View the deck

Live: **https://ops-pivers.github.io/apps-script-playground/**

Or serve it locally (the deck loads media via `fetch`, so open it over HTTP, not `file://`):

```
python -m http.server 8000
# then visit http://localhost:8000/
```

## Presenting

- **→ / ←** advance and rewind slides; the left rail jumps anywhere.
- Demo clips autoplay muted and loop. Click any filled media frame to open it large in a lightbox (Esc closes).
- Speaker notes are embedded in the HTML (`#speaker-notes`) and used by the presenter view in `deck-stage.js`.

## How it's put together

| File | Role |
|---|---|
| `The Apps Script Playground.html` | The deck — 23 slides authored at 1920×1080 |
| `colors_and_type.css` | Orono Technology design tokens (colors, type, spacing) |
| `deck-stage.js` | `<deck-stage>` web component — navigation, rail, presenter view |
| `media-slot.js` / `image-slot.js` | Drop-in media placeholders; `src` attributes point at `media/` so the deck travels with its demos |
| `media-lightbox.js` | Click-to-enlarge modal for any filled media slot |
| `media/` | Demo recordings (H.264 MP4) and QR codes |
| `assets/` | Orono Technology logos and torch marks |

Built with Google Apps Script energy: no build step, no framework, no server — static files all the way down.
