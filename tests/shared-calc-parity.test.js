const test = require('node:test');
const assert = require('node:assert/strict');
const Calc = require('../scripts/calc-core.js');

async function loadShared() {
  return import('../scripts/shared-calc-core.mjs');
}

test('shared calc core stays in parity with the main-app compatibility wrapper', async () => {
  const Shared = await loadShared();

  const scenarios = [
    { score: 7, rf: 10, rm: 22, beta: 0.33, price: 120000, cost: 90000, required: 25 },
    { score: 21, rf: 10, rm: 22, beta: 1.0, price: 80000, cost: 62000, required: 22 },
    { score: 35, rf: 12, rm: 28, beta: 1.67, price: 150000, cost: 130000, required: 34 }
  ];

  for (const scenario of scenarios) {
    assert.equal(Shared.engagementBetaFromScore(scenario.score), Calc.engagementBetaFromScore(scenario.score));
    assert.equal(Shared.requiredReturn(scenario.rf, scenario.rm, scenario.beta), Calc.requiredReturn(scenario.rf, scenario.rm, scenario.beta));
    assert.equal(Shared.proposedMargin(scenario.price, scenario.cost), Calc.proposedMargin(scenario.price, scenario.cost));
    assert.equal(Shared.priceFloor(scenario.cost, scenario.required), Calc.minimumDealPrice(scenario.cost, scenario.required));
    assert.equal(Shared.gap(Shared.proposedMargin(scenario.price, scenario.cost), scenario.required), Calc.gap(Calc.proposedMargin(scenario.price, scenario.cost), scenario.required));
  }
});

test('shared requiredMargin helper matches the main app at neutral Layer 1', async () => {
  const Shared = await loadShared();

  const score = 21;
  const rf = 10;
  const rm = 22;
  const beta = Calc.engagementBetaFromScore(score);
  const blended = Calc.blendedBeta(beta, 1.0);

  assert.equal(Shared.requiredMargin(rf, rm, score), Calc.requiredReturn(rf, rm, blended));
});
