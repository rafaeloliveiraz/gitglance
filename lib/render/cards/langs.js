const { svg, esc, langColor, styleAndTheme, topLangs } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function langRowsMarkup(data, t, tok, opts, x, startY, barW) {
  const rows = topLangs(data.langs, opts.langs_count || 5, opts.hide_other);
  const rowH = 46;
  return rows.map((r, i) => {
    const y = startY + i * rowH;
    const color = langColor(r.name, t, tok, i);
    const fillW = Math.max(6, Math.round((barW * r.pct) / 100));
    return `<g class="row" style="animation-delay:${0.2 + i * 0.1}s">
      <text x="${x}" y="${y}" fill="#${opts.text_color || t.text}" font-family="${tok.font}" font-size="15">${esc(r.name)}</text>
      <text x="${x + barW}" y="${y}" text-anchor="end" fill="#${t.muted}" font-family="${tok.mono}" font-size="13">${r.pct.toFixed(1)}%</text>
      <rect x="${x}" y="${y + 10}" width="${barW}" height="9" rx="4.5" fill="#${t.border}"/>
      <rect class="bar-fill" x="${x}" y="${y + 10}" width="${fillW}" height="9" rx="4.5" fill="#${color}"/>
    </g>`;
  }).join("");
}

function renderLangs(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const count = opts.langs_count || 5;
  const W = opts.card_width || 380, x = 30;
  const H = 90 + (count + 1) * 46;
  const barW = W - x * 2;
  const title = opts.custom_title || "Most Used Languages";
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, x, 50, W) +
    langRowsMarkup(data, t, tok, opts, x, 100, barW);
  return svg(W, H, inner);
}

module.exports = { renderLangs, langRowsMarkup };
