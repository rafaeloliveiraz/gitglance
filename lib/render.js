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
const MONO_PALETTE = { bg: "000000", panel: "0a0a0a", title: "ffffff", text: "ffffff", muted: "8a8a8a", accent: "ffffff", border: "333333" };
const GRAYS = ["ffffff", "cfcfcf", "9e9e9e", "6f6f6f", "4d4d4d", "383838"];
function langColor(name, t, tok, i) {
  if (tok.monochrome) return GRAYS[i % GRAYS.length];
  return name === "Other" ? t.muted : (LANG_COLORS[name] || t.accent);
}
function glowAttr(tok) {
  return tok.glow ? ' filter="url(#gg-glow)"' : "";
}
function isLight(hex) {
  const h = String(hex).replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16), g = parseInt(v.slice(2, 4), 16), b = parseInt(v.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
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
    case "neon":
      return { radius: 14, font: SANS, mono: MONO, labelUpper: true, labelSpacing: 1.2, dots: false, divider: false, watermark: null, titleBar: false, glow: true };
    case "gradient":
      return { radius: 18, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "gradient" };
    case "aurora":
      return { radius: 20, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "aurora" };
    case "mesh":
      return { radius: 20, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "mesh" };
    case "waves":
      return { radius: 18, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "waves" };
    case "dots":
      return { radius: 16, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "dots" };
    case "vercel-lines":
      return { radius: 8, font: SANS, mono: MONO, labelUpper: true, labelSpacing: 1.5, dots: false, divider: true, watermark: "triangle", bgKind: "vlines" };
    case "mono":
      return { radius: 8, font: SANS, mono: MONO, labelUpper: true, labelSpacing: 1.5, dots: false, divider: true, watermark: "triangle", monochrome: true };
    case "grid":
      return { radius: 16, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "grid" };
    case "orbs":
      return { radius: 18, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, bgKind: "orbs" };
    case "outline":
      return { radius: 12, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, transparent: true, thickBorder: true };
    default:
      return { radius: 16, font: SANS, mono: SANS, labelUpper: false, labelSpacing: 0.3, dots: false, divider: false, watermark: null, titleBar: true };
  }
}

function background(W, H, t, tok, opts) {
  const radius = opts.border_radius != null ? opts.border_radius : tok.radius;
  const glow = tok.glow
    ? `<defs><filter id="gg-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`
    : "";
  if (tok.transparent) {
    const sw = tok.thickBorder ? 2.5 : 1;
    const col = tok.thickBorder ? (opts.border_color || t.accent) : (opts.border_color || t.border);
    const border = (opts.hide_border) ? "" :
      `<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="${radius}" fill="none" stroke="#${col}" stroke-width="${sw}"/>`;
    return glow + border;
  }
  const border = (opts.hide_border || tok.noBorder) ? "" :
    `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius}" fill="none" stroke="#${opts.border_color || t.border}" stroke-width="1"/>`;
  const clip = `<clipPath id="gg-clip"><rect width="${W}" height="${H}" rx="${radius}"/></clipPath>`;

  if (tok.bgKind === "gradient") {
    // Rich diagonal gradient. Light themes get gentler overlays and no white
    // highlight (which reads as a milky wash on light backgrounds).
    const light = isLight(t.bg);
    const aOp = light ? 0.14 : 0.30, bOp = light ? 0.12 : 0.28;
    const hl = light ? "" : `<radialGradient id="gg-hl" cx="0.15" cy="0.0" r="0.9">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>`;
    const hlRect = light ? "" : `<rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-hl)"/>`;
    return glow + `<defs>${clip}
      <linearGradient id="gg-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${t.accent}" stop-opacity="${aOp}"/>
        <stop offset="35%" stop-color="#${t.bg}"/>
        <stop offset="70%" stop-color="#${t.bg}"/>
        <stop offset="100%" stop-color="#${t.title}" stop-opacity="${bOp}"/>
      </linearGradient>${hl}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-g1)"/>${hlRect}` + border;
  }
  if (tok.bgKind === "aurora") {
    // Soft drifting light blobs, clipped to the card. Animation is enhancement only.
    return glow + `<defs>${clip}
      <radialGradient id="gg-a1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.45"/><stop offset="100%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-a2"><stop offset="0%" stop-color="#${t.title}" stop-opacity="0.38"/><stop offset="100%" stop-color="#${t.title}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-a3"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
      <style>
        .gg-blob1 { animation: gg-drift1 6s ease-in-out infinite alternate; }
        .gg-blob2 { animation: gg-drift2 8s ease-in-out infinite alternate; }
        @keyframes gg-drift1 { from { transform: translate(0,0); } to { transform: translate(${Math.round(W * 0.16)}px, 22px); } }
        @keyframes gg-drift2 { from { transform: translate(0,0); } to { transform: translate(-${Math.round(W * 0.14)}px, -18px); } }
      </style></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        <ellipse class="gg-blob1" cx="${W * 0.22}" cy="${H * 0.15}" rx="${W * 0.45}" ry="${H * 0.75}" fill="url(#gg-a1)"/>
        <ellipse class="gg-blob2" cx="${W * 0.85}" cy="${H * 0.9}" rx="${W * 0.5}" ry="${H * 0.8}" fill="url(#gg-a2)"/>
        <ellipse cx="${W * 0.6}" cy="${H * 0.1}" rx="${W * 0.3}" ry="${H * 0.5}" fill="url(#gg-a3)"/>
      </g>` + border;
  }
  if (tok.bgKind === "mesh") {
    // Mesh-gradient look: colored radial fields anchored at the corners.
    return glow + `<defs>${clip}
      <radialGradient id="gg-m1" cx="0" cy="0" r="1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.50"/><stop offset="60%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m2" cx="1" cy="0" r="1"><stop offset="0%" stop-color="#${t.title}" stop-opacity="0.40"/><stop offset="60%" stop-color="#${t.title}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m3" cx="0" cy="1" r="1"><stop offset="0%" stop-color="#${t.muted}" stop-opacity="0.35"/><stop offset="60%" stop-color="#${t.muted}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gg-m4" cx="1" cy="1" r="1"><stop offset="0%" stop-color="#${t.accent}" stop-opacity="0.30"/><stop offset="60%" stop-color="#${t.accent}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        <rect width="${W}" height="${H}" fill="url(#gg-m1)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m2)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m3)"/>
        <rect width="${W}" height="${H}" fill="url(#gg-m4)"/>
      </g>` + border;
  }
  if (tok.bgKind === "waves") {
    // Layered smooth waves along the bottom edge.
    const y1 = H * 0.72, y2 = H * 0.82, y3 = H * 0.9;
    const wave = (y, amp, color, op) =>
      `<path d="M 0 ${y} C ${W * 0.25} ${y - amp}, ${W * 0.4} ${y + amp}, ${W * 0.62} ${y} S ${W * 0.9} ${y - amp}, ${W} ${y + amp * 0.4} L ${W} ${H} L 0 ${H} Z" fill="#${color}" fill-opacity="${op}"/>`;
    return glow + `<defs>${clip}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">
        ${wave(y1, 26, t.accent, 0.16)}
        ${wave(y2, 20, t.title, 0.16)}
        ${wave(y3, 14, t.accent, 0.24)}
      </g>` + border;
  }
  if (tok.bgKind === "dots") {
    // Subtle dot grid over a gentle vertical gradient.
    return glow + `<defs>${clip}
      <pattern id="gg-dots" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.4" fill="#${t.text}" fill-opacity="0.10"/>
      </pattern>
      <linearGradient id="gg-dg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#${t.panel}"/>
        <stop offset="100%" stop-color="#${t.bg}"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="url(#gg-dg)"/>
      <g clip-path="url(#gg-clip)"><rect width="${W}" height="${H}" fill="url(#gg-dots)"/></g>` + border;
  }
  if (tok.bgKind === "vlines") {
    // Vercel-like fine horizontal lines plus a slow light sweep.
    let lines = "";
    for (let ly = 26; ly < H; ly += 26) {
      lines += `<line x1="0" y1="${ly}" x2="${W}" y2="${ly}" stroke="#${t.text}" stroke-opacity="0.12" stroke-width="1"/>`;
    }
    for (let lx = 40; lx < W; lx += 80) {
      lines += `<line x1="${lx}" y1="0" x2="${lx}" y2="${H}" stroke="#${t.text}" stroke-opacity="0.06" stroke-width="1"/>`;
    }
    return glow + `<defs>${clip}
      <linearGradient id="gg-sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <style>
        .gg-sw { animation: gg-sweepmove 5s linear infinite; }
        @keyframes gg-sweepmove { from { transform: translateX(-140px); } to { transform: translateX(${W + 140}px); } }
      </style></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">${lines}
        <rect class="gg-sw" x="0" y="0" width="140" height="${H}" fill="url(#gg-sweep)"/>
      </g>` + border;
  }
  if (tok.bgKind === "grid") {
    // Static grid pattern with a soft vertical fade for depth.
    return glow + `<defs>${clip}
      <pattern id="gg-gridp" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M26 0H0V26" fill="none" stroke="#${t.text}" stroke-opacity="0.13" stroke-width="1"/>
      </pattern>
      <linearGradient id="gg-gridfade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
      </linearGradient>
      <mask id="gg-gridmask"><rect width="${W}" height="${H}" fill="url(#gg-gridfade)"/></mask></defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)"><rect width="${W}" height="${H}" fill="url(#gg-gridp)" mask="url(#gg-gridmask)"/></g>` + border;
  }
  if (tok.bgKind === "orbs") {
    // Floating circles that drift and breathe at staggered rhythms.
    const orbs = [
      [0.12, 0.8, 34, t.accent, 3.4, 0], [0.3, 0.2, 20, t.title, 4.2, 0.6],
      [0.52, 0.85, 26, t.accent, 5.0, 1.2], [0.68, 0.15, 16, t.title, 3.8, 0.3],
      [0.84, 0.7, 40, t.accent, 4.6, 0.9], [0.94, 0.25, 14, t.title, 3.2, 1.5],
      [0.42, 0.5, 10, t.accent, 4.0, 0.2],
    ];
    let anim = "<style>";
    let shapes = "";
    orbs.forEach((o, i) => {
      anim += `.gg-o${i} { animation: gg-orb${i} ${o[4]}s ease-in-out ${o[5]}s infinite alternate; }
        @keyframes gg-orb${i} { from { opacity: 0.08; transform: translateY(0); } to { opacity: 0.4; transform: translateY(${i % 2 ? -14 : 14}px); } }`;
      shapes += `<circle class="gg-o${i}" cx="${(W * o[0]).toFixed(0)}" cy="${(H * o[1]).toFixed(0)}" r="${o[2]}" fill="#${o[3]}" opacity="0.2"/>`;
    });
    anim += "</style>";
    return glow + `<defs>${clip}${anim}</defs>
      <rect width="${W}" height="${H}" rx="${radius}" fill="#${t.bg}"/>
      <g clip-path="url(#gg-clip)">${shapes}</g>` + border;
  }
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
  return glow + `<rect width="${W}" height="${H}" rx="${radius}" fill="#${opts.bg_color || t.bg}"/>` + border;
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
  // Resting state is fully visible. All keyframes only define "from", so if
  // animations do not run the card still renders complete. Never blank.
  return `<style>
    .bar-fill { transform-box: fill-box; transform-origin: left center; animation: gg-grow 0.9s ease-out backwards; }
    .vbar { transform-box: fill-box; transform-origin: center bottom; animation: gg-rise 0.9s ease-out backwards; }
    .gg-seg { animation: gg-fade 0.8s ease-out backwards; }
    .gg-ring { animation: gg-fade 1s ease-out backwards; }
    @keyframes gg-grow { from { transform: scaleX(0); } }
    @keyframes gg-rise { from { transform: scaleY(0); } }
    @keyframes gg-fade { from { opacity: 0.15; } }
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
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
  const W = opts.card_width || 460, H = 252, x = 34;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, x, 52, W) +
    statRows(data, t, tok, opts, x, 104);
  return svg(W, H, inner);
}

function renderLangs(data, opts) {
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
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

function renderCombined(data, opts) {
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
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

// ----- Donut chart of languages -----
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
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
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

// ----- Circular gauges for the four stats -----
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
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
  const W = opts.card_width || 520, H = 230;
  const title = opts.custom_title || `${data.name}'s GitHub Stats`;
  const ringCols = tok.monochrome
    ? [GRAYS[0], GRAYS[1], GRAYS[2], GRAYS[3]]
    : [t.accent, LANG_COLORS.TypeScript, LANG_COLORS.JavaScript, LANG_COLORS.Vue || "41b883"];
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
    rings += ringGauge(cx, 130, 36, v / maxV, col, t.border, n(v), label(lb), t, tok, opts);
  });
  const inner = animStyle() + background(W, H, t, tok, opts) +
    titleBlock(title, t, { ...tok, login: data.login }, { ...opts, login: data.login }, 30, 48, W) + rings;
  return svg(W, H, inner);
}

// ----- Vertical bar chart of languages -----
function renderBars(data, opts) {
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
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

// ----- Repository pin card -----
function wrapText(s, max) {
  const words = String(s).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
      if (lines.length === 2) break;
    } else {
      cur += " " + w;
    }
  }
  if (lines.length < 2 && cur.trim()) lines.push(cur.trim());
  if (lines.length === 2 && (cur.trim() !== lines[1])) lines[1] = lines[1].replace(/\s*$/, "") + "…";
  return lines.slice(0, 2);
}

function renderRepo(repo, opts) {
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
  const W = opts.card_width || 400, H = 150, x = 30;
  const langColor = repo.language ? (LANG_COLORS[repo.language] || t.accent) : t.muted;
  const desc = wrapText(repo.description || "No description provided.", 52);
  const book = `<path transform="translate(${x},34)" fill="#${t.muted}" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>`;
  const star = (sx) => `<path transform="translate(${sx},${H - 44})" fill="#${t.muted}" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill-rule="evenodd" transform-origin="0 0" style="transform: translate(${sx}px, ${H - 44}px) scale(0.9);"/>`;
  const fork = (fx) => `<path fill="#${t.muted}" style="transform: translate(${fx}px, ${H - 44}px) scale(0.9);" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>`;
  let footer = "";
  let fx = x;
  if (repo.language) {
    footer += `<circle cx="${fx + 5}" cy="${H - 37}" r="5" fill="#${langColor}"/>
      <text x="${fx + 17}" y="${H - 32}" fill="#${opts.text_color || t.text}" font-family="${tok.font}" font-size="13">${esc(repo.language)}</text>`;
    fx += 17 + repo.language.length * 7 + 26;
  }
  footer += star(fx) + `<text x="${fx + 20}" y="${H - 32}" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="13">${n(repo.stars)}</text>`;
  fx += 20 + String(n(repo.stars)).length * 8 + 30;
  footer += fork(fx) + `<text x="${fx + 20}" y="${H - 32}" fill="#${opts.text_color || t.text}" font-family="${tok.mono}" font-size="13">${n(repo.forks)}</text>`;
  const badge = repo.archived
    ? `<rect x="${W - 108}" y="30" width="78" height="22" rx="11" fill="none" stroke="#${t.muted}"/><text x="${W - 69}" y="45" text-anchor="middle" fill="#${t.muted}" font-family="${tok.font}" font-size="11">Archived</text>`
    : "";
  const inner = animStyle() + background(W, H, t, tok, opts) + book + badge +
    `<text x="${x + 26}" y="48" fill="#${opts.title_color || t.title}" font-family="${tok.font}" font-size="17" font-weight="700">${esc(repo.name)}</text>` +
    desc.map((l, i) => `<text x="${x}" y="${76 + i * 20}" fill="#${t.muted}" font-family="${tok.font}" font-size="13.5">${esc(l)}</text>`).join("") +
    footer;
  return svg(W, H, inner);
}

// ----- Commit activity area chart -----
function renderActivity(user, series, opts) {
  const tok = styleTokens(opts.style, null);
  const t = tok.monochrome ? MONO_PALETTE : theme(opts.theme);
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

function render(type, data, opts) {
  if (type === "langs" || type === "top-langs") return renderLangs(data, opts);
  if (type === "combined" || type === "full") return renderCombined(data, opts);
  if (type === "donut") return renderDonut(data, opts);
  if (type === "rings") return renderRings(data, opts);
  if (type === "bars") return renderBars(data, opts);
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

module.exports = { render, errorCard, renderRepo, renderActivity };
