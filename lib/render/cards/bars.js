const { svg, esc, langColor, glowAttr, styleAndTheme, topLangs } = require("../helpers");
const { background } = require("../../styles");
const { titleBlock, animStyle } = require("../title");

function renderBars(data, opts) {
  const { tok, t } = styleAndTheme(opts);
  const rows = topLangs(data.langs, opts.langs_count || 6, true);
  const W = opts.card_width || 460, H = 280;
  const title = opts.custom_title || "Top Languages";
  const baseY = H - 58, maxBarH = 130, slot = (W - 70) / rows.length;
  const maxPct = Math.max(...rows.map((r) => r.pct), 1);
  let bars = "";
  rows.forEach((r, i) => {
    const bh = Math.max(8, (r.pct / maxPct) * maxBarH);
    const bw = Math.min(44, slot * 0.55);
    const x = 40 + i * slot + (slot - bw) / 2;
    const color = langColor(r.name, t, tok, i);
    bars += `<rect class="vbar" style="animation-delay:${i * 0.07}s" x="${x.toFixed(1)}" y="${(baseY - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="5" fill="#${color}"${glowAttr(tok)}/>
      <text x="${(x + bw / 2).toFixed(1)}" y="${baseY - bh - 8}" text-anchor="middle" fill="#${t.muted}" font-family="${tok.mono}" font-size="12">${r.pct.toFixed(0)}%</text>
      <text x="${(x + bw / 2).toFixed(1)}" y="${baseY + 20}" text-anchor="middle" fill="#${opts.text_color || t.text}" font-family="${tok.font}" font-size="12">${esc(r.name.length > 10 ? r.name.slice(0, 9) + "…" : r.name)}</text>`;
  });
  const axis = `<line x1="32" y1="${baseY}" x2="${W - 32}" y2="${baseY}" stroke="#${t.border}" stroke-width="1"/>`;
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, 30, 48, W) + axis + bars;
  return svg(W, H, inner);
}

module.exports = { renderBars };
