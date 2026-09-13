// Regenerates lib/themes/<theme>/pixel-fonts.json for every theme that ships
// its own fonts. This is a dev/CI-time build step only (see the "fonts" job
// in .github/workflows/ci.yml) - the app never reads .ttf files or runs
// opentype.js at request time, only the generated JSON (see lib/pixel-text.js).
//
// To give a new theme its own fonts, add lib/themes/<name>/fonts.manifest.json
// (role -> filename, matching the .ttf files in lib/themes/<name>/fonts/),
// then run `npm run build:fonts`. See docs/THEMES.md.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const THEMES_DIR = path.join(__dirname, '..', 'lib', 'themes');

function buildTheme(themeDir) {
  const manifestPath = path.join(themeDir, 'fonts.manifest.json');
  if (!fs.existsSync(manifestPath)) return;
  const files = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const output = {};
  for (const [role, file] of Object.entries(files)) {
    const fontPath = path.join(themeDir, 'fonts', file);
    const font = opentype.parse(Uint8Array.from(fs.readFileSync(fontPath)).buffer);
    const glyphs = {};
    for (const code of [...Array.from({ length: 224 }, (_, i) => i + 32), 0x2026, 0x2019, 0x2013, 0x2014]) {
      const ch = String.fromCodePoint(code);
      if (!font.charToGlyphIndex(ch)) continue;
      const g = font.charToGlyph(ch);
      glyphs[ch] = { d: g.getPath(0, 0, 1000).toPathData(2), w: g.advanceWidth / font.unitsPerEm * 1000 };
    }
    output[role] = { name: file.replace('.ttf', ''), glyphs };
  }
  fs.writeFileSync(path.join(themeDir, 'pixel-fonts.json'), JSON.stringify(output));
  console.log('Built', path.relative(process.cwd(), path.join(themeDir, 'pixel-fonts.json')));
}

for (const name of fs.readdirSync(THEMES_DIR)) {
  const themeDir = path.join(THEMES_DIR, name);
  if (fs.statSync(themeDir).isDirectory()) buildTheme(themeDir);
}
