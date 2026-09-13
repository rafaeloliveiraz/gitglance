const { svg, esc, langColor, glowAttr, styleAndTheme, topLangs } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function renderDonut(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const rows = topLangs(data.langs, opts.langs_count || 5, opts.hide_other);
  const W = opts.card_width || 420, H = 260;
  const cx = 120, cy = 150, R = 74, STROKE = 26;
  const title = opts.custom_title || "Language Breakdown";

  let angle = 0, segs = "";
  rows.forEach((r, i) => {
    const sweep = Math.max(2.2, (r.pct / 100) * 360 - 2.2);
    const color = langColor(r.name, t, tok, i);
    segs += `<path class="gg-seg" style="animation-delay:${i * 0.08}s" d="${arcPath(cx, cy, R, angle + 1.1, angle + 1.1 + sweep)}" stroke="#${color}" stroke-width="${STROKE}" fill="none" stroke-linecap="butt"${glowAttr(tok)}/>`;
    angle += (r.pct / 100) * 360;
  });
  // center label
  const totalLangs = Object.keys(data.langs).filter((k) => k !== "Other").length;
  const center = `<text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="26" font-weight="700">${totalLangs}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" fill="#${t.muted}" font-family="${tok.font}" font-size="12">languages</text>`;
  // legend
  let legend = "";
  rows.forEach((r, i) => {
    const y = 78 + i * 30;
    const color = langColor(r.name, t, tok, i);
    legend += `<circle cx="238" cy="${y - 5}" r="6" fill="#${color}"/>
      <text x="254" y="${y}" fill="#${opts.text_color || t.text}" font-family="${tok.font}" font-size="15">${esc(r.name)}</text>
      <text x="${W - 30}" y="${y}" text-anchor="end" fill="#${t.muted}" font-family="${tok.mono}" font-size="13">${r.pct.toFixed(1)}%</text>`;
  });
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, 30, 46, W) +
    segs + center + legend;
  return svg(W, H, inner);
}

module.exports = { renderDonut };
