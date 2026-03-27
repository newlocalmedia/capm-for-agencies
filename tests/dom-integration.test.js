const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const workspaceRoot = path.join(__dirname, '..');
const htmlSource = fs.readFileSync(path.join(workspaceRoot, 'index.html'), 'utf8');
const calcCoreScript = fs.readFileSync(path.join(workspaceRoot, 'scripts', 'calc-core.js'), 'utf8');
const appScriptMatch = htmlSource.match(/<script>\s*const Calc = window\.CapmCalculations;[\s\S]*?<\/script>\s*<\/body>/);

if (!appScriptMatch) {
  throw new Error('Could not locate main app script in index.html');
}

const appScript = appScriptMatch[0]
  .replace(/^<script>/, '')
  .replace(/<\/script>\s*<\/body>$/, '');

const htmlWithoutScripts = htmlSource.replace(/<script[\s\S]*?<\/script>/g, '');
const STORAGE_KEY = 'capm-for-agencies-state-v1';

function bootApp({ storedState } = {}) {
  const dom = new JSDOM(htmlWithoutScripts, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://example.test/index.html'
  });

  const { window } = dom;
  window.URL.createObjectURL = () => 'blob:mock-summary';
  window.URL.revokeObjectURL = () => {};
  window.open = () => ({ focus() {}, closed: false });

  if (storedState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
  }

  const core = window.document.createElement('script');
  core.textContent = calcCoreScript;
  window.document.body.appendChild(core);

  const app = window.document.createElement('script');
  app.textContent = appScript;
  window.document.body.appendChild(app);

  return { dom, window, document: window.document };
}

function clickScore(document, layer, factor, value) {
  const button = document.querySelector(
    `.score-table[data-layer="${layer}"] tr[data-factor="${factor}"] .score-btn[data-val="${value}"]`
  );
  assert.ok(button, `Missing score button for ${layer}:${factor}:${value}`);
  button.click();
}

function scoreLayer(document, layer, value) {
  document
    .querySelectorAll(`.score-table[data-layer="${layer}"] tr[data-factor]`)
    .forEach((row) => {
      const factor = row.dataset.factor;
      clickScore(document, layer, factor, value);
    });
}

function setInput(window, id, value) {
  const field = window.document.getElementById(id);
  assert.ok(field, `Missing input ${id}`);
  field.value = value;
  field.dispatchEvent(new window.Event('input', { bubbles: true }));
}

test('Layer 2 DOM flow updates required margin, proposed margin, verdict, and export state', () => {
  const { dom, document, window } = bootApp();

  scoreLayer(document, 'layer2', 3);
  setInput(window, 'deal-price', '100000');
  setInput(window, 'deal-cost', '70000');

  assert.equal(document.getElementById('l2-raw').textContent.trim(), '21');
  assert.equal(document.getElementById('l2-beta').textContent.trim(), '1.00');
  assert.equal(document.getElementById('l2-er').textContent.trim(), '22.0%');
  assert.equal(document.getElementById('l2-proposed').textContent.trim(), '30.0%');
  assert.match(document.getElementById('l2-verdict').textContent, /Go/);
  assert.equal(document.getElementById('export-summary-btn').disabled, false);
  assert.match(document.getElementById('l2-chart-note').textContent, /relative to the hurdle/i);

  dom.window.close();
});

test('Layer 2 and Layer 3 warnings reflect the specific missing commercial inputs', () => {
  const { dom, document, window } = bootApp();

  scoreLayer(document, 'layer2', 3);
  assert.match(document.getElementById('l2-verdict').textContent, /deal price and estimated delivery cost/i);

  scoreLayer(document, 'bcorp_l1', 3);
  scoreLayer(document, 'bcorp_l2', 3);
  assert.match(document.getElementById('bc-verdict').textContent, /deal price and estimated delivery cost/i);
  assert.match(document.getElementById('bc-verdict').innerHTML, /href="#deal-price"/);
  assert.match(document.getElementById('bc-verdict').innerHTML, /href="#deal-cost"/);

  setInput(window, 'deal-price', '120000');
  assert.match(document.getElementById('l2-verdict').textContent, /estimated delivery cost/i);
  assert.doesNotMatch(document.getElementById('l2-verdict').textContent, /deal price and estimated delivery cost/i);
  assert.match(document.getElementById('bc-verdict').textContent, /estimated delivery cost/i);
  assert.doesNotMatch(document.getElementById('bc-verdict').innerHTML, /href="#deal-price"/);

  dom.window.close();
});

test('Reset All clears score selections, saved state, and restores calculator defaults', () => {
  const { dom, document, window } = bootApp();

  clickScore(document, 'layer1', 'platform', 4);
  scoreLayer(document, 'layer2', 3);
  setInput(window, 'rf', '12');
  setInput(window, 'rm', '24');
  setInput(window, 'deal-price', '100000');
  setInput(window, 'deal-cost', '82000');

  assert.ok(window.localStorage.getItem(STORAGE_KEY));

  document.getElementById('reset-all-btn').click();

  assert.equal(document.querySelectorAll('.score-btn[class*="selected-"]').length, 0);
  assert.equal(document.getElementById('rf').value, '10');
  assert.equal(document.getElementById('rm').value, '22');
  assert.equal(document.getElementById('l1-input').value, '1.00');
  assert.equal(document.getElementById('deal-price').value, '');
  assert.equal(document.getElementById('deal-cost').value, '');
  assert.equal(document.getElementById('export-summary-btn').disabled, true);
  assert.equal(window.localStorage.getItem(STORAGE_KEY), null);

  dom.window.close();
});

test('Persisted state restores score selections and calculator outputs on reload', () => {
  const firstRun = bootApp();
  scoreLayer(firstRun.document, 'layer2', 3);
  setInput(firstRun.window, 'rf', '11');
  setInput(firstRun.window, 'rm', '23');
  setInput(firstRun.window, 'deal-price', '100000');
  setInput(firstRun.window, 'deal-cost', '82000');

  const storedState = JSON.parse(firstRun.window.localStorage.getItem(STORAGE_KEY));
  firstRun.dom.window.close();

  const { dom, document } = bootApp({ storedState });

  assert.equal(document.getElementById('rf').value, '11');
  assert.equal(document.getElementById('rm').value, '23');
  assert.equal(document.getElementById('deal-price').value, '100000');
  assert.equal(document.getElementById('deal-cost').value, '82000');
  assert.equal(document.getElementById('l2-raw').textContent.trim(), '21');
  assert.equal(document.getElementById('l2-er').textContent.trim(), '23.0%');
  assert.equal(document.getElementById('l2-proposed').textContent.trim(), '18.0%');
  assert.match(document.getElementById('l2-verdict').textContent, /Stop|Caution/);
  assert.equal(
    document.querySelector('.score-table[data-layer="layer2"] tr[data-factor="client"] .score-btn.selected-3')?.textContent.trim(),
    '3'
  );

  dom.window.close();
});

test('Retrospective mode requires a complete presales snapshot before it activates', () => {
  const { dom, document } = bootApp();

  document.getElementById('mode-retrospective-btn').click();

  assert.equal(document.body.dataset.workflowMode, 'presales');
  assert.match(document.getElementById('mode-help-note').textContent, /Complete Layer 2 scoring and the commercial inputs/i);
  assert.equal(document.getElementById('retrospective-panel').hidden, true);

  dom.window.close();
});

test('Retrospective mode freezes a presales snapshot until the user explicitly refreshes it', () => {
  const { dom, document, window } = bootApp();

  scoreLayer(document, 'layer2', 3);
  setInput(window, 'deal-price', '120000');
  setInput(window, 'deal-cost', '92000');
  document.getElementById('retro-deal-name').value = 'Example deal';
  document.getElementById('retro-deal-name').dispatchEvent(new window.Event('input', { bubbles: true }));

  document.getElementById('mode-retrospective-btn').click();

  assert.equal(document.body.dataset.workflowMode, 'retrospective');
  assert.equal(document.body.dataset.presalesLocked, 'true');
  assert.equal(document.getElementById('retrospective-panel').hidden, false);
  assert.equal(document.getElementById('retro-snapshot-price').textContent.trim(), '$120,000');
  assert.equal(document.getElementById('retro-snapshot-cost').textContent.trim(), '$92,000');
  assert.equal(document.getElementById('retro-snapshot-required').textContent.trim(), '22.0%');
  assert.equal(document.getElementById('retro-snapshot-proposed').textContent.trim(), '23.3%');
  assert.equal(document.getElementById('deal-price').disabled, true);

  document.getElementById('retro-unlock-btn').click();
  assert.equal(document.body.dataset.presalesLocked, 'false');
  assert.equal(document.getElementById('deal-price').disabled, false);

  setInput(window, 'deal-price', '150000');
  assert.equal(document.getElementById('retro-snapshot-price').textContent.trim(), '$120,000');

  document.getElementById('retro-refreeze-btn').click();
  assert.equal(document.getElementById('retro-snapshot-price').textContent.trim(), '$150,000');

  dom.window.close();
});
