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

test('first-pass defaults are explicit for new users', () => {
  assert.match(html, /id="l1-input" value="1\.00"/);
  assert.match(html, /id="rf" value="10"/);
  assert.match(html, /id="rm" value="22"/);
  assert.match(html, /Begin with Layer 2 for the practical go\/no-go workflow/i);
});

test('app persists calculator state in localStorage', () => {
  assert.match(html, /const STORAGE_KEY = 'capm-for-agencies-state-v1'/);
  assert.match(html, /localStorage\.setItem\(STORAGE_KEY/);
  assert.match(html, /localStorage\.getItem\(STORAGE_KEY\)/);
});

test('reset control clears saved state and restores defaults', () => {
  assert.match(html, /id="reset-all-btn"/);
  assert.match(html, /function resetAll\(\)/);
  assert.match(html, /localStorage\.removeItem\(STORAGE_KEY\)/);
  assert.match(html, /applyInputSnapshot\(\)/);
});

test('layer 2 calculator clamps baseline inputs and explains when price floor exceeds the quote', () => {
  assert.match(html, /id="rf"[^>]*min="0"[^>]*max="40"/);
  assert.match(html, /id="rm"[^>]*min="0"[^>]*max="60"/);
  assert.match(html, /id="l1-input"[^>]*min="0\.5"[^>]*max="2\.0"/);
  assert.match(html, /function sanitizeLayer2Inputs\(\)/);
  assert.match(html, /rf = Calc\.round\(clampNumber\(rf, 0, 40\), 1\);/);
  assert.match(html, /rm = Calc\.round\(clampNumber\(rm, 0, 60\), 1\);/);
  assert.match(html, /l1f = Calc\.round\(clampNumber\(l1f, 0\.5, 2\.0\), 2\);/);
  assert.match(html, /if \(rm < rf\) rm = rf;/);
  assert.match(html, /above current quote by/);
});

test('b corp manual override is bounded to a sane range', () => {
  assert.match(html, /id="bc-manual-adj"[^>]*min="-15"[^>]*max="15"/);
  assert.match(html, /function sanitizeManualImpactAdjustment\(\)/);
  assert.match(html, /value = Calc\.round\(clampNumber\(value, -15, 15\), 1\);/);
});
