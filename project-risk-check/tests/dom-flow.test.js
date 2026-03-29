import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const projectRoot = '/Users/danknauss/Developer/GitHub/capm-for-agencies/project-risk-check';
const htmlSource = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const htmlWithoutScripts = htmlSource.replace(/<script[\s\S]*?<\/script>/g, '');
const appModuleUrl = pathToFileURL(path.join(projectRoot, 'scripts', 'app.js')).href;
const storageKey = 'agency-deal-risk-check';

function waitForTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function bootApp({ hash = '#/welcome', storedState } = {}) {
  const dom = new JSDOM(htmlWithoutScripts, {
    url: `https://example.test/index.html${hash}`,
    pretendToBeVisual: true
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Event = dom.window.Event;
  global.HashChangeEvent = dom.window.HashChangeEvent;
  global.HTMLElement = dom.window.HTMLElement;
  Object.defineProperty(globalThis, 'navigator', {
    value: dom.window.navigator,
    configurable: true
  });

  const alerts = [];
  const confirms = [];
  dom.window.alert = (message) => alerts.push(message);
  dom.window.confirm = (message) => { confirms.push(message); return true; };
  global.alert = dom.window.alert;
  global.confirm = dom.window.confirm;

  if (storedState) {
    dom.window.localStorage.setItem(storageKey, JSON.stringify(storedState));
  }

  await import(`${appModuleUrl}?t=${Date.now()}-${Math.random()}`);
  await waitForTick();

  return { dom, document: dom.window.document, window: dom.window, alerts, confirms };
}

async function clickAndWait(element) {
  const previousHash = element.ownerDocument.defaultView.location.hash;
  element.click();
  const nextHash = element.ownerDocument.defaultView.location.hash;
  if (nextHash !== previousHash) {
    element.ownerDocument.defaultView.dispatchEvent(
      new element.ownerDocument.defaultView.HashChangeEvent('hashchange')
    );
  }
  await waitForTick();
}

async function setInput(window, id, value) {
  const field = window.document.getElementById(id);
  assert.ok(field, `Missing input ${id}`);
  field.value = value;
  field.dispatchEvent(new window.Event('input', { bubbles: true }));
  await waitForTick();
}

async function answerRiskQuestion(document, value = '3') {
  const radio = document.querySelector(`input[type="radio"][value="${value}"]`);
  assert.ok(radio, 'Missing risk radio option');
  radio.checked = true;
  radio.dispatchEvent(new document.defaultView.Event('change', { bubbles: true }));
  await waitForTick();
}

test('guided wizard reaches results and tweak panel updates recommendation', async () => {
  const { dom, document, window } = await bootApp();

  await clickAndWait(document.querySelector('[data-nav="baseline-safe"]'));
  assert.equal(document.getElementById('safeMargin').value, '10');

  await clickAndWait(document.querySelector('[data-nav="baseline-typical"]'));
  assert.equal(document.getElementById('typicalMargin').value, '22');

  await clickAndWait(document.querySelector('[data-nav="risk-intro"]'));
  await clickAndWait(document.querySelector('[data-nav="risk/client"]'));

  for (let i = 0; i < 7; i += 1) {
    await answerRiskQuestion(document, '3');
    const next = document.querySelector('.nav .btn-primary');
    await clickAndWait(next);
  }

  assert.equal(window.location.hash, '#/commercial');
  await setInput(window, 'dealPrice', '12000');
  await setInput(window, 'deliveryCost', '9000');
  await clickAndWait(document.querySelector('.nav .btn-primary[data-nav="results"]'));

  const bodyText = document.body.textContent;
  assert.match(bodyText, /21\/35/);
  assert.match(bodyText, /Required margin[\s\S]*22%/i);
  assert.match(bodyText, /Proposed margin[\s\S]*25%/i);
  assert.match(bodyText, /Go/);
  assert.match(bodyText, /Commercial inputs/);
  assert.match(bodyText, /Quoted price/);
  assert.match(bodyText, /Estimated delivery cost/);

  await setInput(window, 'tweak-deliveryCost', '10000');
  assert.match(document.body.textContent, /Reprice/);

  dom.window.close();
});

test('guided wizard blocks incomplete steps and uses specific commercial validation', async () => {
  const { dom, document, window, alerts } = await bootApp({ hash: '#/commercial' });

  await clickAndWait(document.querySelector('.nav .btn-primary[data-nav="results"]'));
  assert.match(alerts.at(-1), /quoted project price greater than zero/i);

  window.localStorage.clear();
  dom.window.close();

  const seededState = {
    baseline: { safeMargin: '10', typicalMargin: '22' },
    risk: {
      client: 3,
      scope: 3,
      tech: 3,
      capacity: 3,
      contract: 3,
      political: 3,
      timeline: 3
    },
    commercial: { dealPrice: '', deliveryCost: '' }
  };

  const secondRun = await bootApp({ hash: '#/commercial', storedState: seededState });
  await clickAndWait(secondRun.document.querySelector('.nav .btn-primary[data-nav="results"]'));
  assert.match(secondRun.alerts.at(-1), /quoted project price greater than zero/i);

  await setInput(secondRun.window, 'dealPrice', '12000');
  await clickAndWait(secondRun.document.querySelector('.nav .btn-primary[data-nav="results"]'));
  assert.match(secondRun.alerts.at(-1), /estimated delivery cost that is zero or higher/i);

  secondRun.dom.window.close();
});


test('clear all data resets the guided app to defaults and clears saved state', async () => {
  const { dom, document, window, confirms } = await bootApp();

  await clickAndWait(document.querySelector('[data-nav="baseline-safe"]'));
  await clickAndWait(document.querySelector('[data-nav="baseline-typical"]'));
  await clickAndWait(document.querySelector('[data-nav="risk-intro"]'));
  await clickAndWait(document.querySelector('[data-nav="risk/client"]'));

  for (let i = 0; i < 7; i += 1) {
    await answerRiskQuestion(document, '3');
    await clickAndWait(document.querySelector('.nav .btn-primary'));
  }

  await setInput(window, 'dealPrice', '12000');
  await setInput(window, 'deliveryCost', '9000');
  await clickAndWait(document.querySelector('.nav .btn-primary[data-nav="results"]'));

  assert.equal(window.localStorage.getItem(storageKey) !== null, true);
  await clickAndWait(document.querySelector('[data-clear-all="true"]'));

  assert.match(confirms.at(-1), /clear all saved data and start over/i);
  assert.equal(window.location.hash, '#/welcome');
  assert.equal(window.localStorage.getItem(storageKey), null);

  await clickAndWait(document.querySelector('[data-nav="baseline-safe"]'));
  assert.equal(document.getElementById('safeMargin').value, '10');
  await clickAndWait(document.querySelector('[data-nav="baseline-typical"]'));
  assert.equal(document.getElementById('typicalMargin').value, '22');

  dom.window.close();
});
