const { THEMES } = require('./themes');
// Generated glyph data per pixel-font theme (see lib/themes/<name>/pixel-fonts.json
// and scripts/build-fonts.cjs). Listed explicitly, one require per theme, so
// Vercel's dependency tracing can see exactly which generated files to bundle
// (a fully dynamic require() by theme name would not be statically analyzable).
const PIXEL_FONTS = {
  kangel: require('./themes/kangel/pixel-fonts.json'),
};
const decode = s => s.replace(/&(?:amp|lt|gt|quot|#39);/g, x => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"})[x]);
const escape = s => s.replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[x]);
function width(text, font, size) {
  return [...text].reduce((sum,ch) => sum + (font.glyphs[ch]?.w || 500) * size / 1000, 0);
}
function pixelText(svg, opts) {
  const fonts = PIXEL_FONTS[opts?.theme];
  if (!fonts || !THEMES[opts?.theme]?.pixelFont) return svg;
  const W=Number(svg.match(/width="([\d.]+)"/)[1]);
  return svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (original, attrs, content) => {
    // Elements with nested markup (e.g. a colored <tspan> highlight) carry
    // meaning beyond plain text; leave them in the original font rather than
    // flattening them into a single-color pixel-text block.
    if (/<[^>]+>/.test(content)) return original;
    const a=Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
    const text=decode(content);
    const numeric=/^[\d.,%kKmM+\-]+$/.test(text);
    const title=!numeric && Number(a['font-size'])>=16 && Number(a.y)<=60;
    let font=fonts[numeric?'number':title?'title':'text'];
    let size=numeric ? Math.min(16,Number(a['font-size'])) : title ? 24 : 14;
    const x=Number(a.x), y=Number(a.y), anchor=a['text-anchor'] || 'start';
    const maxWidth=numeric ? (anchor==='middle'?60:72) : title ? Math.min(W-x-28,W>=700?W/2-50:Infinity) : anchor==='middle'?108:Math.max(100,W-x-30);
    if(width(text,font,size)>maxWidth) font=fonts[numeric?'text':title?'titleFallback':'text'];
    if(width(text,font,size)>maxWidth) size*=maxWidth/width(text,font,size);
    // Preserve unsupported Unicode rather than silently losing profile/repo names.
    if([...text].some(ch=>!font.glyphs[ch])) return original;
    const w=width(text,font,size);
    let cursor=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
    let paths='';
    for(const ch of text) {
      const glyph=font.glyphs[ch];
      if(glyph.d) paths+=`<path d="${glyph.d}" transform="translate(${cursor.toFixed(3)} ${y}) scale(${size/1000})"/>`;
      cursor+=glyph.w*size/1000;
    }
    return `<g fill="${a.fill || '#4e23cf'}" role="img" aria-label="${escape(text)}" data-font="${font.name}"><title>${escape(text)}</title>${paths}</g>`;
  });
}
module.exports={pixelText};
