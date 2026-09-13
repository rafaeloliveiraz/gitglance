// Floating circles that drift and breathe at staggered rhythms.
function orbsBackground(W, H, t, radius, clip) {
  const orbs = [
    [0.12, 0.8, 34, t.accent, 3.4, 0], [0.3, 0.2, 20, t.title, 4.2, 0.6],
    [0.52, 0.85, 26, t.accent, 5.0, 1.2], [0.68, 0.15, 16, t.title, 3.8, 0.3],
    [0.84, 0.7, 40, t.accent, 4.6, 0.9], [0.94, 0.25, 14, t.title, 3.2, 1.5],
    [0.42, 0.5, 10, t.accent, 4.0, 0.2],
  ];
  let anim = "<style>";
  let shapes = "";
  orbs.forEach((o, i) => {
    anim += `.gg-o${i} { animation: gg-orb${i} ${o[4]}s ease-in-out ${o[5]}s infinite alternate; }
        @keyframes gg-orb${i} { from { opacity: 0.08; transform: translateY(0); } to { opacity: 0.4; transform: translateY(${i % 2 ? -14 : 14}px); } }`;
    shapes += `<circle class="gg-o${i}" cx="${(W * o[0]).toFixed(0)}" cy="${(H * o[1]).toFixed(0)}" r="${o[2]}" fill="#${o[3]}" opacity="0.2"/>`;
  });
  anim += "</style>";
  return `<defs>${clip}${anim}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">${shapes}</g>`;
}

module.exports = orbsBackground;
