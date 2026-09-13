const test = require('node:test');
const assert = require('node:assert/strict');
const { render, renderRepo, renderActivity } = require('../lib/render');
const { pixelText } = require('../lib/pixel-text');
const data = { name: 'Demo', login: 'demo', stars: 44, public_repos: 8, followers: 3, following: 5, langs: { JavaScript: 4, Python: 2 } };
test('Kangel renders the requested ring tracks, ordered colors, and font roles', () => {
  const svg = render('rings', data, { theme: 'kangel', style: 'default' });
  assert.deepEqual([...svg.matchAll(/<circle\b[^>]*stroke="#([a-f0-9]+)"/g)].map(m => m[1]), ['ee98ee','4d21cb','ee98ee','6cb2e0','ee98ee','e64c55','ee98ee','8cf0e0']);
  for (const font of ['DinkieBitmap-7px', 'PressStart2P-Regular', 'PerfectDOSVGA437']) assert.ok(svg.includes(`data-font="${font}"`));
  assert.ok(!svg.includes('width="46" height="3"'));
  assert.ok(svg.includes('aria-label="Stars"'));
});
test('Every card type supports Kangel without invalid geometry', () => {
  const options = { theme: 'kangel', style: 'grid' };
  const cards = ['stats','langs','combined','donut','rings','bars'].map(type => render(type,data,options));
  cards.push(renderRepo({ name: 'demo', description: 'A demo repository', stars: 44, forks: 1, language: 'JavaScript' },options));
  cards.push(renderActivity(data,[{date:'2026-09-12',count:2},{date:'2026-09-13',count:3}],options));
  for (const svg of cards) { assert.ok(svg.includes('<svg')); assert.ok(!/NaN|Infinity/.test(svg)); }
});
test('Unicode names stay readable and unrelated themes are untouched', () => {
  const input = '<svg width="520"><text x="30" y="48" font-size="22">世界</text></svg>';
  assert.equal(pixelText(input, {theme:'kangel'}),input);
  const dark = render('rings',data,{theme:'dark'});
  assert.ok(dark.includes('<text')); assert.ok(!dark.includes('data-font='));
});
test('Wide numbers use the compact fallback', () => {
  const input = '<svg width="520"><text x="88" y="130" text-anchor="middle" font-size="19">123456</text></svg>';
  const svg = pixelText(input,{theme:'kangel'});
  assert.ok(svg.includes('data-font="DinkieBitmap-7px"'));
  assert.ok(svg.includes('aria-label="123456"'));
});
