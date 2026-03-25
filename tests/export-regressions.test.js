const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('export summary keeps math typography labels', () => {
  assert.match(html, /const exportMath = \{/);
  assert.match(html, /R<sub>f<\/sub>/);
  assert.match(html, /R<sub>m<\/sub>/);
  assert.match(html, /<em>E<\/em>\(<em>R<\/em>\)/);
  assert.match(html, /<em>β<\/em>/);
});

test('export warnings stay emphatic and engagement-specific', () => {
  assert.match(html, /⚠️ Engagement Warnings/);
  assert.match(html, /function formatWarningMarkup\(warning\)/);
  assert.match(html, /warnings\.map\(\(warning\) => '<li>' \+ formatWarningMarkup\(warning\) \+ '<\/li>'\)/);
});

test('export meaning column explains score direction and uses factor labels', () => {
  assert.match(html, /1 = more favorable, 5 = more adverse/);
  assert.match(
    html,
    /label: value \? getScoreGuide\(layer, factor, row\)\[value - 1\] \|\| getScoreLabel\(layer, factor, value\) : null/
  );
});
