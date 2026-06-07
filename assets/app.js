/**
 * Visual Research Report — app.js
 *
 * Reads server-baked values from <script id="report-data"> for date and
 * initial color/font/chart-style. localStorage overrides user settings.
 * Handles theming (paper color, headline font, chart style), the settings
 * panel, Chart.js defaults + textured/inked chart rendering, and an image
 * lightbox (click any report image to expand it).
 */

/* === Constants === */

var PAPERS = [
  "#FAF9F5", // ivory
  "#FFF8DA", // canary
  "#F9E8EC", // rose
  "#E2ECF5", // powder blue
  "#E3EDDF", // sage
  "#EDE4F2", // orchid
  "#FEEADD", // salmon
  "#E6E8EB", // fog
];

// Three headline options that all work with system fonts (no external files).
var HEADLINE_FONTS = [
  {
    family: "Georgia, 'Times New Roman', serif",
    weight: "600",
    style: "normal",
    letterSpacing: "-0.02em",
    lineHeight: "1.05",
    label: "Serif",
    sectionWeight: "600",
    sectionStyle: "normal",
    metricWeight: "600",
    metricSize: "1.8rem",
    quoteWeight: "400",
  },
  {
    family: "Arial, Helvetica, sans-serif",
    weight: "700",
    style: "normal",
    letterSpacing: "-0.02em",
    lineHeight: "1.0",
    label: "Arial",
    sectionWeight: "700",
    sectionStyle: "normal",
    metricWeight: "700",
    metricSize: "1.6rem",
    quoteWeight: "400",
  },
  {
    family:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
    weight: "800",
    style: "normal",
    letterSpacing: "-0.03em",
    lineHeight: "0.95",
    label: "SF Pro",
    sectionWeight: "800",
    sectionStyle: "normal",
    metricWeight: "800",
    metricSize: "1.8rem",
    quoteWeight: "400",
  },
];

/* === Server-baked data === */

var _reportData = {};
try {
  var _el = document.getElementById("report-data");
  if (_el) _reportData = JSON.parse(_el.textContent || "{}");
} catch (e) {
  /* silent */
}

var bakedDate = _reportData.date ? new Date(_reportData.date) : new Date();
var bakedColorIndex =
  typeof _reportData.colorIndex === "number"
    ? _reportData.colorIndex % PAPERS.length
    : 0;
var bakedFontIndex =
  typeof _reportData.fontIndex === "number"
    ? _reportData.fontIndex % HEADLINE_FONTS.length
    : 2;
var CHART_STYLES = ["pattern", "color", "inked"];
var bakedChartStyleIndex =
  typeof _reportData.chartStyleIndex === "number"
    ? _reportData.chartStyleIndex % CHART_STYLES.length
    : 0;
var bakedChartStyle = CHART_STYLES[bakedChartStyleIndex];

/* === State === */

var currentColorIndex = bakedColorIndex;
var currentFontIndex = bakedFontIndex;
var STORAGE_KEY = "report-settings";

/* === Persistence === */

function loadSettings() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveSettings() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        color: currentColorIndex,
        font: currentFontIndex,
      }),
    );
  } catch (e) {
    /* silent */
  }
}

/* === Date === */

function updateDate() {
  var DAYS = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  var MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  var dateStr =
    DAYS[bakedDate.getDay()] +
    ", " +
    MONTHS[bakedDate.getMonth()] +
    " " +
    bakedDate.getDate() +
    " " +
    bakedDate.getFullYear();
  var el = document.getElementById("reportDate");
  if (el) el.textContent = dateStr;
}

/* === Badge rotation === */

function randomizeStamps() {
  document.querySelectorAll(".item-badge").forEach(function (badge) {
    if (badge.style.transform) return;
    var angle = (Math.random() * 6 - 3).toFixed(2);
    badge.style.transform = "rotate(" + angle + "deg)";
  });
}

/* === Color + Font application === */

function applyColor(index) {
  currentColorIndex = index;
  document.documentElement.style.setProperty("--bg", PAPERS[index]);
  void document.body.offsetHeight; // force repaint so all var(--bg) consumers update
  document.querySelectorAll(".swatch").forEach(function (s, i) {
    s.classList.toggle("active", i === index);
  });
  saveSettings();
}

function applyFont(index) {
  currentFontIndex = index;
  var font = HEADLINE_FONTS[index];
  document.documentElement.style.setProperty("--font-title", font.family);
  var headline = document.querySelector(".report-headline");
  if (headline) {
    headline.style.fontFamily = font.family;
    headline.style.fontWeight = font.weight;
    headline.style.fontStyle = font.style;
    headline.style.letterSpacing = font.letterSpacing;
    headline.style.lineHeight = font.lineHeight;
  }
  document.querySelectorAll(".section-heading").forEach(function (el) {
    el.style.fontFamily = font.family;
    el.style.fontWeight = font.sectionWeight;
    el.style.fontStyle = font.sectionStyle;
  });
  document.querySelectorAll(".metric-value").forEach(function (el) {
    el.style.fontFamily = font.family;
    el.style.fontWeight = font.metricWeight;
    el.style.fontSize = font.metricSize;
  });
  document.querySelectorAll(".slack-quote-text").forEach(function (el) {
    el.style.fontWeight = font.quoteWeight;
  });
  document.querySelectorAll(".report-blockquote-break").forEach(function (el) {
    el.style.fontFamily = font.family;
    el.style.fontWeight = font.weight;
    el.style.fontStyle = font.style;
    el.style.letterSpacing = font.letterSpacing;
  });
  document.querySelectorAll(".font-option").forEach(function (f, i) {
    f.classList.toggle("active", i === index);
  });
  saveSettings();
}

/* === Settings panel builders === */

function buildSwatches() {
  var container = document.getElementById("settingsSwatches");
  if (!container) return;
  PAPERS.forEach(function (color, i) {
    var swatch = document.createElement("button");
    swatch.className = "swatch" + (i === currentColorIndex ? " active" : "");
    swatch.style.background = color;
    swatch.title = color;
    swatch.addEventListener("click", function () {
      applyColor(i);
    });
    container.appendChild(swatch);
  });
}

function buildFontOptions() {
  var container = document.getElementById("settingsFonts");
  if (!container) return;
  HEADLINE_FONTS.forEach(function (font, i) {
    var btn = document.createElement("button");
    btn.className = "font-option" + (i === currentFontIndex ? " active" : "");
    var sample = document.createElement("span");
    sample.className = "font-option-sample";
    sample.textContent = "Aa";
    sample.style.fontFamily = font.family;
    sample.style.fontWeight = font.weight;
    sample.style.fontStyle = font.style;
    var label = document.createElement("span");
    label.className = "font-option-label";
    label.textContent = font.label;
    btn.appendChild(sample);
    btn.appendChild(label);
    btn.addEventListener("click", function () {
      applyFont(i);
    });
    container.appendChild(btn);
  });
}

function buildChartStyleToggle() {
  if (!document.querySelector(".chart-wrap")) return;
  var fontsContainer = document.getElementById("settingsFonts");
  if (!fontsContainer) return;

  var wrapper = document.createElement("div");
  wrapper.className = "settings-chart-styles";

  function chartStyleBtnClass(style) {
    return "chart-style-btn" + (style === currentChartStyle ? " active" : "");
  }

  var patternBtn = document.createElement("button");
  patternBtn.className = chartStyleBtnClass("pattern");
  patternBtn.dataset.style = "pattern";
  patternBtn.title = "Textured";
  patternBtn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="1"><rect x="1" y="1" width="14" height="14" rx="1"/><line x1="4" y1="15" x2="15" y2="4"/><line x1="1" y1="12" x2="12" y2="1"/><line x1="1" y1="7" x2="7" y2="1"/><line x1="9" y1="15" x2="15" y2="9"/></svg>';

  var colorBtn = document.createElement("button");
  colorBtn.className = chartStyleBtnClass("color");
  colorBtn.dataset.style = "color";
  colorBtn.title = "Filled";
  colorBtn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="1" fill="rgba(0,0,0,0.3)" stroke="rgba(0,0,0,0.4)" stroke-width="1"/></svg>';

  var inkedBtn = document.createElement("button");
  inkedBtn.className = chartStyleBtnClass("inked");
  inkedBtn.dataset.style = "inked";
  inkedBtn.title = "Inked";
  inkedBtn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(0,0,0,1)" stroke-width="1.5" style="filter:url(#ink-heavy)"><rect x="1" y="1" width="14" height="14" rx="1"/><line x1="4" y1="15" x2="15" y2="4"/><line x1="1" y1="12" x2="12" y2="1"/><line x1="1" y1="7" x2="7" y2="1"/><line x1="9" y1="15" x2="15" y2="9"/></svg>';

  patternBtn.addEventListener("click", function () {
    setChartStyle("pattern");
  });
  colorBtn.addEventListener("click", function () {
    setChartStyle("color");
  });
  inkedBtn.addEventListener("click", function () {
    setChartStyle("inked");
  });

  var label = document.createElement("div");
  label.className = "settings-section-label";
  label.textContent = "Style";

  wrapper.appendChild(patternBtn);
  wrapper.appendChild(colorBtn);
  wrapper.appendChild(inkedBtn);

  fontsContainer.parentNode.insertBefore(label, fontsContainer);
  fontsContainer.parentNode.insertBefore(wrapper, fontsContainer);
}

/* === Brand chart color override === */

var brandChartColor = null;

window.setBrandChartColor = function (hex) {
  brandChartColor = hex || null;
};

function chartFg(opacity) {
  if (!brandChartColor) return "rgba(0,0,0," + opacity + ")";
  var n = parseInt(brandChartColor.replace("#", ""), 16);
  var r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}

/* === SVG hatch textures (embedded data URIs) ===
   00 = transparent (outline only), 07 = solid fill, 01-06 = SVG patterns least -> most dense */

var DPR = window.devicePixelRatio || 1;

var HATCH_SVG_DATA = {
  "01": "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23c)'%3E%3Ccircle cx='1.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='1.52' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='4.53' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='7.57' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='10.58' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='13.6' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='16.63' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='19.65' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='1.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='4.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='7.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='10.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='13.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='16.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='19.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3Ccircle cx='22.5' cy='22.68' r='.36' fill='black' fill-opacity='.9'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='c'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  "02": "data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23c)'%3E%3Crect x='0' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='3.39' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='6.81' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='10.2' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='13.6' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='16.99' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='20.4' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='23.8' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='27.19' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3Crect x='30.59' y='0' width='.71' height='34' fill='black' fill-opacity='.9'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='c'%3E%3Crect width='34' height='34' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  "03": "data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23c0)'%3E%3Cg clip-path='url(%23c1)'%3E%3Cpath d='M24.14 6.64L24.5 7 7 24.5l-.36-.36L24.14 6.64z' fill='black'/%3E%3Cpath d='M22.39 4.89l.36.37-17.5 17.5-.37-.37 17.5-17.5z' fill='black'/%3E%3Cpath d='M20.63 3.14l.37.36-17.5 17.5-.37-.36 17.5-17.5z' fill='black'/%3E%3Cpath d='M18.88 1.39l.37.36-17.5 17.5-.37-.36 17.5-17.5z' fill='black'/%3E%3Cpath d='M17.14-.36l.36.36-17.5 17.5-.36-.36L17.14-.36z' fill='black'/%3E%3Cpath d='M15.39-2.1l.37.37-17.5 17.5-.37-.37 17.5-17.5z' fill='black'/%3E%3Cpath d='M13.63-3.86l.37.36-17.5 17.5-.37-.36 17.5-17.5z' fill='black'/%3E%3Cpath d='M11.89-5.61l.36.36-17.5 17.5-.36-.37 17.5-17.5z' fill='black'/%3E%3Cpath d='M10.14-7.35l.36.36-17.5 17.5-.36-.37 17.5-17.5z' fill='black'/%3E%3Cpath d='M8.39-9.1l.37.37-17.5 17.5-.37-.37L8.39-9.1z' fill='black'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='c0'%3E%3Crect width='14' height='14' fill='white' transform='matrix(-1 0 0 1 14 0)'/%3E%3C/clipPath%3E%3CclipPath id='c1'%3E%3Crect width='24.75' height='24.75' fill='white' transform='matrix(-.707 -.707 -.707 .707 24.5 7)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  "04": "data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='m0' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='0' y='0' width='6' height='6'%3E%3Cpath d='M6 0H0v6h6V0z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23m0)'%3E%3Cpath d='M3-3L-3 3l.13.13L3.13-2.87 3-3z' fill='black'/%3E%3Cpath d='M4-2l-6 6 .13.13L4.13-1.86 4-2z' fill='black'/%3E%3Cpath d='M5-1l-6 6 .13.13L5.13-.87 5-1z' fill='black'/%3E%3Cpath d='M6 0L0 6l.13.13L6.13.13 6 0z' fill='black'/%3E%3Cpath d='M7 1L1 7l.13.14L7.13 1.13 7 1z' fill='black'/%3E%3Cpath d='M8 2L2 8l.13.13L8.13 2.13 8 2z' fill='black'/%3E%3C/g%3E%3Cmask id='m1' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='0' y='0' width='6' height='6'%3E%3Cpath d='M6 6V0H0v6h6z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23m1)'%3E%3Cpath d='M3-3l.13.13L9 3.13 9 3 3-3z' fill='black'/%3E%3Cpath d='M2-2l.13.12L8 4.12 8 4 2-2z' fill='black'/%3E%3Cpath d='M1-1l.13.13L7 5.12 7 5 1-1z' fill='black'/%3E%3Cpath d='M0 0l.13.13L6 6.13 6 6 0 0z' fill='black'/%3E%3Cpath d='M-1 1l.13.13L5 7.12 5 7-1 1z' fill='black'/%3E%3Cpath d='M-2 2l.13.12L4 8.12 4 8-2 2z' fill='black'/%3E%3C/g%3E%3C/svg%3E",
  "05": "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23c)'%3E%3Cpath d='M30 30h-4.38v-4.36H30V30zm-5.02-4.36V30h-4.36v-4.36h4.36zm-5-4.36V30h-4.36v-4.36h4.36zm-5 0V30h-4.34v-4.36h4.34zm-5 0V30H5.64v-4.36H10zm-5 0V30H.64v-4.36H5zM30 25h-4.38v-4.34h4.34v-.64h-4.34v-4.36H30V25zM5 20.66V25H.64v-4.34H5zm5 0V25H5.64v-4.34H10zm5 0V25h-4.34v-4.34h4.34zm5 0V25h-4.36v-4.34h4.36zm5 0V25h-4.36v-4.34h4.36zM5 15.65v4.36H.64v-4.36H5zm5 0v4.36H5.64v-4.36H10zm5 0v4.36h-4.34v-4.36h4.34zm5 0v4.36h-4.36v-4.36h4.36zm5 0v4.36h-4.36v-4.36h4.36zM30 15.01h-4.38v-4.36H30v4.36zM5 10.65v4.36H.64v-4.36H5zm5 0v4.36H5.64v-4.36H10zm5 0v4.36h-4.34v-4.36h4.34zm5 0v4.36h-4.36v-4.36h4.36zm5 0v4.36h-4.36v-4.36h4.36zM30 10.01h-4.38V5.65H30v4.36zM5 5.65v4.36H.64V5.65H5zm5 0v4.36H5.64V5.65H10zm5 0v4.36h-4.34V5.65h4.34zm5 0v4.36h-4.36V5.65h4.36zm5 0v4.36h-4.36V5.65h4.36zM30 5h-4.38V.64H30V5zM5 .64V5H.64V.64H5zm5 0V5H5.64V.64H10zm5 0V5h-4.34V.64h4.34zm5 0V5h-4.36V.64h4.36zm5 0V5h-4.36V.64h4.36z' fill='black' fill-opacity='.9'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='c'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  "06": "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='m' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'%3E%3Cpath d='M24 0H0v24h24V0z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23m)'%3E%3Cpath d='M12.51-11.48l-24 24 3.5 3.5 24-24-3.5-3.5z' fill='black' fill-opacity='.75'/%3E%3Cpath d='M16.51-7.48l-24 24 3.5 3.5 24-24-3.5-3.5z' fill='black' fill-opacity='.75'/%3E%3Cpath d='M20.5-3.47l-24 24 3.5 3.49 24-24-3.5-3.49z' fill='black' fill-opacity='.75'/%3E%3Cpath d='M24.51.52l-24 24 3.5 3.49 24-24-3.5-3.49z' fill='black' fill-opacity='.75'/%3E%3Cpath d='M28.51 4.51l-24 24 3.5 3.49 24-24-3.5-3.49z' fill='black' fill-opacity='.75'/%3E%3Cpath d='M32.5 8.51l-24 24 3.5 3.49 24-24-3.5-3.49z' fill='black' fill-opacity='.75'/%3E%3C/g%3E%3C/svg%3E",
};

var HATCH_TEXTURE_BY_COUNT = {
  1: ["07"],
  2: ["07", "01"],
  3: ["07", "03", "00"],
  4: ["07", "04", "03", "00"],
  5: ["07", "06", "04", "01", "00"],
  6: ["07", "06", "05", "04", "01", "00"],
  7: ["07", "06", "05", "04", "03", "01", "00"],
  8: ["07", "06", "05", "04", "03", "02", "01", "00"],
};

var _hatchSvgImages = {};
var _hatchRasterTiles = {};

function hatchTextureCodesForCount(n) {
  if (n >= 1 && n <= 8) return HATCH_TEXTURE_BY_COUNT[n].slice();
  if (n > 8) {
    var out = HATCH_TEXTURE_BY_COUNT[8].slice();
    while (out.length < n) out.splice(out.length - 1, 0, "01");
    return out;
  }
  return ["07"];
}

function getOrBuildRasterTile(img) {
  if (!img || !img.naturalWidth) return null;
  var key = img.src;
  if (_hatchRasterTiles[key]) return _hatchRasterTiles[key];
  var w = img.naturalWidth;
  var h = img.naturalHeight;
  var c = document.createElement("canvas");
  c.width = Math.max(1, Math.ceil(w * DPR));
  c.height = Math.max(1, Math.ceil(h * DPR));
  var pc = c.getContext("2d");
  pc.setTransform(DPR, 0, 0, DPR, 0, 0);
  pc.drawImage(img, 0, 0, w, h);
  _hatchRasterTiles[key] = c;
  return c;
}

function createSvgRepeatPattern(ctx, img) {
  var tile = getOrBuildRasterTile(img);
  if (!tile) return null;
  var pat = ctx.createPattern(tile, "repeat");
  if (pat && DPR !== 1 && typeof pat.setTransform === "function") {
    pat.setTransform(new DOMMatrix().scaleSelf(1 / DPR, 1 / DPR));
  }
  return pat;
}

function getFillForTextureCode(ctx, code) {
  if (code === "00") return chartFg(0);
  if (code === "07") return chartFg(0.75);
  var dataUri = HATCH_SVG_DATA[code];
  if (!dataUri) return chartFg(0.12);
  var img = _hatchSvgImages[code];
  if (img && img.complete && img.naturalWidth) {
    var p = createSvgRepeatPattern(ctx, img);
    return p || chartFg(0.18);
  }
  return chartFg(0.14);
}

function preloadHatchSvgImages(done) {
  var keys = Object.keys(HATCH_SVG_DATA);
  var left = keys.length;
  if (left === 0) {
    if (done) done();
    return;
  }
  keys.forEach(function (k) {
    if (
      _hatchSvgImages[k] &&
      _hatchSvgImages[k].complete &&
      _hatchSvgImages[k].naturalWidth
    ) {
      if (--left === 0 && done) done();
      return;
    }
    var im = new Image();
    im.onload = function () {
      _hatchSvgImages[k] = im;
      if (--left === 0 && done) done();
    };
    im.onerror = function () {
      if (--left === 0 && done) done();
    };
    im.src = HATCH_SVG_DATA[k];
  });
}

function indicesSortedByValueLargeFirst(data) {
  var idx = [];
  for (var i = 0; i < data.length; i++) idx.push(i);
  return idx.sort(function (a, b) {
    return Number(data[b]) - Number(data[a]);
  });
}

/* === Chart style toggle === */

var currentChartStyle = bakedChartStyle;

function snapshotOriginalColors() {
  if (typeof Chart === "undefined") return;
  var allInstances = Object.values(Chart.instances || {});
  if (allInstances.length === 0) return;
  allInstances.forEach(function (chart) {
    chart.data.datasets.forEach(function (ds) {
      if (!ds._origBg) {
        ds._origBg = ds.backgroundColor;
        ds._origBorder = ds.borderColor;
        ds._origWidth = ds.borderWidth;
      }
    });
  });
}

function setChartStyle(style) {
  currentChartStyle = style;
  snapshotOriginalColors();
  var canvases = document.querySelectorAll(".chart-wrap canvas");
  var usePatterns = style === "pattern" || style === "inked";

  var allInstances =
    typeof Chart !== "undefined" ? Object.values(Chart.instances || {}) : [];
  allInstances.forEach(function (chart) {
    var isDoughnutOrPie =
      chart.config.type === "doughnut" || chart.config.type === "pie";
    chart.data.datasets.forEach(function (ds, dsIndex) {
      if (usePatterns) {
        var ctx = chart.ctx;
        if (isDoughnutOrPie && Array.isArray(ds._origBg)) {
          var nSeg = ds._origBg.length;
          var sortedSeg =
            nSeg >= 2 && Array.isArray(ds.data) && ds.data.length === nSeg
              ? indicesSortedByValueLargeFirst(ds.data)
              : [];
          var codesPie = hatchTextureCodesForCount(Math.max(1, nSeg));
          ds.backgroundColor = ds._origBg.map(function (_, segIdx) {
            var pos = sortedSeg.indexOf(segIdx);
            var code = pos >= 0 ? codesPie[pos] : codesPie[codesPie.length - 1];
            return getFillForTextureCode(ctx, code);
          });
          ds.borderColor = ds._origBg.map(function () {
            return chartFg(0.85);
          });
          ds.borderWidth = 0.5;
        } else if (
          chart.config.type === "bar" &&
          chart.data.datasets.length === 1 &&
          Array.isArray(ds.data) &&
          ds.data.length >= 3
        ) {
          ds.backgroundColor = getFillForTextureCode(ctx, "07");
          ds.borderColor = chartFg(0.85);
          ds.borderWidth = 0.5;
        } else if (
          chart.config.type === "bar" &&
          chart.data.datasets.length === 1 &&
          Array.isArray(ds.data) &&
          ds.data.length === 2
        ) {
          var va = Number(ds.data[0]) || 0;
          var vb = Number(ds.data[1]) || 0;
          var largeIdx = va >= vb ? 0 : 1;
          var twoCodes = hatchTextureCodesForCount(2);
          var fills2 = [];
          fills2[largeIdx] = getFillForTextureCode(ctx, twoCodes[0]);
          fills2[1 - largeIdx] = getFillForTextureCode(ctx, twoCodes[1]);
          ds.backgroundColor = fills2;
          ds.borderColor = [chartFg(0.85), chartFg(0.85)];
          ds.borderWidth = 0.5;
        } else if (chart.config.type === "line" && ds.fill) {
          var filledIdx = [];
          for (var fi = 0; fi < chart.data.datasets.length; fi++) {
            if (chart.data.datasets[fi].fill) filledIdx.push(fi);
          }
          var nFilled = filledIdx.length;
          if (nFilled <= 1) {
            ds.backgroundColor = getFillForTextureCode(ctx, "01");
          } else {
            var means = filledIdx.map(function (idx) {
              var d = chart.data.datasets[idx].data;
              var sum = 0,
                cnt = 0;
              for (var mi = 0; mi < d.length; mi++) {
                var v =
                  typeof d[mi] === "number"
                    ? d[mi]
                    : d[mi] && typeof d[mi].y === "number"
                      ? d[mi].y
                      : NaN;
                if (!isNaN(v)) {
                  sum += v;
                  cnt++;
                }
              }
              return cnt ? sum / cnt : 0;
            });
            var ranked = filledIdx.slice().sort(function (a, b) {
              return means[filledIdx.indexOf(a)] - means[filledIdx.indexOf(b)];
            });
            var rank = ranked.indexOf(dsIndex);
            var areaCodes;
            if (nFilled === 2) {
              areaCodes = ["07", "01"];
            } else if (nFilled === 3) {
              areaCodes = ["07", "05", "00"];
            } else if (nFilled === 4) {
              areaCodes = ["07", "04", "01", "00"];
            } else {
              areaCodes = hatchTextureCodesForCount(nFilled);
            }
            var areaCode =
              rank >= 0 && rank < areaCodes.length
                ? areaCodes[rank]
                : areaCodes[0];
            ds.backgroundColor = getFillForTextureCode(ctx, areaCode);
          }
          ds.borderColor = chartFg(0.85);
          ds.borderWidth = 0.5;
        } else if (chart.config.type === "line" && !ds.fill) {
          ds.backgroundColor = ds._origBg || chartFg(0.06);
          ds.borderColor =
            ds._origBorder != null ? ds._origBorder : chartFg(0.85);
          ds.borderWidth = ds._origWidth || 0.5;
        } else {
          var allIdx = [];
          for (var ai = 0; ai < chart.data.datasets.length; ai++)
            allIdx.push(ai);
          var codes = hatchTextureCodesForCount(allIdx.length);
          var code = codes[dsIndex % codes.length];
          ds.backgroundColor = getFillForTextureCode(ctx, code);
          ds.borderColor = chartFg(0.85);
          ds.borderWidth = 0.5;
        }
      } else {
        if (brandChartColor) {
          if (isDoughnutOrPie && Array.isArray(ds._origBg)) {
            ds.backgroundColor = ds._origBg.map(function (_, i) {
              var opacities = [1, 0.65, 0.4, 0.25, 0.12];
              return chartFg(opacities[i % opacities.length]);
            });
            ds.borderColor = "rgba(255,255,255,0.3)";
          } else {
            ds.borderColor = brandChartColor;
            ds.backgroundColor = brandChartColor + "18";
            if (ds.pointHoverBackgroundColor !== undefined) {
              ds.pointHoverBackgroundColor = brandChartColor;
            }
          }
          ds.borderWidth = ds._origWidth || 1.5;
        } else {
          ds.backgroundColor = ds._origBg || "rgba(0,0,0,0.06)";
          ds.borderColor = ds._origBorder || "rgba(0,0,0,0.4)";
          ds.borderWidth = ds._origWidth || 1.5;
        }
      }
    });
    if (
      brandChartColor &&
      chart.options.plugins &&
      chart.options.plugins.targetLine
    ) {
      chart.options.plugins.targetLine.color = brandChartColor + "30";
      chart.options.plugins.targetLine.labelColor = brandChartColor + "55";
    }
    chart.update("none");
  });

  var report = document.querySelector(".report");
  if (report) {
    report.classList.toggle("ink-filtered", style === "inked");
  }

  canvases.forEach(function (c) {
    c.style.filter = "";
  });

  document.querySelectorAll(".chart-style-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.style === style);
  });
}

window.setChartStyle = setChartStyle;
window.getChartStyle = function () {
  return currentChartStyle;
};

/* === Chart.js global defaults === */

if (typeof Chart !== "undefined") {
  Chart.defaults.font.family =
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = "rgba(0,0,0,0.4)";
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0,0,0,0.8)";
  Chart.defaults.plugins.tooltip.cornerRadius = 2;
  Chart.defaults.plugins.tooltip.padding = 8;

  preloadHatchSvgImages();

  Chart.register({
    id: "reportKitChartDefaults",
    afterInit: function (chart) {
      var type = chart.config.type;
      if (type === "pie" || type === "doughnut") {
        chart.options.maintainAspectRatio = true;
        chart.options.aspectRatio = 1;
        if (!chart.options.plugins) chart.options.plugins = {};
        if (!chart.options.plugins.legend) chart.options.plugins.legend = {};
        chart.options.plugins.legend.position = "right";
      } else if (type === "bar" || type === "line") {
        chart.options.maintainAspectRatio = false;
      }
    },
  });
}

/* === Gallery / carousel ===
   A full-width, swipeable carousel for paging through many images (e.g. the
   options in a roundup). Prev/next buttons, clickable dots, a counter, keyboard
   arrows, and touch swipe. Slides are static HTML; this just wires the controls.
   Each slide's image also opens in the lightbox (handled by initLightbox). */

function initGalleries() {
  document.querySelectorAll(".gallery").forEach(function (gal) {
    var track = gal.querySelector(".gallery__track");
    var slides = gal.querySelectorAll(".gallery__slide");
    if (!track || slides.length === 0) return;

    var prev = gal.querySelector(".gallery__btn--prev");
    var next = gal.querySelector(".gallery__btn--next");
    var dotsWrap = gal.querySelector(".gallery__dots");
    var counter = gal.querySelector(".gallery__counter");
    var i = 0;
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, idx) {
        var d = document.createElement("button");
        d.className = "gallery__dot" + (idx === 0 ? " active" : "");
        d.setAttribute("aria-label", "Go to slide " + (idx + 1));
        d.addEventListener("click", function () {
          go(idx);
        });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      track.style.transform = "translateX(" + -i * 100 + "%)";
      dots.forEach(function (d, idx) {
        d.classList.toggle("active", idx === i);
      });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
      if (counter) counter.textContent = i + 1 + " / " + slides.length;
    }
    function go(n) {
      i = Math.max(0, Math.min(slides.length - 1, n));
      render();
    }

    if (prev)
      prev.addEventListener("click", function () {
        go(i - 1);
      });
    if (next)
      next.addEventListener("click", function () {
        go(i + 1);
      });

    gal.setAttribute("tabindex", "0");
    gal.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        go(i - 1);
      } else if (e.key === "ArrowRight") {
        go(i + 1);
      }
    });

    var startX = null;
    gal.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );
    gal.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        go(i + (dx < 0 ? 1 : -1));
      }
      startX = null;
    });

    render();
  });
}

/* === Image lightbox ===
   Click any report image to open an expanded overlay. Images don't carry
   any other single-click behaviour, so a single click is the trigger.
   - Put a full-resolution URL in data-full="..." to show a larger source
     than the inline thumbnail; otherwise the inline src is reused.
   - Add data-lightbox="off" to opt an image out (e.g. tiny logos). */

function initLightbox() {
  if (document.querySelector(".lightbox")) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML =
    '<button class="lightbox__close" aria-label="Close">\u00D7</button>' +
    '<img class="lightbox__img" alt="">' +
    '<div class="lightbox__caption"></div>';
  document.body.appendChild(overlay);

  var lbImg = overlay.querySelector(".lightbox__img");
  var lbCap = overlay.querySelector(".lightbox__caption");
  var closeBtn = overlay.querySelector(".lightbox__close");

  function open(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    if (caption) {
      lbCap.textContent = caption;
      lbCap.style.display = "";
    } else {
      lbCap.textContent = "";
      lbCap.style.display = "none";
    }
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Backdrop (and close button) dismiss; clicking the image itself does not.
  overlay.addEventListener("click", function (e) {
    if (e.target === lbImg) return;
    close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  function captionFor(img) {
    var slide = img.closest(".gallery__slide");
    if (slide) {
      var gc = slide.querySelector(".gallery__caption");
      if (gc) return gc.textContent.trim();
    }
    var breakBody = img.closest(".report-image-break__body");
    if (breakBody) {
      var bc = breakBody.querySelector(".fig-caption");
      if (bc) return bc.textContent.trim();
    }
    var item = img.closest(".report-item");
    if (item) {
      var fc = item.querySelector(".fig-caption");
      if (fc) return fc.textContent.trim();
    }
    return img.alt || "";
  }

  var imgs = document.querySelectorAll(
    ".image-wrap img, .report-image-break__img, .gallery__slide img, .image-grid img, img.zoomable, .card__img-wrap img:not(.card__thumb)",
  );
  imgs.forEach(function (img) {
    if (img.dataset.lightbox === "off") return;
    img.classList.add("zoomable");
    img.addEventListener("click", function () {
      var full = img.getAttribute("data-full") || img.currentSrc || img.src;
      open(full, img.alt, captionFor(img));
    });
  });

  window.openLightbox = open;
}

/* === Card thumbnail swap ===
   Clicking a .card__thumb inside a card's .card__img-wrap swaps that
   thumbnail's src with the hero image, so the reader can preview photos
   without leaving the card. */

function initCardThumbs() {
  document.querySelectorAll(".card__thumb").forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      var hero = thumb
        .closest(".card__img-wrap")
        .querySelector("img:not(.card__thumb)");
      if (!hero) return;
      var tmpSrc = hero.src;
      var tmpAlt = hero.alt;
      hero.src = thumb.src;
      hero.alt = thumb.alt;
      thumb.src = tmpSrc;
      thumb.alt = tmpAlt;
    });
  });
}


/* === Card filter bar ===
   Clicking a .filter-btn sets it active and hides/shows .card elements whose
   data-tags attribute doesn't include the button's data-filter value.
   "all" always shows everything. Multiple filter bars on the same page each
   scope to their own .card-grid sibling. */

function initCardFilters() {
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter") || "all";

      var bar = btn.closest(".filter-bar");
      if (bar) {
        bar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
      }
      btn.classList.add("active");

      var grid = bar
        ? bar.nextElementSibling
        : document.querySelector(".card-grid");
      if (!grid || !grid.classList.contains("card-grid")) return;

      grid.querySelectorAll(".card").forEach(function (card) {
        if (filter === "all") {
          card.style.display = "";
        } else {
          var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
          card.style.display = tags.indexOf(filter) !== -1 ? "" : "none";
        }
      });
    });
  });
}


/* === Slide deck navigation ===
   Active only when a .deck is present (deck format). Arrow keys / PageUp/Down /
   Space / Home / End, on-screen buttons, touch swipe, and a progress bar. */

function initDeck() {
  var deck = document.querySelector(".deck");
  if (!deck) return;
  var track = deck.querySelector(".deck__track");
  var slides = deck.querySelectorAll(".deck__slide");
  if (!track || slides.length === 0) return;

  var prev = document.querySelector(".deck__btn--prev");
  var next = document.querySelector(".deck__btn--next");
  var counter = document.querySelector(".deck__counter");
  var progress = document.querySelector(".deck__progress");
  var i = 0;

  function render() {
    track.style.transform = "translateX(" + -i * 100 + "vw)";
    if (counter) counter.textContent = i + 1 + " / " + slides.length;
    if (progress) progress.style.width = ((i + 1) / slides.length) * 100 + "%";
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
  }
  function go(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    render();
  }

  if (prev)
    prev.addEventListener("click", function () {
      go(i - 1);
    });
  if (next)
    next.addEventListener("click", function () {
      go(i + 1);
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1);
    }
  });

  var startX = null;
  deck.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  deck.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      go(i + (dx < 0 ? 1 : -1));
    }
    startX = null;
  });

  render();
}

/* === Init === */

document.addEventListener("DOMContentLoaded", function () {
  // Inject SVG filter definitions (ink-heavy/medium/light) referenced by CSS
  var svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgDefs.setAttribute("style", "position:absolute;width:0;height:0");
  svgDefs.setAttribute("aria-hidden", "true");
  svgDefs.innerHTML =
    "<defs>" +
    '<filter id="ink-heavy" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="5" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<filter id="ink-medium" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<filter id="ink-light" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0.5" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    "</defs>";
  document.body.insertBefore(svgDefs, document.body.firstChild);

  updateDate();
  randomizeStamps();

  // Load user-overridden settings, fall back to server-baked values
  var saved = loadSettings();
  if (
    saved &&
    typeof saved.color === "number" &&
    typeof saved.font === "number"
  ) {
    currentColorIndex = saved.color % PAPERS.length;
    currentFontIndex = saved.font % HEADLINE_FONTS.length;
  }

  applyColor(currentColorIndex);
  applyFont(currentFontIndex);

  buildSwatches();
  buildChartStyleToggle();
  buildFontOptions();

  initGalleries();
  initCardThumbs();
  initCardFilters();
  initDeck();
  initLightbox();

  // Preload embedded SVG textures, then snapshot chart colors and apply style.
  var applyInitialChartStyle = function () {
    if (typeof Chart !== "undefined") {
      var allInstances = Object.values(Chart.instances || {});
      if (allInstances.length > 0) {
        snapshotOriginalColors();
        setChartStyle(currentChartStyle);
        preloadHatchSvgImages(function () {
          _hatchRasterTiles = {};
          setChartStyle(currentChartStyle);
        });
      }
    }
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(applyInitialChartStyle, { timeout: 1000 });
  } else {
    setTimeout(applyInitialChartStyle, 500);
  }

  // Resize charts around printing; strip background for inked print.
  var resizeAllCharts =
    typeof Chart !== "undefined"
      ? function () {
          Object.values(Chart.instances || {}).forEach(function (chart) {
            chart.resize();
          });
        }
      : null;

  window.addEventListener("beforeprint", function () {
    var report = document.querySelector(".report");
    if (report && currentChartStyle === "inked")
      report.classList.add("print-no-bg");
    if (resizeAllCharts) resizeAllCharts();
  });
  window.addEventListener("afterprint", function () {
    var report = document.querySelector(".report");
    if (report) report.classList.remove("print-no-bg");
    if (resizeAllCharts) resizeAllCharts();
  });

  if (typeof ResizeObserver !== "undefined" && typeof Chart !== "undefined") {
    var chartWraps = document.querySelectorAll(".chart-wrap");
    if (chartWraps.length > 0) {
      var ro = new ResizeObserver(function () {
        Object.values(Chart.instances || {}).forEach(function (chart) {
          chart.resize();
        });
      });
      chartWraps.forEach(function (wrap) {
        ro.observe(wrap);
      });
    }
  }

  // Fade in
  requestAnimationFrame(function () {
    var report = document.querySelector(".report");
    if (report) report.classList.add("ready");
    var deck = document.querySelector(".deck");
    if (deck) deck.classList.add("ready");
    var btn = document.getElementById("settingsBtn");
    if (btn) btn.classList.add("ready");
  });

  // Settings panel toggle
  var settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      document.getElementById("settingsPanel").classList.toggle("open");
    });
  }

  document.addEventListener("click", function (e) {
    var panel = document.getElementById("settingsPanel");
    if (
      panel &&
      panel.classList.contains("open") &&
      !panel.contains(e.target)
    ) {
      panel.classList.remove("open");
    }
  });
});
