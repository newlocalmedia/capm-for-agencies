import test from 'node:test';
import assert from 'node:assert/strict';

import { getProgress, getRoute, routes } from '../scripts/routes.js';
import { allRiskQuestionsAnswered, cloneState, initialState, totalRiskScore, validateBaseline, validateCommercial } from '../scripts/state.js';

test('initial state starts with active baseline defaults', () => {
  const state = cloneState(initialState);
  assert.equal(state.baseline.safeMargin, '10');
  assert.equal(state.baseline.typicalMargin, '22');
  assert.equal(allRiskQuestionsAnswered(state), false);
});

test('baseline and commercial validation catch invalid values', () => {
  const state = cloneState(initialState);
  state.baseline.safeMargin = '30';
  state.baseline.typicalMargin = '20';
  assert.match(validateBaseline(state), /Typical project margin should not be lower/i);

  state.baseline.typicalMargin = '35';
  assert.equal(validateBaseline(state), '');

  state.commercial.dealPrice = '0';
  state.commercial.deliveryCost = '-1';
  assert.match(validateCommercial(state), /quoted project price greater than zero/i);

  state.commercial.dealPrice = '12000';
  state.commercial.deliveryCost = '9000';
  assert.equal(validateCommercial(state), '');
});

test('risk answers and total score behave as expected', () => {
  const state = cloneState(initialState);
  for (const key of Object.keys(state.risk)) state.risk[key] = 3;
  assert.equal(allRiskQuestionsAnswered(state), true);
  assert.equal(totalRiskScore(state), 21);
});

test('route helpers provide fallback and progress metadata', () => {
  assert.equal(getRoute('does-not-exist').path, 'welcome');
  assert.equal(routes.at(-1).path, 'how-it-works');
  const progress = getProgress('results');
  assert.equal(progress.current, 13);
  assert.equal(progress.total, 13);
  assert.equal(progress.percent, 100);
});
