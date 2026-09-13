// Subtle dot grid over a gentle vertical gradient.
function dotsBackground(W, H, t, radius, clip) {
  return `<defs>${clip}
      <pattern id="gg-dots" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.4" fill="#${t.text}" fill-opacity="0.10"/>
      </pattern>
      <linearGradient id="gg-dg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#${t.panel}"/>
        <stop offset="100%" stop-color="#${t.bg}"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-dg)"/>
      <g clip-path="url(#gg-clip)"><rect width="${W}" height="${H}" fill="url(#gg-dots)"/></g>`;
}

module.exports = dotsBackground;
