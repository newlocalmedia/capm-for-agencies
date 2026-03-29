import test from 'node:test';
import assert from 'node:assert/strict';

import { engagementBetaFromScore, gap, priceFloor, proposedMargin, requiredMargin } from '../scripts/calc-core.js';

test('engagement beta and required margin use the simplified hurdle logic', () => {
  assert.equal(engagementBetaFromScore(21), 1);
  assert.equal(requiredMargin(10, 22, 21), 22);
  assert.equal(requiredMargin(10, 22, 35), 30);
});

test('proposed margin, price floor, and gap calculate expected outputs', () => {
  assert.equal(proposedMargin(12000, 9000), 25);
  assert.equal(priceFloor(9000, 25), 12000);
  assert.equal(gap(25, 22), 3);
});

test('calculator guards against invalid commercial inputs', () => {
  assert.equal(proposedMargin(0, 100), null);
  assert.equal(proposedMargin(-10, 5), null);
  assert.equal(proposedMargin(100, -5), null);
  assert.equal(priceFloor(9000, 100), null);
  assert.equal(gap(null, 22), null);
});
