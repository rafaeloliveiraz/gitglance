// Static grid pattern with a soft vertical fade for depth.
function gridBackground(W, H, t, radius, clip) {
  return `<defs>${clip}
      <pattern id="gg-gridp" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M26 0H0V26" fill="none" stroke="#${t.text}" stroke-opacity="0.13" stroke-width="1"/>
      </pattern>
      <linearGradient id="gg-gridfade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
      </linearGradient>
      <mask id="gg-gridmask"><rect width="${W}" height="${H}" fill="url(#gg-gridfade)"/></mask></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)"><rect width="${W}" height="${H}" fill="url(#gg-gridp)" mask="url(#gg-gridmask)"/></g>`;
}

module.exports = gridBackground;
