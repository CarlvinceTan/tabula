# Format: Report (research roundup)

**Use when** the answer is several distinct things the reader will compare or
choose between — "best X near Y", "things to do in Z", buying guides, roundups,
destination/restaurant guides. The flagship format; most research questions land
here.

**Personality:** quiet editorial magazine. Photos and galleries carry it, prose
frames them, verdicts are obvious at a skim.

## Spine

1. **Header** — a 1–2 word kicker (`.report-from`) + the date (auto-filled).
2. **Headline** — short, declarative.
3. **Intro** — one bolded lead sentence stating the bottom line, then 2–3
   sentences of orientation.
4. **Metrics strip** (optional) — 2–4 headline numbers, only if the topic has
   them.
5. **Sections** — group items logically ("The big three", "Budget options"),
   3–6 items total. Each item: a short label + verdict badge on the left, the
   substance on the right, led by a bolded one-line takeaway.
6. **Visuals per item** — the image/gallery for an option lives *in that option's
   item* (see `components.md`). A full-width image break or pull quote between
   sections for rhythm.
7. **At a glance** — a comparison `data-table` near the end.
8. **Sources / before you book** — citations and any "can't verify live" notes.

## Components

Pull from `components.md`: section + item, image (in a section), gallery (when one
option has several photos), full-width image break, chart, diagram, data table,
pull quote, source quote, citations.

## Layout: editorial vs. card-grid

The standard editorial layout (label left / body right, two-column) suits
narrative-heavy roundups where prose and images are the focus — restaurant
reviews, travel destination overviews, gear comparisons with long explanations.

For roundups of **bookable or purchasable items** (accommodation, products,
event tickets, restaurants where the page is a chooser not a review), reach for
the **card-grid layout** from `components.md` instead. Cards are better when:
- Each option has a photo worth showing prominently
- The reader is choosing, not reading — they'll scan specs and price, not prose
- You have 4+ comparable items with a consistent set of attributes
- There's a filter worth surfacing (by price, feature, availability)

In that case, replace the section-items spine with:
1. `filter-bar` — sticky chip row above the grid
2. `card-grid` — all items as cards with hero image, tags, spec grid, action row
3. `tally-box` — side-by-side totals or key numbers at a glance
4. `reco-strip` — short pick cards (best value / best luxury / pet-friendly etc.)

You can still use the editorial spine for intro, metrics strip, and prose
sections before or after the card grid.

## Build notes

Start from `assets/template.html` (it already has this spine). Lead every item
with a bolded verdict; prefer concrete specifics over adjectives; include an
honest weakness or "best for / not for". This is the format the base template and
most of `components.md` are tuned for.
