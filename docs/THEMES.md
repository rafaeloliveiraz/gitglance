# Creating a new theme, style, or card

Everything that makes up a card, its color palette, its visual style, and
each card type, lives in its own small file so that adding one is mostly
copy-paste-and-edit. This guide covers themes in depth, then styles and
cards more briefly, since the same pattern applies to all three.

## 1. Add the palette

Create `lib/themes/<your-theme>.js`, keyed by the name users will pass as
`?theme=`, exporting a single palette object:

```js
// lib/themes/sepia.js
module.exports = { bg: "f4ecd8", panel: "ebe0c4", title: "5b4636", text: "3d2f24", muted: "8a7a63", accent: "b5895a", border: "d8c9a3" };
```

All seven fields are required, as unprefixed hex colors (no leading `#`):

| Field    | Used for |
| -------- | -------- |
| `bg`     | Card background |
| `panel`  | Secondary panel background (bars, table rows, etc.) |
| `title`  | Card title text |
| `text`   | Primary text (labels, values) |
| `muted`  | Secondary text (captions, small labels) |
| `accent` | Default highlight color (bars, primary ring, links) |
| `border` | Card border and dividers |

Then register it in `lib/themes/index.js`: add `<your-theme>: require("./<your-theme>")`
to the `THEMES` object. Requires are listed explicitly there (rather than
the directory being scanned automatically) so that Vercel's dependency
tracing can see exactly which files a deploy needs — a dynamic
`require(variable)` is not statically analyzable and can silently fail to
bundle.

That's it for a normal theme. It immediately works with every card type
(`stats`, `langs`, `combined`, `donut`, `rings`, `bars`, `repo`, `activity`)
and every visual style (`vercel`, `terminal`, `neon`, ...), because styles
and themes are independent: a style defines layout/typography tokens, a
theme defines colors. It also shows up automatically in the home page
builder and the `/preview` gallery, both of which list themes via
`Object.keys(THEMES)` — no separate list to keep in sync.

## 2. Optional capability flags

Sometimes a theme wants to change more than colors. Rather than special-case
a theme name inside the shared rendering code, add an opt-in flag to its
palette object and have the rendering code read that flag generically. The
flags supported today (see `lib/themes/kangel/index.js` for a real example
using all four):

| Flag         | Type       | Effect |
| ------------ | ---------- | ------ |
| `noTitleBar` | `boolean`  | Suppresses the small underline drawn below card titles (`titleBlock` in `lib/render/title.js`). |
| `ringColors` | `string[4]`| Overrides the default per-stat ring colors on the `rings` card (`lib/render/cards/rings.js`). Falls back to the theme's `accent` plus language colors when omitted. |
| `ringTrack`  | `string`   | Overrides the background track color on ring gauges. Falls back to `border` when omitted. |
| `pixelFont`  | `boolean`  | Routes every rendered SVG through `lib/pixel-text.js`, which replaces `<text>` elements with glyph paths from that theme's `pixel-fonts.json`. Only makes sense alongside step 3 below. |

If you need a new kind of override, add a new flag rather than checking
`opts.theme === "your-theme"` in shared rendering code — that keeps card and
style code theme-agnostic and keeps every theme's special behavior visible
in one place (its own file).

## 3. Optional: a theme with its own assets (custom fonts, etc.)

If a theme needs its own files (fonts, generated data), give it a folder
instead of a flat file: `lib/themes/<your-theme>/index.js` exporting the
same palette object as step 1 (Node resolves `require("./your-theme")` to
either `your-theme.js` or `your-theme/index.js` automatically, so nothing
else needs to change), plus whatever else it needs alongside it. Everything
that theme owns lives under its own folder — see `lib/themes/kangel/` for
the complete pattern:

```
lib/themes/kangel/
  index.js               # palette + capability flags
  fonts/                 # the raw, unmodified font files
    DinkieBitmap-7px.ttf
    ...
    README.md            # attribution and license terms for each font
  fonts.manifest.json     # { role: filename } read by the build script
  pixel-fonts.json        # generated - do not hand-edit, see below
```

A few rules for this pattern:

- **License every font you bundle, explicitly.** Bundling a font is a legal
  commitment, not just a technical one: only include a font you have the
  right to redistribute, and say so in a README next to it, with a source
  link and either the license text or the specific permission you were
  given. When a font's redistribution rights are informal or unclear, say
  that plainly instead of implying a license that doesn't exist.
- **Never parse a font at request time.** `gitglance` runs as a serverless
  function per request, so loading a font parser on every hit is slow and
  unnecessary. Instead, `fonts.manifest.json` maps role names to font
  filenames, and `scripts/build-fonts.cjs` (run via `npm run build:fonts`)
  extracts the glyphs you need into a small committed JSON file. It scans
  every folder under `lib/themes/` for a `fonts.manifest.json` and
  regenerates that theme's `pixel-fonts.json` from its `fonts/` folder, so
  adding a new theme with fonts needs no changes to the build script itself.
- **List the generated file's require explicitly.** `lib/pixel-text.js`
  keeps a small static map (`PIXEL_FONTS`) from theme name to its
  `pixel-fonts.json`, one `require(...)` line per pixel-font theme, for the
  same static-analysis reason as step 1. Add your theme's line there.
- **CI enforces reproducibility.** The `fonts` job in
  `.github/workflows/ci.yml` reruns `npm run build:fonts` and fails if any
  theme's generated file no longer matches its committed sources.

## 4. Tests

Plain palette-only themes don't need their own test file: they're exercised
automatically by every card's existing tests. Add a test file under `test/`
(see `test/kangel.test.js`) only if your theme changes rendering behavior
through the flags in step 2, e.g. to check that:

- every card type still renders valid SVG (no `NaN`/`Infinity` in the
  output) with your theme applied,
- any custom logic (like font fallback) behaves correctly at the
  boundaries you care about (long values, unsupported characters, etc.),
- other themes are unaffected by your change.

Run `npm test` locally before opening a PR; CI runs the same command on
every push and pull request.

## 5. Update the README

Two things, both quick:

1. Add a small, appropriately-sized example to an existing gallery table
   (e.g. **More style combos**), the same size as its neighbors (look at the
   `width=` on the surrounding `<img>` tags). Don't add a large standalone
   image or a dedicated section just for your theme — the gallery is meant
   to stay visually consistent across all of them.
2. Add yourself to the **Contributions** table (right below the gallery),
   so you get credit. Copy this row and fill it in:

   ```md
   | [Your Theme](#themes) | [@your-github-username](https://github.com/your-github-username) | One short sentence about what your theme adds |
   ```

That's the whole checklist. Open a PR once both are done.

---

## Adding a new visual style

A style is a set of layout/typography tokens, independent of color. Create
`lib/styles/<your-style>.js` exporting a token object (copy an existing file
as a starting point, e.g. `lib/styles/minimal.js` for a simple one), then
register it in the `STYLES` map in `lib/styles/index.js`.

If your style needs a custom background pattern (most just reuse the plain
flat background), add `lib/styles/backgrounds/<your-kind>.js` exporting a
`(W, H, t, radius, clip) => svgMarkup` function, register it in the
`BACKGROUNDS` map in `lib/styles/backgrounds/index.js`, and set
`bgKind: "your-kind"` on your style's token object. Border, glow, and the
shared clip-path are handled once in that dispatcher, so your function only
needs to return the pattern itself.

## Adding a new card type

Each card type lives in its own file under `lib/render/cards/`. Create
`lib/render/cards/<your-type>.js` exporting a `render<Type>(data, opts)`
function that returns an SVG string (see `lib/render/cards/bars.js` for a
compact example), then add a branch for it in `lib/render/index.js`'s
`render()` dispatcher. Shared helpers (`esc`, `n`, `topLangs`,
`styleAndTheme`, ...) live in `lib/render/helpers.js`, and the shared title
row/animation styles live in `lib/render/title.js`.
