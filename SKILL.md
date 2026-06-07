---
name: tabula
description: >-
  Turn a topic — researched from the web or from material the user provides — into
  a polished, self-contained, visual-first HTML page built to be understood at a
  glance. Picks the right format: a research report/roundup ("best X near Y",
  compare options, things to do, buying guides), a metrics dashboard, a concept
  explainer with diagrams, a head-to-head comparison/decision matrix, or a slide
  deck. Leads with visuals — photos, charts, diagrams, comparison tables, metric
  tiles — over walls of text, so the key points and recommendation land fast;
  images expand in a lightbox and one shared design system keeps every format
  consistent. Use whenever someone wants a shareable visual page or presentation
  rather than a chat answer: "make a report/dashboard/deck/explainer on X",
  "compare A vs B vs C", "best X for Y", "visualize this", "turn this into slides",
  roundups and guides. Trigger even without the word "report". Do NOT use for a
  single fact, a quick chat answer, code, or a plain text/markdown summary wanted
  inline.
---

# Tabula

Turn a topic into a standalone HTML page that is **visual-first and built to be
understood fast**. The guiding idea: a reader should skim and come away with the
key points, the trade-offs, and the recommendation without reading every word —
because the substance is carried by visuals (photos, galleries, diagrams, charts,
tables, metric tiles) with prose as connective tissue, not the main event.

`tabula` produces several **formats** for different jobs, all sharing one design
system, one engine, and one theme switcher, so they look like one family. The
source can be **web research** (when the topic needs current facts) or **material
the user already provided** (a doc, notes, data) — research only when freshness
matters.

## First principles

These hold across every format — they're what make the output a *tabula* rather
than a wall of text with a nice font:

- **Show, don't tell — aggressively.** Every section should have something to
  *look at*, not just read. Before writing a paragraph or a bullet list, ask what
  visual carries the point better: a chart, a diagram, a score meter, a stat
  figure, an image, a labeled table. Prose is the caption, not the content.
- **No section is text-only.** If you can't source a photo for a section, you can
  always *generate* a visual — a chart, an inline-SVG diagram, score-meter bars,
  or big stat figures need no sourcing and aren't copyrighted. A section that's
  only prose + bullets is a miss; convert it.
- **Skimmable in 30 seconds.** Headline, metrics, badges, and headings carry the
  gist alone. Lead with the takeaway before the detail.
- **One idea per section, one glance to grasp it.** Keep units focused and let
  the visual explain.
- **Earn every word.** Trim prose to what the visuals don't already say. Bullets
  are a last resort, not the default texture of the page.

## Choose a format

Pick the format that matches what the user is really after, then read that
format's recipe in `references/formats/`. Most tasks fit one; some blend (a report
can contain a chart, a comparison can sit inside a report) — pick the dominant
shape.

| If the task is… | Format | Recipe |
| --- | --- | --- |
| Several options to compare/choose among — "best X", roundups, guides, "things to do in Z" | **Report** | `formats/report.md` |
| A snapshot of numbers/status — KPIs, an overview of metrics | **Dashboard** | `formats/dashboard.md` |
| Explaining how something works — a concept or process | **Explainer** | `formats/explainer.md` |
| A head-to-head on shared criteria — "X vs Y vs Z", "which should I pick" | **Comparison** | `formats/comparison.md` |
| Something to present / click through — "slides", "deck", a pitch | **Deck** | `formats/deck.md` |

When unsure whether the task is even "tabula-shaped" (vs. a quick inline answer),
it's fine to answer briefly in chat and offer to build the page. Skip `tabula`
for single facts, code, or a summary the user wants to read in the conversation.

## Workflow

### 1. Pick the format and read its recipe

From the table above. Then read three things before building: that format's recipe
(`references/formats/<name>.md`), the shared **`references/design-system.md`** (the
look every format inherits), and **`references/components.md`** (the cross-format
block library — images, galleries, charts, diagrams, tables, quotes, citations).

### 2. Gather the material

If the topic needs current facts (prices, models, rankings, what exists now),
**research the web first** — several focused searches (one per option/candidate
plus overviews), fetching pages for detail rather than trusting snippets, and
ground every concrete claim in something retrieved. If the user supplied the
content, use that and only search to fill gaps. Collect, per item: a one-line
takeaway, a few concrete facts, and — where the format leans on them — at least
one image URL or the data for a chart. Note sources so you can cite.

### 3. Build the file

Author in a scratch directory with the assets beside you, then bundle into ONE
self-contained HTML for delivery. The single-file step is essential: inline
previewers and a file opened from someone's Downloads only load the one HTML, so a
page that `<link>`s an external stylesheet or `<script src>`s external JS renders
unstyled and dead. The authored form links them; the delivered form inlines them.

```bash
mkdir -p /home/claude/work/<name>
cp /path/to/skill/assets/style.css /path/to/skill/assets/app.js /home/claude/work/<name>/
# author index.html here, linking ./style.css and ./app.js
```

For report/dashboard/explainer/comparison, start from `assets/template.html` and
build the body from the format recipe + `components.md`. For a **deck**, use the
shell in `formats/deck.md` instead (it's a different full-viewport structure).
Either way, keep the `<link rel="stylesheet" href="style.css">` and
`<script src="app.js" defer>` tags exactly so the bundler can find them.

In `<script id="report-data">`: set `date` to today (ISO 8601); `fontIndex` 2
(SF Pro default; 1 Arial, 0 Georgia serif); a subtle `colorIndex` (0–7) that suits
the subject; `chartStyleIndex` 0 (textured) is the house default. No external
fonts are needed. Only load the Chart.js CDN line if the page has a chart.

### 4. Make it visual — images, charts, diagrams, lightbox

This is the heart of every format. Match the treatment to the content and **fill
the whitespace** rather than tucking visuals into a narrow column. Aim for a
visual within roughly every screenful — if you scroll a page of the draft and see
only text, add one.

**Turn information into visuals — a quick playbook (each option below needs no
image sourcing):**
- Ratings, scores, "how good is it at X" → **score meters** (`.meter` bars) or a
  bar/radar chart. Put meters right in an item or comparison column.
- Quantities, comparisons, rankings, parts-of-a-whole → a **chart**.
- A process, flow, hierarchy, or how parts relate → an **inline-SVG diagram**.
- A few headline numbers → a **metrics strip** or **stat figures** (`.stat-row`).
- Several options → **comparison columns** or a **gallery**, not a prose list.
- Steps → a numbered **steps** block, not a paragraph.

So a "no photos available" topic is never an excuse for a text wall: a comparison
gets a scores chart plus per-option meters; an explainer gets a diagram per
concept; a deck gets a chart or big stat on each content slide.

- **Images belong to the thing they show** — an option's image goes in *that
  option's* item/section, never collected into one gallery at the top. One image →
  inline it (`report-item--image-right`). Several images for one option → a gallery
  inside that option. Many at once → an image grid. A single wide hero between
  sections → a full-width image break. All are click-to-expand (the lightbox is
  automatic; give every image a real `alt`).
- **Charts and diagrams carry the non-photo points.** A chart for quantitative
  shape (ranking, trend, parts of a whole, an accurate numeric contrast); a diagram
  (inline SVG) for structure/flow/relationships. Reach for these especially when a
  topic's photos are scarce or copyrighted — far better than a decorative stock
  image or a dense paragraph. Pass plain data to Chart.js; the engine skins it.
- **Sourcing images is the hard part.** Search-result and listing photos often
  aren't reliably hotlinkable (JS-loaded), and product/branded media are
  copyrighted — don't embed those. Prefer stable sources (Wikimedia/Wikipedia file
  URLs, official sites); when real photos aren't embeddable, use what is (a floor
  plan, map, official diagram) and link out; a broken `<img>` is worse than a clean
  link, so only embed URLs you trust.
- **Flag what you can't verify.** For booking/shopping/metrics, live prices and
  availability usually can't be confirmed from research — say so and link to the
  source rather than implying false precision.

See `components.md` for the markup of every shared block, and the format recipe for
format-specific blocks (dash tiles, compare columns, callouts/steps, deck slides).

### 5. Bundle, verify, and deliver

Fold the CSS and JS into the HTML and write the single file to outputs:

```bash
cd /home/claude/work/<name>
python /path/to/skill/scripts/inline_assets.py index.html --out /mnt/user-data/outputs/<name>.html
grep -c '{{' /mnt/user-data/outputs/<name>.html              # expect 0 — no unfilled placeholders
grep -c 'href="style.css"' /mnt/user-data/outputs/<name>.html # expect 0 — CSS inlined
```

The delivered file should have a `<style>` and `<script>` block and no external
asset refs. Confirm every `<img>` has src + alt and any chart canvas has a matching
init script. Then present the single `.html`: it's self-contained (opens anywhere),
images expand on click, the gear button switches paper color / font / chart style,
and it prints cleanly to PDF (decks print one slide per page).

## Content quality bar

- **Lead with the verdict / takeaway.** A skimmer should get the point without
  reading the paragraph.
- **Be concrete.** Specifics (numbers, named features, real trade-offs) over
  adjectives; an honest weakness earns trust.
- **Cite as you go.** Attribute prices, rankings, and quotes; keep any verbatim
  quote short and paraphrase the rest.
- **Earn every block.** Drop a metrics strip, chart, gallery, or quote if the
  topic doesn't support it well. A tight page beats a padded one.

## Files in this skill

- `references/design-system.md` — the shared look (tokens, grid, theme system)
  every format inherits. Read first.
- `references/formats/` — one recipe per format: `report.md`, `dashboard.md`,
  `explainer.md`, `comparison.md`, `deck.md`. Read the one you picked.
- `references/components.md` — the cross-format block library.
- `assets/template.html` — base skeleton for the editorial formats (the deck has
  its own shell in `formats/deck.md`).
- `assets/style.css` — the full stylesheet (design system + all formats). Copy
  verbatim; don't edit.
- `assets/app.js` — engine: theming, chart skinning, settings panel, lightbox,
  gallery, and deck navigation. Copy verbatim; don't edit.
- `scripts/inline_assets.py` — folds CSS/JS into the single delivered file. Run last.
