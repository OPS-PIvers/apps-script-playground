---
name: {{brand-slug}}-brand-guidelines
description: "Apply the {{BRAND_NAME}} brand — colors, fonts, and logos — to slide decks, presentations, documents, newsletters, reports, and web pages. Use whenever someone asks for any of those, even if they don't say 'on-brand': on-brand is the default. Also use when someone mentions {{ORG NAME, NICKNAMES, MASCOT, BRAND COLORS, LOGO NAMES, FONT NAMES}}. Comes with a portable DESIGN.md token file for handing off to other tools."
license: MIT License
---

# {{BRAND_NAME}} Brand Guidelines

## How to think about this skill

This skill gives you the ingredients of the {{BRAND_NAME}} brand — not a rigid
template. Build something clean that uses those ingredients well, making good
choices for the specific piece in front of you.

*State your brand's core stance in a line or two: the feeling everything should
give, and the one or two rules that never bend (for example, logos are never
recolored or redrawn).*

### Two modes (optional — delete if your brand has only one)

1. **Official / formal work.** Use the full system: primary color leads, accent
   used sparingly, the two brand fonts. This is the serious, trustworthy voice.
2. **Playful / informal work.** You have room to choose a palette that fits the
   topic. Brand colors can still show up as accents, but don't force them. The
   logos stay exactly as issued in either mode.

If you're not sure which one fits, match the tone the person used when they
asked, or just ask them.

### Working alongside other tools

If a tool or skill already handles the format (a slide builder, a document
helper), follow its general design advice — visual variety, no walls of text.
This skill doesn't replace that. It supplies the brand ingredients those good
habits should use.

### DESIGN.md — the file with the exact values

Next to this file is DESIGN.md. It holds every exact value: colors, fonts,
spacing, and ready-made component styles.

- **Before building anything official, read it first.** Use its component
  styles for web pieces — they bundle the colors, spacing, and fonts that go
  together, so the result looks consistent instead of just correct.
- **Handing the brand to another tool** (a code editor, a design tool, a
  different assistant)? Give them DESIGN.md on its own. It's built to travel.
- **Generating a settings file** (CSS variables, a Tailwind config)? Build it
  from DESIGN.md, not from the quick tables in this file.

In short: DESIGN.md is *what* the brand is; this file is *how* to apply it. If
the two ever disagree on a value, DESIGN.md is correct.

---

## Colors at a glance

The exact values live in DESIGN.md. Here are the few you'll reach for most.
*Replace the names, hex codes, and uses with your own.*

| Name | Hex | Used for |
|---|---|---|
| Primary | `#XXXXXX` | The main brand color: headers, nav, primary buttons |
| Primary dark | `#XXXXXX` | Strongest emphasis, full-bleed backgrounds |
| Accent | `#XXXXXX` | Emphasis and warnings, used sparingly |
| Body text | `#333333` | Normal text (not pure black) |

**Balance:** aim for the primary to dominate, the accent to appear only as a
highlight, and neutrals to fill the rest. *Set your own rough split here, e.g.
60% primary / 15% accent / 25% neutral.*

---

## Fonts

- **Headings: {{HEADING_FONT}}** — *one line on the feel it gives.*
- **Body: {{BODY_FONT}}** — *one line.*
- **Backups** (for places the brand fonts aren't installed): {{FALLBACK_FONTS}}.
  Never use {{BANNED_FONTS}}.

### Drop-in CSS for web pages

```css
@import url('{{FONT_IMPORT_URL}}');

:root {
  --brand-primary-dark:  #XXXXXX;
  --brand-primary:       #XXXXXX;
  --brand-primary-light: #XXXXXX;
  --brand-accent:        #XXXXXX;
  --brand-text:          #333333;
  /* add more from DESIGN.md as you need them */

  --brand-font-heading: "{{HEADING_FONT}}", -apple-system, "Segoe UI", sans-serif;
  --brand-font-body:    "{{BODY_FONT}}", -apple-system, "Segoe UI", Arial, sans-serif;
}

body { font-family: var(--brand-font-body); color: var(--brand-text); }
h1, h2, h3, h4, h5, h6 { font-family: var(--brand-font-heading); }
```

---

## Logos

This is the part most worth getting right. List each logo file, what it is, and
when to use it.

### Your logo files

*Put these in a Resources folder beside this file and fill in the table.*

| File | What it is | When to use it |
|---|---|---|
| `Resources/{{primary-logo}}.png` | *e.g. the wide, main logo* | The default — title slides, headers, nav bars |
| `Resources/{{secondary-logo}}.png` | *e.g. a square version* | Tight or square spots — footers, profile pictures, app icons |
| `Resources/{{icon}}.png` | *e.g. the symbol alone* | Small accents, watermarks, the browser favicon |

### Where logos go

*For each place you produce — title slide, content slides, document header and
footer, web nav, favicon — say which logo goes there and roughly how big.*

### Logo rules

- Don't recolor it. The colors in the logo are fixed.
- Don't stretch it. Keep its proportions.
- Don't rebuild it in code or swap in an emoji. Use the real image file.
- Don't shrink it so small the text breaks up.
- *Add your brand's specific trap — for example, a logo that vanishes on a dark
  background and needs a light panel behind it.*

### Always ship the logo with the file

When you add a logo to a deck or document, copy the image file into the same
folder as the finished piece. Don't link back to this skill's Resources folder —
the image has to travel with the deliverable.

---

## Guidance by type of work (keep what you make, delete the rest)

### Slide decks

*Is there a default look — light slides, or a dark brand-colored background?
Describe the title slide, the content slides, and a few slide-specific things to
avoid. If you build decks with code, a starter color block can go here.*

### Documents and newsletters

*Describe the header (logo and a dividing line), the body text size and color,
the heading colors, callout boxes, the footer, and how tables should look.*

### Web pages, tools, and dashboards

*For web work, lean on the component styles in DESIGN.md (buttons, inputs,
cards, tables, and so on) rather than inventing combinations. Drop in the CSS
above, then follow those components.*

---

## Handing the brand to another tool

To use this brand outside this assistant — in a code editor, a design tool, or
another AI — give them **DESIGN.md by itself**. It's self-contained.

- **Code editor:** put DESIGN.md in the project and tell the tool to follow it
  for all styling.
- **Web project (Tailwind):** its color, font, spacing, and corner values map
  straight into a Tailwind config.
- **Plain CSS:** each value becomes a `--brand-` variable.
- **Design tool (Figma):** the colors and fonts map to its variables.

---

## What's in this folder

| File | What it's for |
|---|---|
| `DESIGN.md` | The exact brand values. Hand this off to other tools, or read it when building. |
| `Resources/{{primary-logo}}.png` | *your main logo* |
| `Resources/{{secondary-logo}}.png` | *your square logo* |
| `Resources/{{icon}}.png` | *your symbol / favicon* |
| `Resources/{{stylesheet}}.pdf` | *your official printed style guide, if you have one* |

---

## Quick check before sending anything out

- [ ] Does this look like {{BRAND_NAME}}, or could it be from anyone?
- [ ] Official work: primary color dominates, accent is just a highlight, no stray colors
- [ ] Web work: used the component styles from DESIGN.md, not made-up combinations
- [ ] {{HEADING_FONT}} for headings, {{BODY_FONT}} for body — no banned fonts
- [ ] Body text is dark gray, not pure black
- [ ] The right logo, the right size, the right spot — not recolored or stretched
- [ ] Logo image is saved alongside the finished file
- [ ] *Your brand's most common mistake is checked*
