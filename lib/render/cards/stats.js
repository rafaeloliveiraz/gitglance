const { svg, n, esc, styleAndTheme } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function statRows(data, t, tok, opts, x, startY) {
  const label = (s) => tok.labelUpper ? s.toUpperCase() : s;
  const rows = [
    ["Stars Earned", n(data.stars)],
    ["Public Repos", n(data.public_repos)],
    ["Followers", n(data.followers)],
    ["Following", n(data.following)],
  ];
  const rowH = 40;
  const valX = x + (opts.stat_width || 360);
  let out = "";
  rows.forEach(([lb, val], i) => {
    const y = startY + i * rowH;
    out += `<g class="row" style="animation-delay:${0.15 + i * 0.12}s">
      <text x="${x}" y="${y}" fill="#${t.muted}" font-family="${tok.font}" font-size="15" letter-spacing="${tok.labelSpacing}">${esc(label(lb))}</text>
      <text x="${valX}" y="${y}" text-anchor="end" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="19" font-weight="700">${esc(val)}</text>
    </g>`;
  });
  return out;
}

function renderStats(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const W = opts.card_width || 460, H = 252, x = 34;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, x, 52, W) +
    statRows(data, t, tok, opts, x, 104);
  return svg(W, H, inner);
}

module.exports = { renderStats, statRows };
