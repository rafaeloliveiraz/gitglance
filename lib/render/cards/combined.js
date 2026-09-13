const { svg, styleAndTheme } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");
const { statRows } = require("./stats");
const { langRowsMarkup } = require("./langs");

function renderCombined(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const W = opts.card_width || 820, H = 272, x = 34;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const midX = 430;
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, x, 52, W) +
    statRows(data, t, tok, opts, x, 104) +
    `<line x1="${midX - 20}" y1="86" x2="${midX - 20}" y2="${H - 30}" stroke="#${t.border}" stroke-width="1"/>` +
    `<text x="${midX}" y="52" fill="#${opts.title_color || t.title}" font-family="${tok.font}" font-size="16" font-weight="600" letter-spacing="${tok.labelSpacing}">${tok.labelUpper ? "MOST USED LANGUAGES" : "Most Used Languages"}</text>` +
    langRowsMarkup(data, t, tok, { ...opts, langs_count: 4, hide_other: true }, midX, 104, W - midX - x);
  return svg(W, H, inner);
}

module.exports = { renderCombined };
