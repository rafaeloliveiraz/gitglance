# Creating a new theme

A theme is a named color palette that every card style renders with. Adding
one is usually a single object literal in `lib/themes.js`; nothing else has
to change for it to show up everywhere (the home page builder, the
`/preview` gallery, and the API all read the theme list from that file).

## 1. Add the palette

Open `lib/themes.js` and add an entry to `THEMES`, keyed by the theme name
users will pass as `?theme=`:

```js
sepia: { bg: "f4ecd8", panel: "ebe0c4", title: "5b4636", text: "3d2f24", muted: "8a7a63", accent: "b5895a", border: "d8c9a3" },
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

That's it for a normal theme. It immediately works with every card type
(`stats`, `langs`, `combined`, `donut`, `rings`, `bars`, `repo`, `activity`)
and every visual style (`vercel`, `terminal`, `neon`, ...), because styles
and themes are independent: a style defines layout/typography tokens, a
theme defines colors.

## 2. Optional capability flags

Sometimes a theme wants to change more than colors. Rather than special-case
a theme name inside the shared rendering code, add an opt-in flag to its
entry in `lib/themes.js` and read that flag generically. The flags supported
today (see the `kangel` theme for a real example of all four):

| Flag         | Type       | Effect |
| ------------ | ---------- | ------ |
| `noTitleBar` | `boolean`  | Suppresses the small underline drawn below card titles in `titleBlock` (`lib/render.js`). |
| `ringColors` | `string[4]`| Overrides the default per-stat ring colors on the `rings` card (`renderRings` in `lib/render.js`). Falls back to the theme's `accent` plus language colors when omitted. |
| `ringTrack`  | `string`   | Overrides the background track color on ring gauges. Falls back to `border` when omitted. |
| `pixelFont`  | `boolean`  | Routes every rendered SVG through `lib/pixel-text.js`, which replaces `<text>` elements with glyph paths from `lib/pixel-fonts.json`. Only makes sense alongside step 3 below. |

If you need a new kind of override, add a new flag rather than checking
`opts.theme === "your-theme"` in `lib/render.js` — that keeps the rendering
code theme-agnostic and keeps every theme's special behavior visible in one
place (`lib/themes.js`).

## 3. Optional: theme-specific assets (custom fonts, etc.)

If a theme needs its own files (fonts, generated data), give it a
subdirectory under `fonts/<theme-name>/` rather than dropping files into the
shared `fonts/` root — see `fonts/kangel/` for the pattern:

- The raw source files (e.g. `.ttf`) live in `fonts/<theme-name>/`.
- A `fonts/<theme-name>/README.md` documents what each file is, where it
  came from, and its license/attribution. Bundling a font is a legal
  commitment, not just a technical one: only include a font you have the
  right to redistribute, and say so explicitly with a source link and the
  license text (or the specific permission you were given) next to it.
  When a font's redistribution rights are unclear or only informally
  confirmed, say that plainly in the README instead of implying a license
  that doesn't exist.
- Do not `require()` or read font files at request time. `gitglance` runs as
  a serverless function per request, so parsing a font on every hit is slow
  and unnecessary. Instead, write a build step
  (`scripts/build-fonts.cjs` is the existing example) that extracts the
  glyphs you need into a small committed JSON file, and have your rendering
  code (see `lib/pixel-text.js`) read only that JSON at runtime.
- Wire the build step into `package.json` (`npm run build:fonts`) and add a
  CI job that reruns it and fails if the committed JSON drifts from the
  sources — see the `fonts` job in `.github/workflows/ci.yml`. Copy that
  pattern if your theme adds its own generated file.

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

## 5. Docs and preview

- Add a one-line mention of the theme name to the theme list in `README.md`.
- If the theme is visually distinctive, add a short `## <Theme> theme`
  section to `README.md` with an example image in `examples/` and a
  `?theme=` markdown snippet, the same way the Kangel theme section does.
- No manual step is needed to make the theme selectable: the home page
  builder and the `/preview` gallery both list themes via
  `Object.keys(THEMES)`.
