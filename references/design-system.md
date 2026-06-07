# Design system

Every `tabula` format — report, dashboard, explainer, comparison, deck — draws
from this one system, so outputs look like members of the same family even though
their layouts differ. Don't invent new colors, fonts, or spacing per report; use
these tokens (all defined in `assets/style.css` `:root`). The rule of thumb from
the references that inspired this skill: **layout and structure vary by format;
the visual identity stays constant.**

## Tokens

**Paper (background).** A palette of soft tints, switchable live via the settings
panel and baked per report through `colorIndex` (0–7): ivory, canary, rose,
powder blue, sage, orchid, salmon, fog. Pick one that suits the subject; keep it
subtle. The chosen tint flows through `var(--bg)`.

**Ink (foreground).** `--ink` (#1a1a1a) for primary text, `--ink-secondary`
(60% black) for body, `--ink-muted` (25%) for captions/labels, `--divider` (10%)
for hairlines. Accents are deliberately sparse — green `#2e7d49` and red `#b2422f`
only for pros/cons and up/down deltas.

**Type.** Two roles: `--font-title` (display — headlines, section headings, metric
values, deck headings) and `--font-body` (everything else). Both are system stacks
(no web fonts to load). The headline font is switchable: SF Pro (default), Arial,
or Georgia serif via `fontIndex` 2/1/0.

**Grid & scale.** The editorial formats use a 12-column grid (`.report-wrap`) with
the root font-size scaling on viewport width, so the whole thing scales
proportionally. Spacing is in `rem`, so it scales with type. The dashboard and
comparison formats lay their own grids within a full-width band; the deck is
viewport-based.

## Theme system

The floating gear button (the settings panel) is the theme switcher: it changes
**paper color, headline font, and chart texture only** — never layout or
typography roles. Keep it in every format (the markup is in `template.html`). This
is the "color-only theme, structure preserved" idea: a reader can recolor the
piece without breaking its design.

Chart texture has three modes, set per report via `chartStyleIndex`: `pattern`
(textured fills, the house default), `color` (flat fills / brand color), and
`inked` (a hand-printed wobble applied to text and charts). The engine
(`app.js`) applies these automatically; just pass plain data to Chart.js.

## What stays constant across formats

- The paper + ink palette and the two type roles.
- Hairline borders, generous whitespace, restrained accents — a quiet,
  print-inspired feel, not a dashboard-y or neon look.
- Self-contained output: no external fonts; assets inlined into one HTML file.
- The settings/theme panel and the click-to-expand lightbox.

## What varies by format

- **Layout**: editorial column grid (report/explainer/comparison), tile grid
  (dashboard), or full-viewport slides (deck).
- **Dominant components**: photos & galleries (report), big-number tiles & charts
  (dashboard), diagrams & callouts (explainer), option columns & matrices
  (comparison), one-idea-per-slide (deck).
- **Density & reading mode**: skim-and-compare vs. read-through vs. present.
