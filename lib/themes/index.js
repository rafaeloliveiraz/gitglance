// Color themes: each file in this directory is one theme's palette (colors
// as hex without the leading '#'), optionally with capability flags for
// behavior beyond a plain palette swap. See docs/THEMES.md for the full
// guide, including the flags a theme can opt into and the fonts/<theme>/
// convention for themes that ship their own assets (see ./kangel/).
//
// To add a theme: create ./your-theme.js (a flat file exporting the palette
// object) or ./your-theme/index.js (a folder, if it needs its own assets
// like fonts), then register it below. Requires are listed explicitly
// rather than discovered by scanning the directory so that Vercel's
// dependency tracing can see exactly which files a deploy needs.
const THEMES = {
  kangel: require("./kangel"),
  dark: require("./dark"),
  light: require("./light"),
  vercel: require("./vercel"),
  tokyonight: require("./tokyonight"),
  dracula: require("./dracula"),
  nord: require("./nord"),
  gruvbox: require("./gruvbox"),
  catppuccin: require("./catppuccin"),
  synthwave: require("./synthwave"),
  rosepine: require("./rosepine"),
  onedark: require("./onedark"),
  monochrome: require("./monochrome"),
  cyberpunk: require("./cyberpunk"),
  ocean: require("./ocean"),
  sunset: require("./sunset"),
  forest: require("./forest"),
  coffee: require("./coffee"),
  midnight: require("./midnight"),
  lavender: require("./lavender"),
  crimson: require("./crimson"),
};

// GitHub-ish language colors (subset). Missing languages fall back to accent.
const LANG_COLORS = {
  TypeScript: "3178c6", JavaScript: "f1e05a", PHP: "4F5D95", HTML: "e34c26",
  CSS: "563d7c", Python: "3572A5", Shell: "89e051", MDX: "fcb32c",
  Go: "00ADD8", Java: "b07219", "C#": "178600", "C++": "f34b7d", C: "555555",
  Ruby: "701516", Rust: "dea584", Kotlin: "A97BFF", Swift: "F05138",
  Vue: "41b883", Svelte: "ff3e00", Dart: "00B4AB", Jupyter: "DA5B0B",
  SCSS: "c6538c", Dockerfile: "384d54", Makefile: "427819", Lua: "000080",
};

function theme(name) {
  return THEMES[name] || THEMES.dark;
}

module.exports = { THEMES, LANG_COLORS, theme };
