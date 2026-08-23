const express = require("express");
const { fetchStats } = require("./lib/github");
const { render, errorCard } = require("./lib/render");
const { THEMES } = require("./lib/themes");

const app = express();

const REPO = "https://github.com/rafaeloliveiraz/gitglance";

function bool(v, def) {
  if (v === undefined) return def;
  return v === "true" || v === "1" || v === "";
}
function num(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function parseOpts(q) {
  return {
    theme: THEMES[q.theme] ? q.theme : "dark",
    style: q.style || "default",
    langs_count: Math.min(10, Math.max(1, num(q.langs_count) || 5)),
    card_width: num(q.width),
    border_radius: num(q.border_radius),
    hide_border: bool(q.hide_border, false),
    hide_title: bool(q.hide_title, false),
    title_color: q.title_color,
    text_color: q.text_color,
    bg_color: q.bg_color,
    border_color: q.border_color,
    custom_title: q.title,
  };
}

function sendSvg(res, svg, maxAge) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  res.send(svg);
}

async function handle(type, req, res) {
  const opts = parseOpts(req.query);
  const username = req.query.username || req.query.user;
  if (!username) {
    return sendSvg(res, errorCard("Missing ?username= parameter", opts), 300);
  }
  try {
    const data = await fetchStats(username);
    sendSvg(res, render(type, data, opts), 21600); // 6h cache
  } catch (e) {
    sendSvg(res, errorCard("Could not load stats for " + username, opts), 600);
  }
}

app.get("/preview", (req, res) => {
  const u = req.query.username || "rafaeloliveiraz";
  const styles = ["default", "vercel", "terminal", "glass", "minimal", "neon", "gradient", "outline"];
  const themes = ["dark", "vercel", "tokyonight", "dracula", "catppuccin", "nord", "gruvbox", "rosepine", "cyberpunk", "ocean", "sunset", "forest", "coffee", "midnight", "lavender", "crimson"];
  let html = `<html><head><meta charset="utf-8"><title>gitglance preview</title>
    <style>body{background:#0b0b0d;color:#eee;font-family:system-ui;margin:0;padding:32px}
    h2{margin:36px 0 12px;font-weight:600}h3{color:#888;font-weight:500;margin:20px 0 8px;font-size:14px}
    .row{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}img{display:block}</style></head><body>
    <h1>gitglance preview</h1>`;
  html += `<h2>Styles (combined card)</h2>`;
  for (const s of styles) {
    html += `<h3>style=${s}</h3><div class="row"><img src="/api/combined?username=${u}&style=${s}&theme=${s === "vercel" ? "vercel" : "dark"}"></div>`;
  }
  html += `<h2>Themes (stats card, default style)</h2><div class="row">`;
  for (const th of themes) html += `<img src="/api/stats?username=${u}&theme=${th}">`;
  html += `</div><h2>Language card</h2><div class="row">
    <img src="/api/langs?username=${u}&theme=tokyonight">
    <img src="/api/langs?username=${u}&style=vercel&theme=vercel"></div>`;
  html += `<h2>Chart cards</h2><div class="row">
    <img src="/api/donut?username=${u}&theme=cyberpunk">
    <img src="/api/rings?username=${u}&theme=midnight">
    <img src="/api/bars?username=${u}&theme=sunset">
    <img src="/api/donut?username=${u}&style=neon&theme=cyberpunk">
    <img src="/api/rings?username=${u}&style=vercel&theme=vercel">
    <img src="/api/bars?username=${u}&style=neon&theme=crimson"></div>`;
  html += `</body></html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.get("/", (_req, res) => res.redirect(REPO));
app.get("/api", (req, res) => handle(req.query.type || "stats", req, res));
app.get("/api/stats", (req, res) => handle("stats", req, res));
app.get("/api/langs", (req, res) => handle("langs", req, res));
app.get("/api/top-langs", (req, res) => handle("langs", req, res));
app.get("/api/combined", (req, res) => handle("combined", req, res));
app.get("/api/donut", (req, res) => handle("donut", req, res));
app.get("/api/rings", (req, res) => handle("rings", req, res));
app.get("/api/bars", (req, res) => handle("bars", req, res));

// Local dev server; on Vercel the app is exported and used as a handler.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("gitglance running on http://localhost:" + port));
}

module.exports = app;
