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
  assert.match(html, /Using default calibration/);
  assert.match(html, /Agency <em>R<sub>f<\/sub><\/em> is set to 10%/);
  assert.match(html, /start with Layer 2 immediately/i);
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

test('retrospective mode is available and persisted', () => {
  assert.match(html, /id="mode-retrospective-btn"/);
  assert.match(html, /function setWorkflowMode\(mode\)/);
  assert.match(html, /mode:\s*currentWorkflowMode/);
  assert.match(html, /id="retrospective-panel"/);
  assert.match(html, /id="actual-revenue"/);
  assert.match(html, /id="actual-cost"/);
  assert.match(html, /function calcRetrospective\(\)/);
});
