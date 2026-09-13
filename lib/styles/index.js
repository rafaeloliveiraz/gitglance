// Visual styles: each file in this directory is a set of tokens that every
// card renderer reads to decide layout/typography details (radius, fonts,
// label casing, title treatment, background pattern, ...). Colors come from
// themes (lib/themes/), independently of style.
//
// To add a new style: create ./your-style.js exporting a token object (copy
// an existing file as a starting point), then add it to STYLES below. If it
// needs a custom background pattern, add one under ./backgrounds/ and set
// bgKind to its name.
const STYLES = {
  default: require("./default"),
  vercel: require("./vercel"),
  "vercel-lines": require("./vercel-lines"),
  mono: require("./mono"),
  terminal: require("./terminal"),
  glass: require("./glass"),
  minimal: require("./minimal"),
  neon: require("./neon"),
  gradient: require("./gradient"),
  aurora: require("./aurora"),
  mesh: require("./mesh"),
  waves: require("./waves"),
  dots: require("./dots"),
  grid: require("./grid"),
  orbs: require("./orbs"),
  outline: require("./outline"),
};

function styleTokens(style) {
  return STYLES[style] || STYLES.default;
}

const background = require("./backgrounds");

module.exports = { STYLES, styleTokens, background };
