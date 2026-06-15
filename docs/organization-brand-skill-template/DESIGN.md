---
version: alpha
name: {{BRAND_NAME}} Style
description: One sentence on what this brand is and when to use it — the things it covers (slides, docs, web, print) and the feeling it should give. An assistant reads this to decide if the file applies.

colors:
  # ------------------------------------------------------------------------
  # CANONICAL BRAND COLORS — these ARE your brand. Replace the hex values.
  # Keep the list short: one primary family, one accent family, one neutral
  # family. Everything below is built from these.
  # ------------------------------------------------------------------------

  # Primary family — your main, dominant color
  primary-lighter: "#XXXXXX"   # faint tint, for callout backgrounds
  primary-light:   "#XXXXXX"   # supporting elements, hover states
  primary-base:    "#XXXXXX"   # THE brand color: buttons, nav, headings
  primary-dark:    "#XXXXXX"   # strongest emphasis, full-bleed backgrounds

  # Accent family — used sparingly, for emphasis and warnings
  accent-lighter: "#XXXXXX"
  accent-light:   "#XXXXXX"
  accent-base:    "#XXXXXX"
  accent-dark:    "#XXXXXX"

  # Neutral family — grays for text, borders, and backgrounds
  neutral-lightest: "#f3f3f3"
  neutral-lighter:  "#cccccc"
  neutral-light:    "#999999"
  neutral-base:     "#666666"
  neutral-dark:     "#333333"   # default body-text color (not pure black)
  neutral-darkest:  "#1a1a1a"

  white: "#ffffff"
  black: "#000000"

  # ------------------------------------------------------------------------
  # TINT RAMPS — each family expanded into 11 shades, so web pages have
  # enough range for hover states, borders, disabled looks, and so on.
  # Generate these from the canonical values with any color-shade tool.
  # If you only make slides and documents, you can delete this whole block.
  # ------------------------------------------------------------------------

  primary-50:  "#XXXXXX"
  primary-100: "#XXXXXX"   # same as primary-lighter
  primary-200: "#XXXXXX"
  primary-300: "#XXXXXX"
  primary-400: "#XXXXXX"
  primary-500: "#XXXXXX"
  primary-600: "#XXXXXX"   # same as primary-light
  primary-700: "#XXXXXX"   # same as primary-base (THE brand color)
  primary-800: "#XXXXXX"   # pressed / active button
  primary-900: "#XXXXXX"   # same as primary-dark
  primary-950: "#XXXXXX"

  accent-50:  "#XXXXXX"
  accent-100: "#XXXXXX"    # same as accent-lighter
  accent-200: "#XXXXXX"
  accent-300: "#XXXXXX"
  accent-400: "#XXXXXX"
  accent-500: "#XXXXXX"
  accent-600: "#XXXXXX"    # same as accent-light
  accent-700: "#XXXXXX"    # same as accent-base
  accent-800: "#XXXXXX"
  accent-900: "#XXXXXX"    # same as accent-dark
  accent-950: "#XXXXXX"

  neutral-50:  "#fafafa"
  neutral-100: "#f3f3f3"   # same as neutral-lightest
  neutral-200: "#e0e0e0"
  neutral-300: "#cccccc"   # same as neutral-lighter
  neutral-400: "#b3b3b3"
  neutral-500: "#999999"   # same as neutral-light
  neutral-600: "#808080"
  neutral-700: "#666666"   # same as neutral-base
  neutral-800: "#4d4d4d"
  neutral-900: "#333333"   # same as neutral-dark (default body text)
  neutral-950: "#1a1a1a"   # same as neutral-darkest

  # ------------------------------------------------------------------------
  # SEMANTIC ROLES — tokens named for their job. Build with THESE. They point
  # at the ramp above, so once your colors are set they update automatically.
  # ------------------------------------------------------------------------

  primary:         "{colors.primary-700}"
  primary-strong:  "{colors.primary-900}"
  primary-muted:   "{colors.primary-600}"
  primary-subtle:  "{colors.primary-100}"

  accent:          "{colors.accent-700}"
  accent-strong:   "{colors.accent-900}"
  accent-muted:    "{colors.accent-600}"
  accent-subtle:   "{colors.accent-100}"

  # Surfaces (backgrounds)
  surface:          "{colors.white}"
  surface-subtle:   "{colors.neutral-50}"
  surface-alt:      "{colors.neutral-100}"
  surface-inverted: "{colors.primary-900}"   # dark background
  surface-raised:   "{colors.primary-700}"

  # Text sitting on those surfaces
  on-surface:                "{colors.neutral-900}"
  on-surface-muted:          "{colors.neutral-700}"
  on-surface-subtle:         "{colors.neutral-600}"
  on-surface-disabled:       "{colors.neutral-500}"
  on-surface-inverted:       "{colors.white}"      # text on a dark background
  on-surface-inverted-muted: "{colors.primary-100}"

  # Borders and lines
  border-subtle: "{colors.neutral-200}"
  border:        "{colors.neutral-300}"
  border-strong: "{colors.neutral-500}"
  border-accent: "{colors.primary-700}"
  border-focus:  "{colors.primary-600}"

  # The glow around a clicked/tabbed-into field. Important for accessibility.
  focus-ring: "rgba(0,0,0,0.1)"   # set to your primary color at ~10% opacity

  # Status colors
  info:       "{colors.primary-700}"
  info-bg:    "{colors.primary-100}"
  warning:    "{colors.accent-700}"
  warning-bg: "{colors.accent-100}"
  error:      "{colors.accent-800}"
  success:    "{colors.primary-600}"   # swap for a green if your brand has one

  # Hover / pressed pairs
  primary-hover:  "{colors.primary-800}"
  primary-active: "{colors.primary-900}"
  accent-hover:   "{colors.accent-800}"
  accent-active:  "{colors.accent-900}"

typography:
  # Set fontFamily on every line below: headings use {{HEADING_FONT}},
  # body and labels use {{BODY_FONT}}. The sizes and weights are a balanced
  # default scale — keep them unless your brand has its own type rules.
  display:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
  title-lg:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
  title-md:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  title-sm:
    fontFamily: "{{HEADING_FONT}}"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-md:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0.02em
  label-sm:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.03em
  overline:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.1em
    textTransform: uppercase
  caption:
    fontFamily: "{{BODY_FONT}}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4

spacing:
  # An 8px rhythm. Works for almost everything; safe to leave as-is.
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  gutter: 24px
  margin: 32px
  container-max: 1200px

rounded:
  # How round your corners are. Lower = serious, higher = friendly.
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

shadow:
  # Restrained by default. Bigger shadows make things feel like they float.
  none: "none"
  subtle: "0 1px 2px rgba(0,0,0,0.08)"
  soft:   "0 2px 8px rgba(0,0,0,0.10)"
  medium: "0 4px 12px rgba(0,0,0,0.12)"
  strong: "0 8px 24px rgba(0,0,0,0.16)"

components:
  # Ready-made recipes for common pieces of a page. Each one bundles the
  # background, text, border, corners, padding, and font that go together,
  # so things look consistent. They point at the tokens above, so they work
  # once your colors and fonts are set. Add or remove to match what you build.

  # --- Buttons ---
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-primary-disabled:
    backgroundColor: "{colors.neutral-300}"
    textColor: "{colors.neutral-600}"

  button-secondary:
    backgroundColor: "{colors.neutral-700}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-secondary-hover:
    backgroundColor: "{colors.neutral-800}"

  button-outlined:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    borderWidth: 1.5px
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-outlined-hover:
    backgroundColor: "{colors.primary-50}"

  button-inverted:                 # for use on dark backgrounds
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary-900}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px

  button-destructive:              # delete, remove, anything irreversible
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    paddingX: 20px
    paddingY: 10px
  button-destructive-hover:
    backgroundColor: "{colors.accent-hover}"

  # --- Text inputs ---
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.border}"
    borderWidth: 1.5px
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    paddingX: 12px
    paddingY: 10px
  input-hover:
    borderColor: "{colors.border-strong}"
  input-focus:
    borderColor: "{colors.border-focus}"
    boxShadow: "0 0 0 3px {colors.focus-ring}"   # the accessibility glow
  input-error:
    borderColor: "{colors.accent}"
  input-disabled:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.on-surface-disabled}"
  input-label:
    typography: "{typography.label-md}"
    textColor: "{colors.on-surface}"
  input-helper:
    typography: "{typography.caption}"
    textColor: "{colors.on-surface-subtle}"
  input-error-message:
    typography: "{typography.caption}"
    textColor: "{colors.accent-600}"

  # --- Callouts (a tinted box with a colored left edge) ---
  callout-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.on-surface}"
    borderLeftColor: "{colors.info}"
    borderLeftWidth: 3px
    rounded: "{rounded.md}"
    padding: 20px
  callout-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.accent-900}"
    borderLeftColor: "{colors.warning}"
    borderLeftWidth: 3px
    rounded: "{rounded.md}"
    padding: 20px
  callout-neutral:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.on-surface}"
    borderLeftColor: "{colors.neutral-700}"
    borderLeftWidth: 3px
    rounded: "{rounded.md}"
    padding: 20px

  # --- Cards ---
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-subtle}"
    borderWidth: 1px
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "{shadow.subtle}"
  card-raised:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: 24px
    shadow: "{shadow.soft}"
  card-subtle:
    backgroundColor: "{colors.surface-alt}"
    rounded: "{rounded.lg}"
    padding: 24px

  # --- Tables ---
  table-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    paddingX: 16px
    paddingY: 12px
  table-row:
    backgroundColor: "{colors.white}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    borderBottomColor: "{colors.border-subtle}"
    paddingX: 16px
    paddingY: 12px
  table-row-alt:
    backgroundColor: "{colors.surface-alt}"

  # --- Navigation bar ---
  nav-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
    paddingX: 24px
    paddingY: 16px
  nav-link:
    textColor: "{colors.white}"
    typography: "{typography.label-lg}"
  nav-link-active:
    textColor: "{colors.primary-100}"
    borderBottomColor: "{colors.accent}"
    borderBottomWidth: 2px

  # --- Badges / chips ---
  badge:
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-900}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    paddingX: 10px
    paddingY: 4px
  badge-accent:
    backgroundColor: "{colors.accent-100}"
    textColor: "{colors.accent-900}"
  badge-neutral:
    backgroundColor: "{colors.neutral-200}"
    textColor: "{colors.neutral-900}"

  # --- Chart colors --- (delete if you never make charts)
  chart-series-1: { color: "{colors.primary-700}" }
  chart-series-2: { color: "{colors.accent-700}" }
  chart-series-3: { color: "{colors.primary-600}" }
  chart-series-4: { color: "{colors.accent-600}" }
  chart-series-5: { color: "{colors.primary-400}" }
  chart-series-6: { color: "{colors.accent-400}" }
  chart-gradient-start: { color: "{colors.primary-100}" }
  chart-gradient-end:   { color: "{colors.primary-900}" }
  chart-axis: { color: "{colors.neutral-700}" }
  chart-grid: { color: "{colors.neutral-200}" }
---

# {{BRAND_NAME}} Style

The section above (the frontmatter) holds the exact values. The sections below
explain the reasoning in plain language, so anything reading this file makes
good judgment calls, not just color-correct ones. Replace each italic prompt
with a few sentences of your own, then delete the prompt.

## Overview

*Describe your brand's personality in two or three sentences. Is it formal or
relaxed? Warm or crisp? What feeling should every piece leave someone with, and
where will people see it — a phone, a slide across a room, a printed page?*

## How this file is organized

There are two parts to the values above:

1. **Canonical colors** — the small set of exact colors that *are* the brand.
   Never change these once they're set.
2. **Tint ramps** — those same colors expanded into light-to-dark shades, so
   web pages have enough range to work with.

When you build something, reach for the **semantic** tokens first (`primary`,
`surface`, `on-surface`, `border`, `info`). They describe the job, so they read
clearly and adapt to light or dark. Drop down to a raw shade (`primary-300`)
only when no semantic token fits.

## Colors

*Say what each family is for. Which color carries the brand and should dominate?
Which is the accent you use sparingly? Note that body text uses the dark neutral,
not pure black.*

**Balance:** official pieces usually land near 60% primary, 15% accent, 25%
neutral. If the accent starts competing with the primary, pull it back.

**Charts:** use series in this order — primary, accent, primary-light,
accent-light, and so on. Don't add colors from outside the palette unless the
data truly needs them.

## Typography

*Name your two fonts and what each does (one for headings, one for body). List
a backup font for places your brand font isn't installed, and name any fonts
that are off-limits. Two fonts is the rule — resist adding a third.*

## Layout

Content sits on an 8px spacing rhythm and a max width of 1200px on large
screens. Small gaps between related things, bigger gaps between sections.

## Depth and shadows

*How does this brand show that one thing sits above another — thin borders and
barely-there shadows (calm, "paper on paper"), or bigger shadows (things float)?
On dark backgrounds, depth usually comes from layering slightly different shades
rather than shadows.*

## Shapes

*What corner roundness is the default, and what does it signal? One rule to keep:
don't mix different corner roundnesses inside the same group of elements.*

## Components

*Note any rules worth stating: e.g. only one primary button per screen; the
accent color is reserved for a single key emphasis per view; the focus glow on
inputs is required for accessibility and shouldn't be removed.*

## Do's and don'ts

- Do build with the semantic tokens (`primary`, `surface`, `border`) first.
- Do keep the primary color dominant in official pieces.
- Do use the accent sparingly — one key emphasis at a time.
- Do use the dark neutral for body text, never pure black.
- Do use exactly two fonts.
- Don't invent new colors; the ramps already cover what UI needs.
- Don't let the accent match the primary in visual weight.
- Don't use heavy shadows unless the brand calls for it.
- *Add the specific mistakes that hurt your brand most.*
