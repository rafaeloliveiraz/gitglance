const express = require("express");
const { fetchStats, fetchRepo, fetchActivity } = require("./lib/github");
const { render, errorCard, renderRepo, renderActivity } = require("./lib/render");
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
  const styles = ["default", "vercel", "vercel-lines", "mono", "terminal", "glass", "minimal", "neon", "gradient", "aurora", "mesh", "waves", "dots", "grid", "orbs", "outline"];
  const themes = Object.keys(THEMES);
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

app.get("/", (_req, res) => {
  const styles = ["default", "vercel", "vercel-lines", "mono", "terminal", "glass", "minimal", "neon", "gradient", "aurora", "mesh", "waves", "dots", "grid", "orbs", "outline"];
  const themes = Object.keys(THEMES);
  const types = [
    ["combined", "Combined (stats + languages)"],
    ["stats", "Stats"],
    ["langs", "Top languages"],
    ["donut", "Donut chart"],
    ["rings", "Circular gauges"],
    ["bars", "Bar chart"],
    ["repo", "Repository pin"],
    ["activity", "Commit activity"],
  ];
  const opt = (arr) => arr.map((v) => Array.isArray(v)
    ? `<option value="${v[0]}">${v[1]}</option>`
    : `<option value="${v}">${v}</option>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>gitglance · card builder</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { background: #000; color: #ededed; font: 15px/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; min-height: 100vh; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-bottom: 1px solid #222; }
  .logo { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 17px; letter-spacing: 0.2px; }
  .tri { width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 15px solid #fff; }
  header a { color: #888; text-decoration: none; font-size: 14px; border: 1px solid #333; padding: 7px 14px; border-radius: 6px; transition: 0.15s; }
  header a:hover { color: #fff; border-color: #666; }
  main { max-width: 1060px; margin: 0 auto; padding: 44px 24px 80px; }
  h1 { font-size: 30px; font-weight: 700; letter-spacing: -0.5px; }
  .sub { color: #888; margin: 8px 0 34px; }
  .panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 30px; }
  label { display: block; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  input, select { width: 100%; background: #0a0a0a; color: #ededed; border: 1px solid #333; border-radius: 6px; padding: 10px 12px; font-size: 14px; outline: none; transition: border-color 0.15s; }
  input:focus, select:focus { border-color: #888; }
  #repoField { display: none; }
  .preview { background: #0a0a0a; border: 1px solid #222; border-radius: 10px; padding: 34px; display: flex; justify-content: center; align-items: center; min-height: 280px; margin-bottom: 26px; overflow-x: auto; }
  .preview img { max-width: 100%; }
  .codeblock { position: relative; margin-bottom: 14px; }
  .codeblock pre { background: #0a0a0a; border: 1px solid #222; border-radius: 8px; padding: 16px 110px 16px 16px; font: 13px/1.5 "SF Mono", "JetBrains Mono", Consolas, monospace; color: #ccc; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  .codeblock .tag { position: absolute; top: -9px; left: 12px; background: #000; color: #666; font-size: 11px; padding: 0 8px; text-transform: uppercase; letter-spacing: 1px; }
  .copy { position: absolute; top: 12px; right: 12px; background: #fff; color: #000; border: 0; border-radius: 6px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.15s; }
  .copy:hover { background: #ccc; }
  footer { text-align: center; color: #555; font-size: 13px; padding: 26px; border-top: 1px solid #181818; }
  footer a { color: #888; }
</style></head><body>
<header>
  <div class="logo"><div class="tri"></div> gitglance</div>
  <div style="display:flex;gap:10px">
    <a href="${REPO}" target="_blank" rel="noopener">GitHub ↗</a>
    <a href="${REPO}" target="_blank" rel="noopener" style="background:#fff;color:#000;font-weight:600;border-color:#fff">★ Star</a>
  </div>
</header>
<main>
  <h1>Build your card</h1>
  <p class="sub">Pick a card, style and theme. Copy the code into your README. Done.</p>
  <div class="panel">
    <div><label for="u">GitHub username</label><input id="u" value="octocat" spellcheck="false"></div>
    <div><label for="ty">Card type</label><select id="ty">${opt(types)}</select></div>
    <div id="repoField"><label for="rp">Repository</label><input id="rp" placeholder="repo-name" spellcheck="false"></div>
    <div><label for="st">Style</label><select id="st">${opt(styles)}</select></div>
    <div><label for="th">Theme</label><select id="th">${opt(themes)}</select></div>
  </div>
  <div class="preview"><img id="img" alt="card preview"></div>
  <div class="codeblock"><span class="tag">Markdown</span><pre id="md"></pre><button class="copy" data-for="md">Copy</button></div>
  <div class="codeblock"><span class="tag">HTML</span><pre id="ht"></pre><button class="copy" data-for="ht">Copy</button></div>
  <div style="margin-top:26px;border:1px solid #222;border-radius:10px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
    <div><strong>Enjoying gitglance?</strong><br><span style="color:#888;font-size:14px">A star on GitHub keeps the project alive and helps others find it.</span></div>
    <a href="${REPO}" target="_blank" rel="noopener" style="background:#fff;color:#000;font-weight:600;padding:10px 20px;border-radius:6px;text-decoration:none">★ Star on GitHub</a>
  </div>
</main>
<footer>Self-host your own instance for guaranteed uptime · <a href="${REPO}" target="_blank" rel="noopener">gitglance on GitHub</a></footer>
<script>
  var $ = function (id) { return document.getElementById(id); };
  var timer = null;
  function cardUrl() {
    var ty = $("ty").value;
    var u = encodeURIComponent($("u").value.trim() || "octocat");
    var q = "username=" + u + "&style=" + $("st").value + "&theme=" + $("th").value;
    if (ty === "repo") q += "&repo=" + encodeURIComponent($("rp").value.trim() || "Hello-World");
    return location.origin + "/api/" + ty + "?" + q;
  }
  function update() {
    $("repoField").style.display = $("ty").value === "repo" ? "block" : "none";
    var url = cardUrl();
    $("img").src = url;
    $("md").textContent = "![GitHub stats](" + url + ")";
    $("ht").textContent = '<img src="' + url + '" alt="GitHub stats" />';
  }
  function debounced() { clearTimeout(timer); timer = setTimeout(update, 450); }
  ["u", "rp"].forEach(function (id) { $(id).addEventListener("input", debounced); });
  ["ty", "st", "th"].forEach(function (id) { $(id).addEventListener("change", update); });
  document.querySelectorAll(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      navigator.clipboard.writeText($(b.dataset.for).textContent).then(function () {
        b.textContent = "Copied!";
        setTimeout(function () { b.textContent = "Copy"; }, 1400);
      });
    });
  });
  update();
</script>
</body></html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(html);
});
app.get("/api", (req, res) => handle(req.query.type || "stats", req, res));
app.get("/api/stats", (req, res) => handle("stats", req, res));
app.get("/api/langs", (req, res) => handle("langs", req, res));
app.get("/api/top-langs", (req, res) => handle("langs", req, res));
app.get("/api/combined", (req, res) => handle("combined", req, res));
app.get("/api/donut", (req, res) => handle("donut", req, res));
app.get("/api/rings", (req, res) => handle("rings", req, res));
app.get("/api/bars", (req, res) => handle("bars", req, res));

app.get("/api/repo", async (req, res) => {
  const opts = parseOpts(req.query);
  const username = req.query.username || req.query.user;
  const repoName = req.query.repo;
  if (!username || !repoName) {
    return sendSvg(res, errorCard("Missing ?username= and ?repo= parameters", opts), 300);
  }
  try {
    const repo = await fetchRepo(username, repoName);
    sendSvg(res, renderRepo(repo, opts), 21600);
  } catch (e) {
    sendSvg(res, errorCard("Could not load " + username + "/" + repoName, opts), 600);
  }
});

app.get("/api/activity", async (req, res) => {
  const opts = parseOpts(req.query);
  const username = req.query.username || req.query.user;
  if (!username) {
    return sendSvg(res, errorCard("Missing ?username= parameter", opts), 300);
  }
  try {
    const days = Number(req.query.days) || 28;
    const series = await fetchActivity(username, days);
    sendSvg(res, renderActivity({ login: username, name: username }, series, opts), 7200);
  } catch (e) {
    sendSvg(res, errorCard("Could not load activity for " + username, opts), 600);
  }
});

// Local dev server; on Vercel the app is exported and used as a handler.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("gitglance running on http://localhost:" + port));
}

module.exports = app;
