// Fetches public GitHub stats for a user using the REST API.
// Works with or without a token; set GITHUB_TOKEN for a 5000/hour rate limit.
const https = require("https");

function get(path) {
  const options = {
    hostname: "api.github.com",
    path,
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "gitglance",
    },
  };
  if (process.env.GITHUB_TOKEN) {
    options.headers["Authorization"] = "Bearer " + process.env.GITHUB_TOKEN;
  }
  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
        } else {
          reject(new Error("GitHub API " + res.statusCode + " for " + path));
        }
      });
    }).on("error", reject);
  });
}

async function fetchStats(username) {
  const user = await get("/users/" + encodeURIComponent(username));
  const repos = [];
  let page = 1;
  while (page <= 5) {
    const batch = await get("/users/" + encodeURIComponent(username) + "/repos?per_page=100&type=owner&page=" + page);
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const forks = own.reduce((s, r) => s + (r.forks_count || 0), 0);
  const langs = {};
  for (const r of own) {
    const l = r.language || "Other";
    langs[l] = (langs[l] || 0) + 1;
  }
  return {
    login: user.login,
    name: user.name || user.login,
    avatar: user.avatar_url,
    followers: user.followers || 0,
    following: user.following || 0,
    public_repos: user.public_repos || 0,
    public_gists: user.public_gists || 0,
    stars,
    forks,
    langs,
  };
}

module.exports = { fetchStats };
