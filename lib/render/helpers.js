// Small helpers shared by more than one card renderer.
const { theme, LANG_COLORS } = require("../themes");
const { styleTokens } = require("../styles");

function esc(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", '"': "&quot;" }[c]));
}
function n(v) {
  if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
  return String(v);
}
const MONO_PALETTE = { bg: "000000", panel: "0a0a0a", title: "ffffff", text: "ffffff", muted: "8a8a8a", accent: "ffffff", border: "333333" };
const GRAYS = ["ffffff", "cfcfcf", "9e9e9e", "6f6f6f", "4d4d4d", "383838"];
function langColor(name, t, tok, i) {
  if (tok.monochrome) return GRAYS[i % GRAYS.length];
  return name === "Other" ? t.muted : (LANG_COLORS[name] || t.accent);
}
function glowAttr(tok) {
  return tok.glow ? ' filter="url(#gg-glow)"' : "";
}
function svg(W, H, inner) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
}
// Resolves the visual style tokens and the effective color palette (theme,
// or the fixed monochrome palette when the style forces it) that every card
// renderer needs.
function styleAndTheme(opts) {
  const tok = styleTokens(opts.style);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
  return { tok, t };
}
function topLangs(langs, count, hideOther) {
  const real = Object.entries(langs).filter(([k]) => k !== "Other");
  const total = real.reduce((s, [, v]) => s + v, 0) || 1;
  real.sort((a, b) => b[1] - a[1]);
  const top = real.slice(0, count);
  const shown = top.reduce((s, [, v]) => s + v, 0);
  const rows = top.map(([k, v]) => ({ name: k, pct: (100 * v) / total }));
  if (!hideOther && shown < total) rows.push({ name: "Other", pct: (100 * (total - shown)) / total });
  return rows;
}

module.exports = { esc, n, MONO_PALETTE, GRAYS, langColor, glowAttr, svg, styleAndTheme, topLangs };
