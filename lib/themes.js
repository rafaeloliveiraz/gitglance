// Color themes. Each theme defines the palette used by every style.
// Colors are hex without the leading '#'.
const THEMES = {
  dark:        { bg: "0d1117", panel: "161b22", title: "58a6ff", text: "c9d1d9", muted: "8b949e", accent: "58a6ff", border: "30363d" },
  light:       { bg: "ffffff", panel: "f6f8fa", title: "0969da", text: "1f2328", muted: "656d76", accent: "0969da", border: "d0d7de" },
  vercel:      { bg: "000000", panel: "0a0a0a", title: "ffffff", text: "ededed", muted: "888888", accent: "ffffff", border: "333333" },
  tokyonight:  { bg: "1a1b27", panel: "1f2335", title: "70a5fd", text: "a9b1d6", muted: "7a88cf", accent: "bb9af7", border: "2a2f45" },
  dracula:     { bg: "282a36", panel: "343746", title: "ff79c6", text: "f8f8f2", muted: "6272a4", accent: "bd93f9", border: "44475a" },
  nord:        { bg: "2e3440", panel: "3b4252", title: "88c0d0", text: "e5e9f0", muted: "7b88a1", accent: "81a1c1", border: "434c5e" },
  gruvbox:     { bg: "282828", panel: "32302f", title: "fabd2f", text: "ebdbb2", muted: "a89984", accent: "fe8019", border: "3c3836" },
  catppuccin:  { bg: "1e1e2e", panel: "313244", title: "cba6f7", text: "cdd6f4", muted: "9399b2", accent: "89b4fa", border: "45475a" },
  synthwave:   { bg: "2b213a", panel: "3a2d51", title: "e2e9ec", text: "f6f6f6", muted: "b893ce", accent: "ff7edb", border: "50396b" },
  rosepine:    { bg: "191724", panel: "1f1d2e", title: "ebbcba", text: "e0def4", muted: "908caa", accent: "c4a7e7", border: "26233a" },
  onedark:     { bg: "282c34", panel: "31353f", title: "61afef", text: "abb2bf", muted: "828997", accent: "c678dd", border: "3b4048" },
  monochrome:  { bg: "111111", panel: "1a1a1a", title: "ffffff", text: "e0e0e0", muted: "777777", accent: "cccccc", border: "2a2a2a" },
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
