# Report components

Copy-and-fill HTML for each block type. All blocks live inside `.section-items`
(within a `.report-section`) unless noted as a full-width "break". The grid is
12 columns: in a `.report-item`, the label occupies columns 1-4 and the body 5-12.

## Table of contents
- [Section + item](#section--item)
- [Image (in a section)](#image-in-a-section)
- [Gallery / carousel](#gallery--carousel)
- [Image grid](#image-grid)
- [Full-width image break](#full-width-image-break)
- [Chart](#chart)
- [Diagram (inline SVG)](#diagram-inline-svg)
- [Score meters & stat figures](#score-meters--stat-figures)
- [Data table](#data-table)
- [Pull quote](#pull-quote)
- [Source quote (avatar card)](#source-quote-avatar-card)
- [Citations + footnotes](#citations--footnotes)

---

## Section + item

A section groups related items under a heading. Each item is a label (left) +
body (right). The badge is optional — use it for a one- or two-word verdict
("Best value", "Most popular"). Lead each body with a bolded one-line takeaway,
because skim-readers should get the gist from the first clause.

```html
<section class="report-section">
  <div class="section-header"><h2 class="section-heading">I. Section title</h2></div>
  <div class="section-items">

    <article class="report-item">
      <div class="item-label">
        <h3 class="item-title">1. Item name</h3>
        <span class="item-badge">Verdict</span>
      </div>
      <div class="item-body">
        <p><strong>One-line takeaway.</strong> Two or three sentences of detail
        that earn their place — specifics, not filler.</p>
        <ul class="item-bullets">
          <li>Concrete fact or spec</li>
          <li>Another concrete fact</li>
        </ul>
      </div>
    </article>

  </div>
</section>
```

---

## Image (in a section)

Use this when an image belongs to a specific item. The image sits in the body
(right column); the caption goes in the **label** (left column) so it reads like
a figure caption. Add `--image-right` to the article.

Images open in a lightbox on click automatically — `app.js` wires every
`.image-wrap img`. Always set a meaningful `alt`. If you have a larger source
than the inline image, add `data-full="<big-url>"`; otherwise the displayed src
is reused. To opt an image out (e.g. a tiny logo), add `data-lightbox="off"`.

```html
<article class="report-item report-item--image-right">
  <div class="item-label">
    <h3 class="item-title">Item name</h3>
    <p class="fig-caption">Caption shown beside the image and in the lightbox.</p>
  </div>
  <div class="item-body">
    <div class="image-wrap">
      <img src="https://example.com/photo.jpg" alt="Descriptive alt text">
    </div>
  </div>
</article>
```

---

## Gallery / carousel

Reach for this when **one option has several images to page through** — put it
inside *that option's* `.item-body` so the carousel stays with the option it
belongs to. (For images that introduce a whole section, it can also be a direct
child of `.report-section`.) Don't aggregate every option's images into one
carousel at the top of the report — images belong with the thing they show.
It fills the whitespace a narrow right-column image leaves empty, and it's the
right answer to "let me flip through them." Prev/next, dots, a counter, keyboard
arrows, and touch swipe are all wired by `app.js`; each slide image also opens in
the lightbox.

```html
<div class="gallery">
  <div class="gallery__viewport">
    <button class="gallery__btn gallery__btn--prev" aria-label="Previous">&#8249;</button>
    <div class="gallery__track">

      <div class="gallery__slide">
        <img src="https://example.com/option-1.jpg" alt="Descriptive alt">
        <p class="gallery__caption"><strong>Option one</strong> — the one-line read for this option.</p>
      </div>

      <div class="gallery__slide">
        <img src="https://example.com/option-2.jpg" alt="Descriptive alt">
        <p class="gallery__caption"><strong>Option two</strong> — its one-line read.</p>
      </div>

    </div>
    <button class="gallery__btn gallery__btn--next" aria-label="Next">&#8250;</button>
  </div>
  <div class="gallery__footer">
    <span class="gallery__counter"></span>
    <div class="gallery__dots"></div>
  </div>
</div>
```

Dots and the counter populate themselves — leave `.gallery__dots` and
`.gallery__counter` empty. For print, the carousel flattens so every slide shows.

---

## Image grid

When you want to show **many images at once** rather than page through them — a
wall of thumbnails — use the grid. It's responsive (tiles reflow to fill the
width) and every tile opens in the lightbox. Good for filling whitespace with a
dense set of shots where sequence doesn't matter. Direct child of `.report-body`.

```html
<div class="image-grid">
  <figure>
    <img src="https://example.com/a.jpg" alt="Descriptive alt">
    <figcaption>Short caption</figcaption>
  </figure>
  <figure>
    <img src="https://example.com/b.jpg" alt="Descriptive alt">
    <figcaption>Short caption</figcaption>
  </figure>
  <!-- ...more figures... -->
</div>
```

---

## Full-width image break

A palate-cleanser between sections — a wide image with a centered caption,
flanked by hairline rules. Place it as a direct child of `.report-body`,
between two `.report-section` elements. Also lightbox-enabled.

```html
<div class="report-image-break">
  <hr class="report-image-break__rule">
  <div class="report-image-break__body">
    <img class="report-image-break__img" src="https://example.com/wide.jpg" alt="Descriptive alt text">
    <p class="fig-caption">A short, centered caption.</p>
  </div>
  <hr class="report-image-break__rule">
</div>
```

---

## Chart

Charts use Chart.js (uncomment the CDN `<script>` in the template `<head>`).
`app.js` re-skins every chart to the selected style (textured / filled / inked),
keeps pie & doughnut circular, and handles resizing — so pass plain data and
let the engine handle aesthetics. Don't hand-set exotic colors; the style
toggle overrides them anyway. Like images, charts sit in the body with the
caption in the label.

```html
<article class="report-item report-item--chart-right">
  <div class="item-label">
    <h3 class="item-title">What the chart shows</h3>
    <p class="fig-caption">Fig 1. Source and brief read of the data.</p>
  </div>
  <div class="item-body">
    <div class="chart-wrap" style="height: 260px">
      <canvas id="chart1"></canvas>
    </div>
  </div>
</article>
```

Initialize charts in a `<script>` near the end of `<body>` (after the canvas
exists). Keep it minimal — the engine styles it:

```html
<script>
  new Chart(document.getElementById('chart1'), {
    type: 'bar',
    data: {
      labels: ['Mt Buller', 'Falls Creek', 'Hotham'],
      datasets: [{ data: [3, 4.5, 5] }]
    },
    options: { plugins: { legend: { display: false } } }
  });
</script>
```

Pick the type by intent: `bar` for comparisons across categories, `line` for
trends over time, `doughnut`/`pie` for parts of a whole (2-5 slices). If the
data is mostly lookups rather than a shape, prefer a [data table](#data-table).

---

## Diagram (inline SVG)

When a point is about *structure, process, or relationship* — a workflow, a
timeline, how parts fit together, a labeled comparison — a diagram beats a
paragraph. Hand-write a simple inline `<svg>` and theme it to the report: use
`currentColor` or `var(--ink)` / `var(--ink-secondary)` for strokes and fills and
`var(--font-body)` for labels, so it inherits the paper color and the inked
filter. Keep diagrams clean and minimal (a few shapes and labels), not ornate.

Place a diagram like an image: inline in an item (`report-item--image-right`,
caption in the label) for a section-specific diagram, or in a full-width image
break when it explains the whole piece.

```html
<article class="report-item report-item--image-right">
  <div class="item-label">
    <h3 class="item-title">How it flows</h3>
    <p class="fig-caption">The three stages, left to right.</p>
  </div>
  <div class="item-body">
    <figure style="margin:0">
      <svg viewBox="0 0 480 90" role="img" aria-label="Stage A to Stage B to Stage C"
           style="width:100%;height:auto;color:var(--ink)">
        <g fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="6" y="25" width="120" height="40" rx="6"/>
          <rect x="180" y="25" width="120" height="40" rx="6"/>
          <rect x="354" y="25" width="120" height="40" rx="6"/>
          <path d="M126 45 H180 M300 45 H354" marker-end="url(#arrow)"/>
        </g>
        <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="currentColor"/></marker></defs>
        <g fill="var(--ink)" font-family="var(--font-body)" font-size="13" text-anchor="middle">
          <text x="66" y="50">Stage A</text>
          <text x="240" y="50">Stage B</text>
          <text x="414" y="50">Stage C</text>
        </g>
      </svg>
    </figure>
  </div>
</article>
```

Inline SVG diagrams aren't part of the lightbox (they're vector and scale on
their own). For a raster diagram image, use the image patterns above instead.

---

## Score meters & stat figures

The cheapest way to make a section visual when there's no photo — both are
pure markup, no sourcing, not copyrighted. Use them liberally.

**Score meters** — labeled bars for ratings/scores. Great inside a comparison
column, a review item, or a section's left label. Set the fill `width` to the
score as a percentage.

```html
<div class="meter"><span class="meter__label">Autofocus</span>
  <span class="meter__track"><span class="meter__fill" style="width:95%"></span></span>
  <span class="meter__val">9.5</span></div>
<div class="meter"><span class="meter__label">Value</span>
  <span class="meter__track"><span class="meter__fill" style="width:60%"></span></span>
  <span class="meter__val">6.0</span></div>
```

**Stat figures** — a row of big headline numbers. Reads instantly; good near the
top of a section or on a deck slide (where they render extra large automatically).

```html
<div class="stat-row">
  <div class="stat"><span class="stat__value">8</span><span class="stat__label">options found</span></div>
  <div class="stat"><span class="stat__value">~$120</span><span class="stat__label">per person</span></div>
  <div class="stat"><span class="stat__value">2 nights</span><span class="stat__label">Fri–Sun</span></div>
</div>
```

---

## Data table

Best for dense at-a-glance comparison across several attributes. First column is
left-aligned text; the rest right-align as numbers.

```html
<article class="report-item">
  <div class="item-label">
    <h3 class="item-title">At a glance</h3>
  </div>
  <div class="item-body">
    <table class="data-table">
      <thead>
        <tr><th>Option</th><th>Cost</th><th>Strength</th><th>Weakness</th></tr>
      </thead>
      <tbody>
        <tr><td>Option A</td><td>$X</td><td>...</td><td>...</td></tr>
      </tbody>
    </table>
  </div>
</article>
```

---

## Pull quote

A large centered quote between sections. Direct child of `.report-body`.

```html
<div class="report-quote-break">
  <blockquote class="report-blockquote-break">
    <p>A striking sentence worth enlarging.</p>
    <cite>Attribution, source</cite>
  </blockquote>
</div>
```

---

## Source quote (avatar card)

A compact card with an avatar, a name/handle header, and a message — good for a
pulled testimonial, review, or post. Wrap in `<a class="slack-quote" href="...">`
to link out, or use a `<div>` if there's no link.

```html
<a class="slack-quote" href="https://source.example.com" target="_blank" rel="noopener">
  <span class="slack-quote-avatar"><img src="avatar.jpg" alt=""></span>
  <span class="slack-quote-body">
    <span class="slack-quote-header">
      <span class="slack-quote-name">Reviewer name</span>
      <span class="slack-quote-channel">@source</span>
      <span class="slack-quote-time">Mar 2026</span>
    </span>
    <span class="slack-quote-text">The quoted text, kept short.</span>
  </span>
</a>
```

---

## Citations + footnotes

To attribute a claim inline, drop a superscript ref with a hover tooltip:

```html
... claim text<a class="cite-ref" href="#fn1">1<span class="cite-tooltip">Source name — short note</span></a>.
```

The footnotes block lives at the end of `.report-body` (it's hidden on screen by
default and shown in print; you can also unhide it via CSS if you want it
visible). Pattern:

```html
<div class="report-footnotes" id="footnotes">
  <div class="footnotes-heading">Sources</div>
  <ol>
    <li id="fn1">Source title — publisher, date. <a class="footnote-backref" href="#">&#8617;</a></li>
  </ol>
</div>
```

Keep quotations short (a clause, not a paragraph) and prefer paraphrase with a
citation over long verbatim copying.

---

## Card grid (finder layout)

Use when each item in a research roundup is **bookable, purchasable, or
choosable** — accommodation, restaurants, products, events. A card shows the
thing visually (hero image + optional thumbnail strip), tells you the key specs
at a glance (spec grid), and gives a direct price + action row. Pair with the
**filter bar** above and the **tally box** + **recommendation strip** below for
a complete finder page.

Place these as direct children of `.report-body` (not inside `.report-item`).
Add `data-tags="..."` to each `.card` with space-separated tokens that match the
`data-filter` values on the filter buttons.

### Filter bar

```html
<div class="filter-bar">
  <span class="filter-bar__label">Filter:</span>
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="budget">In budget</button>
  <button class="filter-btn" data-filter="pet">Pet-friendly</button>
  <button class="filter-btn" data-filter="large">Large group</button>
</div>
```

### Card

Hero image, overlay tags, optional thumbnail strip, spec grid, and action row.
Thumbnails swap the hero image on click (wired by `app.js`); the hero opens in
the lightbox.

```html
<div class="card-grid" id="card-grid">

  <div class="card" data-tags="budget 2bath">
    <div class="card__img-wrap">
      <img src="https://example.com/hero.jpg" alt="Descriptive alt">
      <!-- Overlay tags (optional) -->
      <div class="card__tags">
        <span class="card__tag card__tag--pick">⭐ Top pick</span>
        <span class="card__tag card__tag--good">In budget</span>
      </div>
      <!-- Thumbnail strip (optional — click to swap hero) -->
      <div class="card__thumbs">
        <img class="card__thumb" src="https://example.com/t1.jpg" alt="Living room">
        <img class="card__thumb" src="https://example.com/t2.jpg" alt="Bedroom">
        <img class="card__thumb" src="https://example.com/t3.jpg" alt="Kitchen">
      </div>
    </div>
    <div class="card__body">
      <div class="card__name">Property Name</div>
      <div class="card__desc">One or two sentences on what makes it notable — concrete details, not adjectives.</div>
      <div class="card__specs">
        <div class="card__spec"><span class="card__spec-icon">👥</span> 7 guests max</div>
        <div class="card__spec"><span class="card__spec-icon">🛏</span> 3 bedrooms</div>
        <div class="card__spec"><span class="card__spec-icon">🚿</span> 2 bathrooms</div>
        <div class="card__spec"><span class="card__spec-icon">🔥</span> Wood fire</div>
        <div class="card__spec"><span class="card__spec-icon">📶</span> Free WiFi</div>
        <div class="card__spec"><span class="card__spec-icon">🚗</span> 3 car parks</div>
      </div>
      <div class="card__action">
        <div class="card__price">
          <span class="card__price-label">Per night</span>
          <span class="card__price-value card__price-value--good">$915</span>
          <span class="card__price-note">Min. 2 nights · ~$1,830 total</span>
        </div>
        <a href="https://source.example.com/property/" target="_blank" class="card__btn">Book →</a>
      </div>
    </div>
  </div>

  <!-- Unavailable / fully booked card -->
  <div class="card" data-tags="2bath">
    <div class="card__img-wrap" style="filter: grayscale(0.35);">
      <img src="https://example.com/hero2.jpg" alt="Property name">
      <div class="card__tags">
        <span class="card__tag card__tag--full">🚫 Fully booked</span>
      </div>
    </div>
    <div class="card__body">
      <div class="card__name">Second Property</div>
      <div class="card__desc">Description here.</div>
      <div class="card__specs"><!-- specs --></div>
      <div class="card__action">
        <div class="card__price">
          <span class="card__price-label">Status</span>
          <span class="card__price-value card__price-value--muted">Unavailable</span>
          <span class="card__price-note">Check for cancellations</span>
        </div>
        <a href="https://source.example.com/property2/" target="_blank"
           class="card__btn card__btn--disabled">Unavailable</a>
      </div>
    </div>
  </div>

</div>
```

**Tag variants** — apply to `.card__tag`:
- `card__tag--pick` — dark background, for top picks
- `card__tag--ok` — subtle border, neutral
- `card__tag--good` — green tint, positive signal (in budget, available)
- `card__tag--warn` — amber tint, caution (slightly over, limited)
- `card__tag--full` — dark, for unavailable / fully booked

**Price value tone** — apply to `.card__price-value`:
- `card__price-value--good` — green (within budget)
- `card__price-value--warn` — amber (borderline)
- `card__price-value--bad` — red (over budget)
- `card__price-value--muted` — muted grey (N/A, unavailable)

---

### Tally box

Shows all-option totals side by side after the card grid.

```html
<div class="tally-box">
  <div class="tally-box__title">2-Night Stay Cost Comparison</div>
  <div class="tally-box__desc">Your budget is ~$2,000 for 2 nights.</div>
  <div class="tally-grid">

    <div class="tally-item">
      <div class="tally-item__name">Alpine Vision</div>
      <div class="tally-item__detail">2 nights × $735</div>
      <div class="tally-item__value tally-item__value--good">$1,470</div>
    </div>

    <div class="tally-item">
      <div class="tally-item__name">Keystone Chalet</div>
      <div class="tally-item__detail">2 nights × $1,613</div>
      <div class="tally-item__value tally-item__value--bad">$3,226</div>
    </div>

    <div class="tally-item">
      <div class="tally-item__name">Tintinara</div>
      <div class="tally-item__detail">Fully booked</div>
      <div class="tally-item__value tally-item__value--muted">N/A</div>
    </div>

  </div>
</div>
```

---

### Recommendation strip

Short pick cards after the tally — one per recommendation category.

```html
<div class="reco-strip">

  <div class="reco-card">
    <div class="reco-card__label">🥇 Best Overall</div>
    <div class="reco-card__name">Property Name</div>
    <div class="reco-card__desc">7 guests, 2 bathrooms, $915/night — well within budget and walkable to everything.</div>
  </div>

  <div class="reco-card">
    <div class="reco-card__label">✨ Best New Build</div>
    <div class="reco-card__name">Another Property</div>
    <div class="reco-card__desc">Cheapest at $735/night. Brand new, contemporary, fire pit.</div>
  </div>

  <div class="reco-card">
    <div class="reco-card__label">🐶 Pet Friendly</div>
    <div class="reco-card__name">Third Property</div>
    <div class="reco-card__desc">Only group-size option that takes dogs. $1,100/night, 8 guests.</div>
  </div>

</div>
```
