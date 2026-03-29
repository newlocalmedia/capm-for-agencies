import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyRiskSignals, getRecommendation, shouldSellDiscoveryFirst, shouldWalkAway } from '../scripts/recommendations.js';

const lowRiskScores = {
  client: 2,
  scope: 2,
  tech: 2,
  capacity: 2,
  contract: 2,
  political: 2,
  timeline: 2
};

test('classifies elevated and discovery-heavy risk signals', () => {
  const signals = classifyRiskSignals({ ...lowRiskScores, scope: 4, tech: 5, political: 4 });
  assert.deepEqual(signals.severe, ['tech']);
  assert.deepEqual(signals.elevated, ['scope', 'political']);
  assert.deepEqual(signals.stackedDiscoveryRisk, ['scope', 'tech', 'political']);
});

test('flags discovery-first scenarios', () => {
  assert.equal(shouldSellDiscoveryFirst({ ...lowRiskScores, scope: 4, tech: 4 }), true);
  assert.equal(shouldSellDiscoveryFirst(lowRiskScores), false);
});

test('flags walk-away scenarios', () => {
  assert.equal(shouldWalkAway({ gap: -8, scores: lowRiskScores, priceFloorExceedsQuote: false }), true);
  assert.equal(shouldWalkAway({ gap: -2, scores: { ...lowRiskScores, scope: 5, tech: 5, political: 5 }, priceFloorExceedsQuote: false }), true);
  assert.equal(shouldWalkAway({ gap: -2, scores: lowRiskScores, priceFloorExceedsQuote: false }), false);
});

test('returns the expected top-level recommendation states', () => {
  assert.equal(getRecommendation({}).key, 'incomplete');
  assert.equal(getRecommendation({ scores: { ...lowRiskScores, scope: 4, tech: 4 }, requiredMargin: 24, proposedMargin: 21, gap: -3, priceFloorExceedsQuote: false }).key, 'discovery-first');
  assert.equal(getRecommendation({ scores: lowRiskScores, requiredMargin: 22, proposedMargin: 19, gap: -3, priceFloorExceedsQuote: false }).key, 'reprice');
  assert.equal(getRecommendation({ scores: lowRiskScores, requiredMargin: 22, proposedMargin: 26, gap: 4, priceFloorExceedsQuote: false }).key, 'go');
  assert.equal(getRecommendation({ scores: { ...lowRiskScores, scope: 5, tech: 5, political: 5 }, requiredMargin: 28, proposedMargin: 18, gap: -10, priceFloorExceedsQuote: true }).key, 'walk-away');
});
