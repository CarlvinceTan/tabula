# Format: Dashboard

**Use when** the point is a *snapshot of numbers/status* — KPIs, an overview of
metrics, "how are things tracking", a state-of-X summary. The reader wants the
figures and their shape at a glance, not a narrative.

**Personality:** scannable grid of tiles; numbers dominate; charts show trend and
proportion. Still quiet and print-clean, not neon.

## Spine

1. **Header + headline** — what this dashboard covers and as-of date.
2. **Tile grid** (`.dash-grid`) — the headline numbers as big-number tiles, plus
   chart panels for trends and breakdowns. Lead with the few numbers that matter.
3. **Supporting table** — a `data-table` for the detail behind the tiles.
4. **Notes / sources** — definitions, caveats, and where the data came from.

## Markup

A tile grid is its own 12-column band. Big-number tile and a chart panel:

```html
<div class="dash-grid">

  <div class="dash-tile">
    <div class="dash-tile__label">Revenue</div>
    <div class="dash-tile__value">$1.24M</div>
    <div class="dash-tile__delta dash-tile__delta--up">▲ 8.2% vs last month</div>
  </div>

  <!-- repeat tiles; default span is 3 columns (4 per row) -->

  <div class="dash-tile dash-tile--wide">
    <div class="dash-tile__title">Trend</div>
    <div class="chart-wrap" style="height: 200px"><canvas id="trend"></canvas></div>
  </div>

</div>
```

Tiles default to `span 3` (four across); use `--half`/`--wide` (span 6) or
`--full` for charts and wide panels. Deltas: `--up` (green) / `--down` (red).

Charts use Chart.js exactly as in `components.md#chart` — initialize them in a
`<script>` at the end of `<body>`; the engine skins them. Use `bar` for
category comparison, `line` for trend, `doughnut` for share-of-total.

## Build notes

Keep tiles to the handful of numbers that actually matter — a wall of 16 tiles is
not a dashboard, it's noise. Pair each number with a one-glance read (a delta or a
tiny chart). Flag any figure you couldn't verify.
