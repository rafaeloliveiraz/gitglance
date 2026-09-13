// Mesh-gradient look: colored radial fields anchored at the corners.
function meshBackground(W, H, t, radius, clip) {
  return `<defs>${clip}
      <radialGradient id="gg-m1" cx="0" cy="0" r="1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.50"/><stop offset="60%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m2" cx="1" cy="0" r="1"><stop offset="0%" stop-color="#${t.title}" stop-opacity="0.40"/><stop offset="60%" stop-color="#${t.title}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m3" cx="0" cy="1" r="1"><stop offset="0%" stop-color="#${t.muted}" stop-opacity="0.35"/><stop offset="60%" stop-color="#${t.muted}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m4" cx="1" cy="1" r="1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.30"/><stop offset="60%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        <rect width="${W}" height="${H}" fill="url(#gg-m1)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m2)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m3)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m4)"/>
      </g>`;
}

module.exports = meshBackground;
