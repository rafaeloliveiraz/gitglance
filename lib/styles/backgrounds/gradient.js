function isLight(hex) {
  const h = String(hex).replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16), g = parseInt(v.slice(2, 4), 16), b = parseInt(v.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// Rich diagonal gradient. Light themes get gentler overlays and no white
// highlight (which reads as a milky wash on light backgrounds).
function gradientBackground(W, H, t, radius, clip) {
  const light = isLight(t.bg);
  const aOp = light ? 0.14 : 0.30, bOp = light ? 0.12 : 0.28;
  const hl = light ? "" : `<radialGradient id="gg-hl" cx="0.15" cy="0.0" r="0.9">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>`;
  const hlRect = light ? "" : `<rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-hl)"/>`;
  return `<defs>${clip}
      <linearGradient id="gg-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${t.accent}" stop-opacity="${aOp}"/>
        <stop offset="35%" stop-color="#${t.bg}"/>
        <stop offset="70%" stop-color="#${t.bg}"/>
        <stop offset="100%" stop-color="#${t.title}" stop-opacity="${bOp}"/>
      </linearGradient>${hl}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-g1)"/>${hlRect}`;
}

module.exports = gradientBackground;
