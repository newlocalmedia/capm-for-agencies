(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CapmCalculations = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LAYER1_SCORE_MIN = 6;
  const LAYER1_SCORE_SPAN = 24;
  const ENGAGEMENT_BETA_NEUTRAL_SCORE = 21;
  const BCORP_PORTFOLIO_SCORE_MIN = 6;
  const BCORP_PORTFOLIO_SCORE_SPAN = 24;
  const BCORP_ENGAGEMENT_NEUTRAL_SCORE = 12;

  function round(value, digits) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function layer1FactorFromScore(score) {
    return round(0.85 + (score - LAYER1_SCORE_MIN) * (0.30 / LAYER1_SCORE_SPAN), 2);
  }

  function layer1EnvironmentLabel(factor) {
    if (factor <= 0.93) return 'Favorable environment';
    if (factor <= 1.03) return 'Normal environment';
    if (factor <= 1.11) return 'Elevated risk';
    return 'High systematic risk';
  }

  function engagementBetaFromScore(score) {
    return round(score / ENGAGEMENT_BETA_NEUTRAL_SCORE, 2);
  }

  function blendedBeta(engagementBeta, layer1Factor) {
    return round(engagementBeta * layer1Factor, 2);
  }

  function requiredReturn(rf, rm, beta) {
    return round(rf + beta * (rm - rf), 1);
  }

  function proposedMargin(price, cost) {
    if (!Number.isFinite(price) || !Number.isFinite(cost) || price <= 0 || cost < 0) return null;
    return round(((price - cost) / price) * 100, 1);
  }

  function minimumDealPrice(cost, requiredMargin) {
    if (requiredMargin >= 100) return null;
    return cost / (1 - (requiredMargin / 100));
  }

  function gap(proposed, required) {
    return round(proposed - required, 1);
  }

  function layer2Verdict(gapValue) {
    if (gapValue >= 0) {
      return 'Go — proposed margin clears the hurdle rate';
    }
    if (gapValue >= -3) {
      return 'Caution — close, but below hurdle; reprice or reduce risk';
    }
    return 'Stop — proposed margin does not cover the required return';
  }

  function bcorpPortfolioModifier(score) {
    return round(0.8 + (score - BCORP_PORTFOLIO_SCORE_MIN) * (0.4 / BCORP_PORTFOLIO_SCORE_SPAN), 2);
  }

  function bcorpImpactAdjustment(portfolioScore, engagementScore) {
    const modifier = bcorpPortfolioModifier(portfolioScore);
    const deviation = engagementScore - BCORP_ENGAGEMENT_NEUTRAL_SCORE;
    return round(deviation * modifier, 1);
  }

  function bcorpVerdict(proposed, requiredWithImpact, impactAdjustment) {
    const gapValue = gap(proposed, requiredWithImpact);
    if (gapValue >= 0 && impactAdjustment < -3) {
      return 'Mission-aligned — conscious discount justified and hurdle cleared';
    }
    if (gapValue >= 0 && impactAdjustment > 5) {
      return 'Harm premium cleared financially — review mission trade-offs explicitly';
    }
    if (gapValue >= 0) {
      return 'Go — proposed margin clears the impact-adjusted hurdle';
    }
    if (gapValue >= -3) {
      return 'Caution — below E(R*); reprice, reduce risk, or document the trade-off';
    }
    return 'Stop — proposed margin does not clear the impact-adjusted hurdle';
  }

  return {
    round,
    layer1FactorFromScore,
    layer1EnvironmentLabel,
    engagementBetaFromScore,
    blendedBeta,
    requiredReturn,
    proposedMargin,
    minimumDealPrice,
    gap,
    layer2Verdict,
    bcorpPortfolioModifier,
    bcorpImpactAdjustment,
    bcorpVerdict
  };
}));
