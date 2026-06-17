# **SKILL.md**

## **Overview:**

A "skill" is a folder of instructions an AI assistant reads to learn how to do something. This file is the "WHEN, WHERE, and HOW" to apply the brand and style requirements. 

When you ask AI to make a slide deck, a document, or a web page, it reads SKILL.md to decide whether your brand applies and how to apply it. Then it pulls the exact colors and fonts from the partner file, DESIGN.md, from tab 1 of this document.

## **Prompt (Copy everything below and paste into your LLM chat):**

You are helping me turn a blank "SKILL.md" skeleton into a finished set of brand guidelines.

SKILL.md is the file an AI assistant reads to learn *when* to apply my brand and *how* to apply it — judgment, logo placement, and what to avoid. It has a partner file, DESIGN.md, which holds the exact colors, fonts, and styles. SKILL.md is the "when and how"; DESIGN.md is the "what." I will paste the SKILL.md skeleton at the end of this message. Your job is to fill it in completely and return the finished file.

### **What I'm giving you**

* The SKILL.md skeleton (at the bottom), full of placeholders to replace.  
* Optionally, my completed DESIGN.md. If I include it, treat it as the source of truth for my brand name, colors, and fonts, and make SKILL.md match it exactly — do not invent different values.  
* Whatever else I know about my brand. This might be detailed, or just a name and a one-line description — that's fine.

### **Step 1 — Make sure you have what you need**

Check whether you have all of these:

1. The brand or organization name (and a short lowercase slug for it, like riverside-robotics, used in the skill's name).  
2. A one-line sense of what the brand is and its personality.  
3. The kinds of things people make with this brand — slides, documents, newsletters, reports, web pages, dashboards, and so on. This decides both the trigger description and which "guidance by type of work" sections to keep.  
4. The words that should make an assistant reach for this brand: the org name, any nicknames, a mascot, the brand color names, the logo names, the font names.  
5. The logo files: their filenames, what each one is (for example, a wide main logo, a square version, a symbol only), and where each is used.  
6. Whether the brand has one mode or two (a formal/official mode and a more playful/informal mode).

Then:

* If you have enough to make reasonable choices, go straight to Step 2 and list your assumptions at the end.  
* If something essential is missing, ask me up to five short questions in a single message, wait for my reply, then continue. Don't ask one at a time.

Two things you should not invent with false confidence:

* **Logos.** These are real image files I have to supply. If I haven't told you their names and uses, either ask, or fill in clearly labeled placeholder filenames and call them out at the end as something I must replace and confirm.  
* **The trigger keywords.** If you're unsure what people call my brand, ask rather than guessing.

### **Step 2 — Fill in the skeleton**

Replace everywhere it appears:

* Every ALL-CAPS placeholder (such as BRAND\_NAME, HEADING\_FONT, FONT\_IMPORT\_URL).  
* Every {{word in braces}} (including the skill name: slug and the logo filenames in the tables).  
* Every \#XXXXXX hex placeholder, and the colors in the "colors at a glance" table and the drop-in CSS block. If I gave you DESIGN.md, copy these straight from it so the files agree; don't pick new colors.  
* Every short *italic prompt* in the prose: replace each with one to three plain-language sentences in a clear, plain voice, then delete the prompt itself. These are where the real guidance lives — the brand's personality, where each logo goes, what a slide deck or document should look like, and the specific mistakes to avoid.

Leave the rest as it is:

* Do NOT add or remove the structural sections beyond the optional ones described below. Work inside the structure I give you.  
* Keep the generic logo rules and the "always ship the logo with the file" note — they apply to almost any brand.  
* Delete the instruction comment block at the very top (the \<\!-- ... \--\> part), and delete the author-guidance comment lines in the frontmatter (the lines that explain how to write the description). The finished file should read like real guidelines, not a template.

Handle the optional sections by what I actually make:

* If I use only one mode, delete the "Two modes" section and any wording that assumes a second mode.  
* Under "Guidance by type of work," keep only the sections for things I produce (slides, documents, web) and delete the others.

### **Step 3 — The description line (read carefully)**

The description: in the frontmatter is the single most important line in the file. It is what an assistant reads to decide whether to use this skill at all, so it must be specific. Write it to include all of these:

1. What it does, starting with an action — "Apply the \[Brand\] brand: colors, fonts, and logos…"  
2. The kinds of things it covers — name the deliverables (slides, presentations, documents, newsletters, reports, web pages, dashboards).  
3. A line saying to use it whenever someone asks for any of those, even if they don't say "on-brand" — because on-brand is the default.  
4. The trigger words from Step 1 (org name, nicknames, mascot, color names, logo names, font names).  
5. A short note that it comes with a portable DESIGN.md file for handing the brand off to other tools.

Keep it to a few sentences. Make it concrete, not generic.

### **Quality rules**

* Write in plain, friendly language a first-time reader could follow. Avoid jargon; when a technical word is unavoidable, say what it means in a few words.  
* Keep SKILL.md consistent with DESIGN.md. Where they mention the same thing (name, colors, fonts), the values must match. If they ever disagree, DESIGN.md is the correct one.  
* Keep the brand's voice consistent across the personality notes, the logo rules, and the medium guidance.  
* Don't contradict the generic logo rules already in the file.

### **What to return**

1. The complete, finished SKILL.md inside a single code block, ready for me to save as-is.  
2. After the code block, a short bullet list of:  
   * any wording, modes, or sections you chose, assumed, or removed, and  
   * anything I still need to supply or confirm myself — especially the real logo filenames and where each logo should go.

Here is the skeleton to fill in:

````
---
name: {{brand-slug}}-brand-guidelines
# The "description" below is the single most important line. It is how the
# assistant decides whether to use this skill at all. Make it specific: name
# the things that should trigger it (slides, decks, documents, newsletters,
# reports, web tools) and the words that signal your brand (your org name,
# nicknames, mascot, brand colors, logo names, font names). Say that on-brand
# is the default, so it gets used even when nobody says "make it on-brand."
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
````

