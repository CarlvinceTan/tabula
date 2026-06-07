# Format: Comparison / decision matrix

**Use when** it's a head-to-head — "X vs Y vs Z", "which should I pick", a
decision between a small set of named options on shared criteria. Differs from a
report roundup in that the *options are the same kind of thing judged on the same
axes*, and the reader wants the trade-offs and a clear pick.

**Personality:** side-by-side columns; symmetry makes differences pop; the
recommended pick is unmistakable.

## Spine

1. **Header + headline** — the choice being made.
2. **Intro** — bolded: state the recommendation up front (the reader can stop
   here), then the one-line reason.
3. **Option columns** (`.compare-grid`) — one column per option with a verdict and
   pros/cons; highlight the pick.
4. **Decision matrix** — a `data-table` scoring options across criteria, with the
   best cell per row marked.
5. **How to choose** — short guidance by use-case/budget for readers whose needs
   differ from the default pick.
6. **Sources.**

## Markup

**Option columns:**

```html
<div class="compare-grid">

  <div class="compare-col compare-col--pick">
    <div class="compare-col__name">Option A <span class="item-badge">Pick</span></div>
    <p class="compare-col__verdict">One line on who it's for.</p>
    <ul class="pros"><li>Strength</li><li>Strength</li></ul>
    <ul class="cons"><li>Weakness</li></ul>
  </div>

  <div class="compare-col">
    <div class="compare-col__name">Option B</div>
    <p class="compare-col__verdict">One line on who it's for.</p>
    <ul class="pros"><li>Strength</li></ul>
    <ul class="cons"><li>Weakness</li><li>Weakness</li></ul>
  </div>

</div>
```

(`compare-col--pick` outlines the recommended option; the grid auto-fits 2–4
columns.)

**Decision matrix** — mark the winning cell in each row with `class="win"`:

```html
<table class="data-table">
  <thead><tr><th>Criterion</th><th>Option A</th><th>Option B</th></tr></thead>
  <tbody>
    <tr><td>Price</td><td>$$</td><td class="win">$</td></tr>
    <tr><td>Quality</td><td class="win">Best</td><td>Good</td></tr>
  </tbody>
</table>
```

## Build notes

Judge every option on the *same* criteria — that's what makes a comparison fair
and skimmable. State the pick early and make the column/cell highlighting do the
rest. If "it depends", say what it depends on in the "how to choose" section
rather than hedging the verdict.
