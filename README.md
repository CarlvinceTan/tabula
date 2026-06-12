# tabula

[![skills.sh](https://skills.sh/b/carlvincetan/tabula)](https://skills.sh/carlvincetan/tabula)

An agent skill that turns a topic — researched from the web or from material you
provide — into a polished, **self-contained, visual-first HTML page** built to be
understood at a glance.

Instead of a wall of text, `tabula` leads with visuals — photos, charts,
diagrams, comparison tables, metric tiles — so the key points, trade-offs, and
recommendation land fast. Images expand in a lightbox, and one shared design
system keeps every output looking like one family.

## Formats

`tabula` picks the format that matches the job, all sharing one design system,
one engine, and one theme switcher:

| Job | Format |
| --- | --- |
| Several options to compare/choose — "best X", roundups, buying guides | **Report** |
| A snapshot of numbers/status — KPIs, metrics overview | **Dashboard** |
| Explaining how something works — a concept or process | **Explainer** |
| A head-to-head on shared criteria — "X vs Y vs Z" | **Comparison** |
| Something to present / click through — slides, a deck, a pitch | **Deck** |

## Install

With the [`skills`](https://github.com/vercel-labs/skills) CLI:

```bash
npx skills add CarlvinceTan/tabula
```

Install globally (available across projects) and non-interactively:

```bash
npx skills add CarlvinceTan/tabula -g -y
```

## Layout

- `SKILL.md` — the skill: first principles, format chooser, and build workflow.
- `references/design-system.md` — the shared look (tokens, grid, theme system).
- `references/formats/` — one recipe per format (`report`, `dashboard`,
  `explainer`, `comparison`, `deck`).
- `references/components.md` — the cross-format block library (images, galleries,
  charts, diagrams, tables, quotes, citations).
- `assets/template.html`, `assets/style.css`, `assets/app.js` — the base
  skeleton, full stylesheet, and engine (theming, charts, lightbox, deck nav).
- `scripts/inline_assets.py` — folds CSS/JS into a single self-contained HTML
  file for delivery.

## Usage notes

The skill authors a page with linked `style.css`/`app.js`, then bundles
everything into **one** self-contained HTML via `scripts/inline_assets.py` so the
delivered file renders correctly when opened straight from Downloads or an inline
previewer.
