// Dispatches to a per-bgKind background renderer (see the sibling files in
// this directory, one per visual pattern). Border, glow filter, and the
// clip-path def are computed once here since every style shares that logic;
// each bgKind module only returns the part of the markup specific to it.
//
// To add a new background pattern: create ./your-kind.js exporting a
// function (W, H, t, radius, clip) => svgMarkup, register it in BACKGROUNDS
// below, and set bgKind: "your-kind" on the style(s) that should use it
// (see lib/styles/README.md).
const BACKGROUNDS = {
  gradient: require("./gradient"),
  aurora: require("./aurora"),
  mesh: require("./mesh"),
  waves: require("./waves"),
  dots: require("./dots"),
  vlines: require("./vlines"),
  grid: require("./grid"),
  orbs: require("./orbs"),
};

function background(W, H, t, tok, opts) {
  const radius = opts.border_radius != null ? opts.border_radius : tok.radius;
  const glow = tok.glow
    ? `<defs><filter id="gg-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
    : "";
  if (tok.transparent) {
    const sw = tok.thickBorder ? 2.5 : 1;
    const col = tok.thickBorder ? (opts.border_color || t.accent) : (opts.border_color || t.border);
    const border = (opts.hide_border) ? "" :
      `<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="${radius}" fill="none" stroke="#${col}" stroke-width="${sw}"/>`;
    return glow + border;
  }
  const border = (opts.hide_border || tok.noBorder) ? "" :
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius}" fill="none" stroke="#${opts.border_color || t.border}" stroke-width="1"/>`;
  const clip = `<clipPath id="gg-clip"><rect width="${W}" height="${H}" rx="${radius}"/></clipPath>`;

  const bgRenderer = BACKGROUNDS[tok.bgKind];
  if (bgRenderer) {
    return glow + bgRenderer(W, H, t, radius, clip) + border;
  }
  if (tok.glass) {
    return `
      <defs>
        <linearGradient id="gg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#${t.panel}"/>
          <stop offset="100%" stop-color="#${t.bg}"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-bg)"/>
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius}" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/>`;
  }
  return glow + `<rect width="${W}" height="${H}" rx="${radius}" fill="#${opts.bg_color || t.bg}"/>` + border;
}

module.exports = background;
