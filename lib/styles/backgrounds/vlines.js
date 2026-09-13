// Vercel-like fine horizontal lines plus a slow light sweep.
function vlinesBackground(W, H, t, radius, clip) {
  let lines = "";
  for (let ly = 26; ly < H; ly += 26) {
    lines += `<line x1="0" y1="${ly}" x2="${W}" y2="${ly}" stroke="#${t.text}" stroke-opacity="0.12" stroke-width="1"/>`;
  }
  for (let lx = 40; lx < W; lx += 80) {
    lines += `<line x1="${lx}" y1="0" x2="${lx}" y2="${H}" stroke="#${t.text}" stroke-opacity="0.06" stroke-width="1"/>`;
  }
  return `<defs>${clip}
      <linearGradient id="gg-sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <style>
        .gg-sw { animation: gg-sweepmove 5s linear infinite; }
        @keyframes gg-sweepmove { from { transform: translateX(-140px); } to { transform: translateX(${W + 140}px); } }
      </style></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">${lines}
        <rect class="gg-sw" x="0" y="0" width="140" height="${H}" fill="url(#gg-sweep)"/>
      </g>`;
}

module.exports = vlinesBackground;
