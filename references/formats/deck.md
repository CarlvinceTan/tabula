# Format: Slide deck / presentation

**Use when** the output is meant to be *presented* — "make a deck/slides", a
pitch, a walkthrough to click through. One idea per screen, big type, minimal
text.

**Personality:** bold and sparse. Each slide is a single point. Navigate with
arrow keys, on-screen buttons, or swipe; a progress bar tracks position.

## A deck is a different shell

Unlike the editorial formats, the deck uses its own full-viewport structure, so
it doesn't start from `template.html`. Use this skeleton instead (still links the
shared `style.css` / `app.js`, still self-contained after bundling, still themable
via the gear button). `app.js` auto-detects the `.deck` and wires navigation.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{DECK_TITLE}}</title>
  <link rel="stylesheet" href="style.css">
  <script id="report-data" type="application/json">{"fontIndex":2,"colorIndex":0,"chartStyleIndex":0,"date":"{{ISO_DATE}}"}</script>
  <!-- include Chart.js CDN line only if a slide has a chart -->
  <script src="app.js" defer></script>
</head>
<body class="deck-mode">

  <div class="deck__progress"></div>

  <div class="deck">
    <div class="deck__track">

      <section class="deck__slide">
        <span class="kicker">{{KICKER}}</span>
        <h2>{{TITLE_SLIDE_HEADLINE}}</h2>
        <p>{{ONE_LINE_SUBTITLE}}</p>
      </section>

      <section class="deck__slide">
        <h3>{{POINT_HEADING}}</h3>
        <ul>
          <li>{{ONE_TIGHT_POINT}}</li>
          <li>{{ANOTHER_POINT}}</li>
        </ul>
      </section>

      <!-- A slide can hold a chart, diagram, or image (all lightbox-enabled):
      <section class="deck__slide">
        <h3>{{HEADING}}</h3>
        <div class="chart-wrap" style="height: 50vh"><canvas id="s3"></canvas></div>
      </section>
      -->

    </div>
  </div>

  <div class="deck__nav">
    <button class="deck__btn deck__btn--prev" aria-label="Previous">&#8249;</button>
    <span class="deck__counter"></span>
    <button class="deck__btn deck__btn--next" aria-label="Next">&#8250;</button>
  </div>

  <!-- keep the settings panel so paper color / font / chart style still switch -->
  <div class="settings-wrap">
    <div class="settings-panel" id="settingsPanel">
      <div class="settings-header">Customize</div>
      <div class="settings-swatches" id="settingsSwatches"></div>
      <div class="settings-fonts" id="settingsFonts"></div>
    </div>
    <button class="settings-btn" id="settingsBtn" title="Customize">⚙</button>
  </div>

</body>
</html>
```

(The settings button glyph can stay as the gear SVG from `template.html`; a
character is fine too.)

## Build notes

One idea per slide — if a slide needs a paragraph, it's two slides. Open with a
title slide, end with a takeaway/next-steps slide. Lean on big headings and a
single visual (chart, diagram, or image) per content slide rather than dense
bullets. Charts/diagrams use the same markup as `components.md`; initialize any
chart in a `<script>` before `</body>`.
