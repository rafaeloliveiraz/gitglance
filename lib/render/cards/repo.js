const { svg, n, esc, styleAndTheme } = require("../helpers");
const { LANG_COLORS } = require("../../themes");
const { background } = require("../../styles");
const { animStyle } = require("../title");

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
  const { tok, t } = styleAndTheme(opts);
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

module.exports = { renderRepo };
