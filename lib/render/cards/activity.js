const { svg, n, glowAttr, styleAndTheme } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function renderActivity(user, series, opts) {
  const { tok, t } = styleAndTheme(opts);
  const W = opts.card_width || 560, H = 220, x0 = 34, x1 = W - 34;
  const baseY = H - 46, topY = 92;
  const total = series.reduce((s, d) => s + d.count, 0);
  const maxV = Math.max(...series.map((d) => d.count), 1);
  const title = opts.custom_title || `Commit Activity · last ${series.length} days`;
  const pts = series.map((d, i) => [
    x0 + (i * (x1 - x0)) / Math.max(1, series.length - 1),
    baseY - (d.count / maxV) * (baseY - topY),
  ]);
  // Smooth path via midpoint quadratics.
  let line = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i += 1) {
    const mx = ((pts[i - 1][0] + pts[i][0]) / 2).toFixed(1);
    const my = ((pts[i - 1][1] + pts[i][1]) / 2).toFixed(1);
    line += ` Q ${pts[i - 1][0].toFixed(1)} ${pts[i - 1][1].toFixed(1)} ${mx} ${my}`;
  }
  line += ` L ${pts[pts.length - 1][0].toFixed(1)} ${pts[pts.length - 1][1].toFixed(1)}`;
  const area = line + ` L ${x1} ${baseY} L ${x0} ${baseY} Z`;
  const lastPt = pts[pts.length - 1];
  const inner = animStyle() + background(W, H, t, tok, opts) +
    `<defs><linearGradient id="gg-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#${t.accent}" stop-opacity="0.02"/>
    </linearGradient></defs>` +
    titleBlock(title, t, { ...tok, login: user.login }, { ...opts, login: user.login }, 30, 48, W) +
    `<text x="${W - 30}" y="48" text-anchor="end" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="20" font-weight="700">${n(total)}<tspan fill="#${t.muted}" font-size="12" font-weight="400"> commits</tspan></text>` +
    `<line x1="${x0}" y1="${baseY}" x2="${x1}" y2="${baseY}" stroke="#${t.border}" stroke-width="1"/>` +
    `<path d="${area}" fill="url(#gg-area)"/>` +
    `<path d="${line}" fill="none" stroke="#${t.accent}" stroke-width="2.4" stroke-linecap="round"${glowAttr(tok)}/>` +
    `<circle cx="${lastPt[0].toFixed(1)}" cy="${lastPt[1].toFixed(1)}" r="4" fill="#${t.accent}"/>` +
    `<text x="${x0}" y="${H - 22}" fill="#${t.muted}" font-family="${tok.font}" font-size="11.5">${series[0].date}</text>` +
    `<text x="${x1}" y="${H - 22}" text-anchor="end" fill="#${t.muted}" font-family="${tok.font}" font-size="11.5">${series[series.length - 1].date}</text>`;
  return svg(W, H, inner);
}

module.exports = { renderActivity };
