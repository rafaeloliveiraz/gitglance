// Public rendering API. Each card type lives in its own file under
// ./cards/; this module just dispatches by `type` and wraps every SVG
// through the pixel-font post-processor (a no-op unless the theme opts in,
// see lib/themes/kangel and lib/pixel-text.js).
//
// To add a new card type: create ./cards/your-type.js exporting a
// render function with the same (data, opts) => svgString shape as the
// others, then add a branch below.
const { renderStats } = require("./cards/stats");
const { renderLangs } = require("./cards/langs");
const { renderCombined } = require("./cards/combined");
const { renderDonut } = require("./cards/donut");
const { renderRings } = require("./cards/rings");
const { renderBars } = require("./cards/bars");
const { renderRepo } = require("./cards/repo");
const { renderActivity } = require("./cards/activity");
const { errorCard } = require("./cards/error");
const { pixelText } = require("../pixel-text");

function render(type, data, opts) {
  if (type === "langs" || type === "top-langs") return renderLangs(data, opts);
  if (type === "combined" || type === "full") return renderCombined(data, opts);
  if (type === "donut") return renderDonut(data, opts);
  if (type === "rings") return renderRings(data, opts);
  if (type === "bars") return renderBars(data, opts);
  return renderStats(data, opts);
}

module.exports = {
  render: (type, data, opts) => pixelText(render(type, data, opts), opts),
  errorCard: (message, opts) => pixelText(errorCard(message, opts), opts),
  renderRepo: (data, opts) => pixelText(renderRepo(data, opts), opts),
  renderActivity: (user, series, opts) => pixelText(renderActivity(user, series, opts), opts),
};
