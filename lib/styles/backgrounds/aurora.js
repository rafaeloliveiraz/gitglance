// Soft drifting light blobs, clipped to the card. Animation is enhancement only.
function auroraBackground(W, H, t, radius, clip) {
  return `<defs>${clip}
      <radialGradient id="gg-a1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.45"/><stop offset="100%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-a2"><stop offset="0%" stop-color="#${t.title}" stop-opacity="0.38"/><stop offset="100%" stop-color="#${t.title}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-a3"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
      <style>
        .gg-blob1 { animation: gg-drift1 6s ease-in-out infinite alternate; }
        .gg-blob2 { animation: gg-drift2 8s ease-in-out infinite alternate; }
        @keyframes gg-drift1 { from { transform: translate(0,0); } to { transform: translate(${Math.round(W * 0.16)}px, 22px); } }
        @keyframes gg-drift2 { from { transform: translate(0,0); } to { transform: translate(-${Math.round(W * 0.14)}px, -18px); } }
      </style></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        <ellipse class="gg-blob1" cx="${W * 0.22}" cy="${H * 0.15}" rx="${W * 0.45}" ry="${H * 0.75}" fill="url(#gg-a1)"/>
        <ellipse class="gg-blob2" cx="${W * 0.85}" cy="${H * 0.9}" rx="${W * 0.5}" ry="${H * 0.8}" fill="url(#gg-a2)"/>
        <ellipse cx="${W * 0.6}" cy="${H * 0.1}" rx="${W * 0.3}" ry="${H * 0.5}" fill="url(#gg-a3)"/>
      </g>`;
}

module.exports = auroraBackground;
