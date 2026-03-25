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

test('Layer 2 verdict boundaries stay stable at exact thresholds', () => {
  assert.equal(
    Calc.layer2Verdict(0),
    'Go — proposed margin clears the hurdle rate'
  );
  assert.equal(
    Calc.layer2Verdict(-3),
    'Caution — close, but below hurdle; reprice or reduce risk'
  );
  assert.equal(
    Calc.layer2Verdict(-3.1),
    'Stop — proposed margin does not cover the required return'
  );
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
  assert.equal(Calc.bcorpPortfolioModifier(18), 1.00);
  assert.equal(Calc.bcorpImpactAdjustment(18, 12), 0.0);
});

test('Minimum deal price returns null when required margin reaches or exceeds 100 percent', () => {
  assert.equal(Calc.minimumDealPrice(100000, 100), null);
  assert.equal(Calc.minimumDealPrice(100000, 125), null);
  assert.equal(Math.round(Calc.minimumDealPrice(100000, 99.9)), 100000000);
});

test('Proposed margin returns null for invalid price or cost inputs', () => {
  assert.equal(Calc.proposedMargin(0, 100), null);
  assert.equal(Calc.proposedMargin(-100, 50), null);
  assert.equal(Calc.proposedMargin(100, -1), null);
  assert.equal(Calc.proposedMargin(Number.NaN, 50), null);
});

test('B-Corp portfolio modifier is rounded and stable at key points', () => {
  assert.equal(Calc.bcorpPortfolioModifier(6), 0.8);
  assert.equal(Calc.bcorpPortfolioModifier(18), 1.0);
  assert.equal(Calc.bcorpPortfolioModifier(30), 1.2);
});

test('B-Corp engagement extremes behave symmetrically around the midpoint', () => {
  assert.equal(Calc.bcorpImpactAdjustment(18, 4), -8.0);
  assert.equal(Calc.bcorpImpactAdjustment(18, 20), 8.0);
});

test('B-Corp verdict boundaries stay stable at exact thresholds', () => {
  assert.equal(
    Calc.bcorpVerdict(20, 20, 0),
    'Go — proposed margin clears the impact-adjusted hurdle'
  );
  assert.equal(
    Calc.bcorpVerdict(17, 20, 0),
    'Caution — below E(R*); reprice, reduce risk, or document the trade-off'
  );
  assert.equal(
    Calc.bcorpVerdict(16.9, 20, 0),
    'Stop — proposed margin does not clear the impact-adjusted hurdle'
  );
});

test('Retrospective mode compares actual margin to the original hurdle and quote', () => {
  const actual = Calc.realizedMargin(120000, 101500);
  const required = 17.4;
  const proposed = 23.3;

  assert.equal(actual, 15.4);
  assert.equal(Calc.gap(actual, required), -2.0);
  assert.equal(Calc.gap(actual, proposed), -7.9);
  assert.equal(
    Calc.retrospectiveAssessment(required, proposed, actual),
    'Too optimistic — actual margin missed the original hurdle'
  );
});

test('Retrospective mode can identify a deal that was too conservative', () => {
  const actual = Calc.realizedMargin(120000, 84000);
  const required = 17.4;
  const proposed = 23.3;

  assert.equal(actual, 30.0);
  assert.equal(
    Calc.retrospectiveAssessment(required, proposed, actual),
    'Too conservative — actual margin materially outperformed the quoted margin'
  );
});
