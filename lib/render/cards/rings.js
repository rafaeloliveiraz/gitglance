const { svg, n, glowAttr, styleAndTheme, GRAYS } = require("../helpers");
const { LANG_COLORS } = require("../../themes");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function ringGauge(cx, cy, r, frac, color, track, value, label, t, tok, opts) {
  const C = 2 * Math.PI * r;
  const filled = Math.max(0.04, Math.min(1, frac)) * C;
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${track}" stroke-width="9"/>
    <circle class="gg-ring" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#${color}" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${filled.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"${glowAttr(tok)}/>
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="19" font-weight="700">${value}</text>
    <text x="${cx}" y="${cy + r + 26}" text-anchor="middle" fill="#${t.muted}" font-family="${tok.font}" font-size="13" letter-spacing="${tok.labelSpacing}">${label}</text>`;
}

function renderRings(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const W = opts.card_width || 520, H = 230;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const ringCols = tok.monochrome
    ? [GRAYS[0], GRAYS[1], GRAYS[2], GRAYS[3]]
    : t.ringColors || [t.accent, LANG_COLORS.TypeScript, LANG_COLORS.JavaScript, LANG_COLORS.Vue || "41b883"];
  const ringTrack = !tok.monochrome && t.ringTrack ? t.ringTrack : t.border;
  const stats = [
    ["Stars", data.stars, ringCols[0]],
    ["Repos", data.public_repos, ringCols[1]],
    ["Followers", data.followers, ringCols[2]],
    ["Following", data.following, ringCols[3]],
  ];
  const maxV = Math.max(...stats.map(([, v]) => v), 1);
  const label = (s) => tok.labelUpper ? s.toUpperCase() : s;
  let rings = "";
  stats.forEach(([lb, v, col], i) => {
    const cx = 88 + i * 118;
    rings += ringGauge(cx, 130, 36, v / maxV, col, ringTrack, n(v), label(lb), t, tok, opts);
  });
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, 30, 48, W) + rings;
  return svg(W, H, inner);
}

module.exports = { renderRings };
