const { theme, LANG_COLORS } = require("./themes");

const SANS = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";
const MONO = "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace";

function esc(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", '"': "&quot;" }[c]));
}
function n(v) {
  if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
  return String(v);
}

// Per-style visual tokens.
function styleTokens(style, t) {
  switch (style) {
    case "vercel":
      return { radius: 8, font: SANS, mono: MONO, labelUpper: true, labelSpacing: 1.5, dots: false, divider: true, watermark: "triangle", panelSame: true };
    case "terminal":
      return { radius: 10, font: MONO, mono: MONO, labelUpper: false, labelSpacing: 0, dots: true, divider: false, watermark: null, panelSame: true };
    case "glass":
      return { radius: 18, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, glass: true };
    case "minimal":
      return { radius: 12, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, noBorder: true, transparent: true };
    default:
      return { radius: 16, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, titleBar: true };
  }
}

function background(W, H, t, tok, opts) {
  const radius = opts.border_radius != null ? opts.border_radius : tok.radius;
  const border = (opts.hide_border || tok.noBorder) ? "" :
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius}" fill="none" stroke="#${opts.border_color || t.border}" stroke-width="1"/>`;
  if (tok.transparent) return border;
  if (tok.glass) {
    return `
      <defs>
        <linearGradient id="gg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#${t.panel}"/>
          <stop offset="100%" stop-color="#${t.bg}"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-bg)"/>
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius}" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/>`;
  }
  return `<rect width="${W}" height="${H}" rx="${radius}" fill="#${opts.bg_color || t.bg}"/>` + border;
}

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
  const bar = tok.titleBar ? `<rect x="${x}" y="${y + 10}" width="46" height="3" rx="1.5" fill="#${color}"/>` : "";
  return `<text x="${x}" y="${y}" fill="#${color}" font-family="${tok.font}" font-size="22" font-weight="700">${esc(title)}</text>${bar}`;
}

function animStyle() {
  // Resting state is fully visible. Animations are enhancement only, so the
  // card never renders blank if CSS animations do not run (e.g. some <img> contexts).
  return `<style>
    .bar-fill { transform-origin: left center; animation: gg-grow 0.9s ease-out; }
    @keyframes gg-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  </style>`;
}

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

function svg(W, H, inner) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
}

function renderStats(data, opts) {
  const t = theme(opts.theme);
  const tok = styleTokens(opts.style, t);
  const W = opts.card_width || 460, H = 210, x = 34;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, x, 52, W) +
    statRows(data, t, tok, opts, x, 104);
  return svg(W, H, inner);
}

function renderLangs(data, opts) {
  const t = theme(opts.theme);
  const tok = styleTokens(opts.style, t);
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

function langRowsMarkup(data, t, tok, opts, x, startY, barW) {
  const rows = topLangs(data.langs, opts.langs_count || 5, opts.hide_other);
  const rowH = 46;
  return rows.map((r, i) => {
    const y = startY + i * rowH;
    const color = r.name === "Other" ? t.muted : (LANG_COLORS[r.name] || t.accent);
    const fillW = Math.max(6, Math.round((barW * r.pct) / 100));
    return `<g class="row" style="animation-delay:${0.2 + i * 0.1}s">
      <text x="${x}" y="${y}" fill="#${opts.text_color || t.text}" font-family="${tok.font}" font-size="15">${esc(r.name)}</text>
      <text x="${x + barW}" y="${y}" text-anchor="end" fill="#${t.muted}" font-family="${tok.mono}" font-size="13">${r.pct.toFixed(1)}%</text>
      <rect x="${x}" y="${y + 10}" width="${barW}" height="9" rx="4.5" fill="#${t.border}"/>
      <rect class="bar-fill" x="${x}" y="${y + 10}" width="${fillW}" height="9" rx="4.5" fill="#${color}"/>
    </g>`;
  }).join("");
}

function renderCombined(data, opts) {
  const t = theme(opts.theme);
  const tok = styleTokens(opts.style, t);
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

function render(type, data, opts) {
  if (type === "langs" || type === "top-langs") return renderLangs(data, opts);
  if (type === "combined" || type === "full") return renderCombined(data, opts);
  return renderStats(data, opts);
}

function errorCard(message, opts) {
  const t = theme(opts && opts.theme);
  const W = 460, H = 120;
  return svg(W, H,
    `<rect width="${W}" height="${H}" rx="14" fill="#${t.bg}"/><rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="#${t.border}"/>` +
    `<text x="30" y="50" fill="#${t.title}" font-family="${SANS}" font-size="18" font-weight="700">gitglance</text>` +
    `<text x="30" y="80" fill="#${t.muted}" font-family="${SANS}" font-size="14">${esc(message)}</text>`);
}

module.exports = { render, errorCard };
