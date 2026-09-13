const { svg, esc } = require("../helpers");
const { theme } = require("../../themes");
const { SANS } = require("../../styles/fonts");

function errorCard(message, opts) {
  const t = theme(opts && opts.theme);
  const W = 460, H = 120;
  return svg(W, H,
    `<rect width="${W}" height="${H}" rx="14" fill="#${t.bg}"/><rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="#${t.border}"/>` +
    `<text x="30" y="50" fill="#${t.title}" font-family="${SANS}" font-size="18" font-weight="700">gitglance</text>` +
    `<text x="30" y="80" fill="#${t.muted}" font-family="${SANS}" font-size="14">${esc(message)}</text>`);
}

module.exports = { errorCard };
