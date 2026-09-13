const fs = require('fs');
const opentype = require('opentype.js');
const files = { text:'DinkieBitmap-7px.ttf', number:'PressStart2P-Regular.ttf', title:'PerfectDOSVGA437.ttf', titleFallback:'PixelMplus10-Regular.ttf' };
const output = {};
for(const [role,file] of Object.entries(files)) {
 const font=opentype.parse(Uint8Array.from(fs.readFileSync('fonts/kangel/'+file)).buffer);
 const glyphs={};
 for(const code of [...Array.from({length:224},(_,i)=>i+32),0x2026,0x2019,0x2013,0x2014]) {
  const ch=String.fromCodePoint(code); if(!font.charToGlyphIndex(ch)) continue;
  const g=font.charToGlyph(ch);
  glyphs[ch]={d:g.getPath(0,0,1000).toPathData(2),w:g.advanceWidth/font.unitsPerEm*1000};
 }
 output[role]={name:file.replace('.ttf',''),glyphs};
}
fs.writeFileSync('lib/pixel-fonts.json',JSON.stringify(output));
