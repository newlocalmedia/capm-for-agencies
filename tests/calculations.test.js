const test = require('node:test');
const assert = require('node:assert/strict');

const Calc = require('../scripts/calc-core.js');

test('Layer 1 midpoint is neutral', () => {
  assert.equal(Calc.layer1FactorFromScore(6), 0.85);
  assert.equal(Calc.layer1FactorFromScore(18), 1.00);
  assert.equal(Calc.layer1FactorFromScore(30), 1.15);
  assert.equal(Calc.layer1EnvironmentLabel(1.00), 'Normal environment');
});

test('Layer 2 hybrid scenario stays aligned with current calculator logic', () => {
  const rf = 10;
  const rm = 22;
  const l1Factor = Calc.layer1FactorFromScore(23);
  const engagementBeta = Calc.engagementBetaFromScore(30);
  const blended = Calc.blendedBeta(engagementBeta, l1Factor);
  const required = Calc.requiredReturn(rf, rm, blended);
  const proposed = Calc.proposedMargin(200000, 150000);
  const gap = Calc.gap(proposed, required);

  assert.equal(l1Factor, 1.06);
  assert.equal(engagementBeta, 1.43);
  assert.equal(blended, 1.52);
  assert.equal(required, 28.2);
  assert.equal(proposed, 25.0);
  assert.equal(gap, -3.2);
  assert.equal(Calc.layer2Verdict(gap), 'Stop — proposed margin does not cover the required return');
  assert.equal(Math.round(Calc.minimumDealPrice(150000, required)), 208914);
});

test('Mission-aligned B-Corp scenario produces a moderate discount', () => {
  const standard = 17.4;
  const adjustment = Calc.bcorpImpactAdjustment(12, 6);
  const adjusted = Calc.round(standard + adjustment, 1);
  const proposed = 23.3;

  assert.equal(adjustment, -5.4);
  assert.equal(adjusted, 12.0);
  assert.equal(
    Calc.bcorpVerdict(proposed, adjusted, adjustment),
    'Mission-aligned — conscious discount justified and hurdle cleared'
  );
});

test('Harmful B-Corp scenario raises the hurdle without forcing an automatic stop', () => {
  const standard = 22.0;
  const adjustment = Calc.bcorpImpactAdjustment(24, 17);
  const adjusted = Calc.round(standard + adjustment, 1);
  const proposed = 28.6;

  assert.equal(adjustment, 5.5);
  assert.equal(adjusted, 27.5);
  assert.equal(
    Calc.bcorpVerdict(proposed, adjusted, adjustment),
    'Harm premium cleared financially — review mission trade-offs explicitly'
  );
});

test('B-Corp portfolio midpoint is neutral', () => {
  assert.equal(Calc.round(Calc.bcorpPortfolioModifier(18), 2), 1.00);
  assert.equal(Calc.bcorpImpactAdjustment(18, 12), 0.0);
});
