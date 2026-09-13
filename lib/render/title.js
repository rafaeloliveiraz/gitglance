// Title row and small chrome pieces shared by every card.
const { esc } = require("./helpers");

function windowDots(x, y) {
  return `<g>
    <circle cx="${x}" cy="${y}" r="6" fill="#ff5f56"/>
    <circle cx="${x + 20}" cy="${y}" r="6" fill="#ffbd2e"/>
    <circle cx="${x + 40}" cy="${y}" r="6" fill="#27c93f"/>
  </g>`;
}

function vercelMark(x, y, color, s) {
  // small triangle (Vercel-like)
  return `<path d="M ${x} ${y + s} L ${x + s} ${y + s} L ${x + s / 2} ${y} Z" fill="#${color}"/>`;
}

function titleBlock(title, t, tok, opts, x, y, W) {
  const color = opts.title_color || t.title;
  if (opts.hide_title) return "";
  if (tok.watermark === "triangle") {
    return `${vercelMark(x, y - 14, color, 15)}
      <text x="${x + 26}" y="${y}" fill="#${color}" font-family="${tok.font}" font-size="20" font-weight="600" letter-spacing="0.3">${esc(title)}</text>
      ${tok.divider ? `<line x1="${x}" y1="${y + 16}" x2="${W - x}" y2="${y + 16}" stroke="#${t.border}" stroke-width="1"/>` : ""}`;
  }
  if (tok.dots) {
    return `${windowDots(x + 6, y - 6)}
      <text x="${x + 60}" y="${y}" fill="#${t.muted}" font-family="${tok.font}" font-size="15">~/${esc(opts.login || "")} <tspan fill="#${color}">--stats</tspan></text>`;
  }
  const bar = tok.titleBar && !t.noTitleBar ? `<rect x="${x}" y="${y + 10}" width="46" height="3" rx="1.5" fill="#${color}"/>` : "";
  return `<text x="${x}" y="${y}" fill="#${color}" font-family="${tok.font}" font-size="22" font-weight="700">${esc(title)}</text>${bar}`;
}

function animStyle() {
  // Resting state is fully visible. All keyframes only define "from", so if
  // animations do not run the card still renders complete. Never blank.
  return `<style>
    .bar-fill { transform-box: fill-box; transform-origin: left center; animation: gg-grow 0.9s ease-out backwards; }
    .vbar { transform-box: fill-box; transform-origin: center bottom; animation: gg-rise 0.9s ease-out backwards; }
    .gg-seg { animation: gg-fade 0.8s ease-out backwards; }
    .gg-ring { animation: gg-fade 1s ease-out backwards; }
    @keyframes gg-grow { from { transform: scaleX(0); } }
    @keyframes gg-rise { from { transform: scaleY(0); } }
    @keyframes gg-fade { from { opacity: 0.15; } }
  </style>`;
}

module.exports = { windowDots, vercelMark, titleBlock, animStyle };
