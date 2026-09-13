// Layered smooth waves along the bottom edge.
function wavesBackground(W, H, t, radius, clip) {
  const y1 = H * 0.72, y2 = H * 0.82, y3 = H * 0.9;
  const wave = (y, amp, color, op) =>
    `<path d="M 0 ${y} C ${W * 0.25} ${y - amp}, ${W * 0.4} ${y + amp}, ${W * 0.62} ${y} S ${W * 0.9} ${y - amp}, ${W} ${y + amp * 0.4} L ${W} ${H} L 0 ${H} Z" fill="#${color}" fill-opacity="${op}"/>`;
  return `<defs>${clip}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        ${wave(y1, 26, t.accent, 0.16)}
        ${wave(y2, 20, t.title, 0.16)}
        ${wave(y3, 14, t.accent, 0.24)}
      </g>`;
}

module.exports = wavesBackground;
