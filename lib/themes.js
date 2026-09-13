// Color themes. Each theme defines the palette used by every style.
// Colors are hex without the leading '#'.
const THEMES = {
  kangel: { bg: "f0d1f1", panel: "fff8ff", title: "4e23cf", text: "4e23cf", muted: "4e23cf", accent: "91f3e4", border: "4e23cf" },
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
  cyberpunk:   { bg: "0a0e27", panel: "141a3d", title: "00f0ff", text: "d1f7ff", muted: "5c7cfa", accent: "ff2ec4", border: "1e2a6e" },
  ocean:       { bg: "0b2239", panel: "12324f", title: "4cc9f0", text: "d8ecf8", muted: "7fa8c9", accent: "00b4d8", border: "1d4468" },
  sunset:      { bg: "2d1b2e", panel: "3d2440", title: "ff9e64", text: "ffe8d6", muted: "c98a94", accent: "f25c54", border: "4d2e52" },
  forest:      { bg: "1a2f1a", panel: "24402a", title: "95d5b2", text: "e8f5e9", muted: "74a883", accent: "52b788", border: "2f5238" },
  coffee:      { bg: "2b211b", panel: "3a2d24", title: "d4a373", text: "f1e3d3", muted: "a98467", accent: "bc8a5f", border: "4a392e" },
  midnight:    { bg: "020617", panel: "0f172a", title: "818cf8", text: "e2e8f0", muted: "64748b", accent: "6366f1", border: "1e293b" },
  lavender:    { bg: "f3f0ff", panel: "e9e2ff", title: "6d28d9", text: "3b3054", muted: "8b7fae", accent: "8b5cf6", border: "d4c8f0" },
  crimson:     { bg: "1a0a0f", panel: "2a1218", title: "ff4d6d", text: "ffe3e8", muted: "a15264", accent: "c9184a", border: "3d1a24" },
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
