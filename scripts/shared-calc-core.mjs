export const LAYER1_SCORE_MIN = 6;
export const LAYER1_SCORE_SPAN = 24;
export const ENGAGEMENT_BETA_NEUTRAL_SCORE = 21;
export const BCORP_PORTFOLIO_SCORE_MIN = 6;
export const BCORP_PORTFOLIO_SCORE_SPAN = 24;
export const BCORP_ENGAGEMENT_NEUTRAL_SCORE = 12;

export function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function layer1FactorFromScore(score) {
  return round(0.85 + (score - LAYER1_SCORE_MIN) * (0.30 / LAYER1_SCORE_SPAN), 2);
}

export function layer1EnvironmentLabel(factor) {
  if (factor <= 0.93) return 'Favorable environment';
  if (factor <= 1.03) return 'Normal environment';
  if (factor <= 1.11) return 'Elevated risk';
  return 'High systematic risk';
}

export function engagementBetaFromScore(score) {
  return round(score / ENGAGEMENT_BETA_NEUTRAL_SCORE, 2);
}

export function blendedBeta(engagementBeta, layer1Factor) {
  return round(engagementBeta * layer1Factor, 2);
}

export function requiredReturn(rf, rm, beta) {
  return round(rf + beta * (rm - rf), 1);
}

export function requiredMargin(safeMargin, typicalMargin, projectScore) {
  return requiredReturn(safeMargin, typicalMargin, engagementBetaFromScore(projectScore));
}

export function proposedMargin(price, cost) {
  if (!Number.isFinite(price) || !Number.isFinite(cost) || price <= 0 || cost < 0) return null;
  return round(((price - cost) / price) * 100, 1);
}

export function realizedMargin(revenue, cost) {
  return proposedMargin(revenue, cost);
}

export function minimumDealPrice(cost, requiredMarginValue) {
  if (!Number.isFinite(cost) || !Number.isFinite(requiredMarginValue) || requiredMarginValue >= 100) return null;
  return cost / (1 - (requiredMarginValue / 100));
}

export function priceFloor(cost, requiredMarginValue) {
  return minimumDealPrice(cost, requiredMarginValue);
}

export function gap(proposed, required) {
  if (!Number.isFinite(proposed) || !Number.isFinite(required)) return null;
  return round(proposed - required, 1);
}

export function layer2Verdict(gapValue) {
  if (gapValue >= 0) {
    return 'Go — proposed margin clears the hurdle rate';
  }
  if (gapValue >= -3) {
    return 'Caution — close, but below hurdle; reprice or reduce risk';
  }
  return 'Stop — proposed margin does not cover the required return';
}

export function bcorpPortfolioModifier(score) {
  return round(0.8 + (score - BCORP_PORTFOLIO_SCORE_MIN) * (0.4 / BCORP_PORTFOLIO_SCORE_SPAN), 2);
}

export function bcorpImpactAdjustment(portfolioScore, engagementScore) {
  const modifier = bcorpPortfolioModifier(portfolioScore);
  const deviation = engagementScore - BCORP_ENGAGEMENT_NEUTRAL_SCORE;
  return round(deviation * modifier, 1);
}

export function bcorpVerdict(proposed, requiredWithImpact, impactAdjustment) {
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

export function retrospectiveAssessment(requiredMarginValue, proposedMarginValue, actualMargin) {
  const hurdleGap = gap(actualMargin, requiredMarginValue);
  const quoteVariance = gap(actualMargin, proposedMarginValue);

  if (hurdleGap < 0) {
    return 'Too optimistic — actual margin missed the original hurdle';
  }
  if (quoteVariance >= 3) {
    return 'Too conservative — actual margin materially outperformed the quoted margin';
  }
  return 'Priced correctly — actual margin was directionally in line with the original hurdle';
}

export default {
  LAYER1_SCORE_MIN,
  LAYER1_SCORE_SPAN,
  ENGAGEMENT_BETA_NEUTRAL_SCORE,
  BCORP_PORTFOLIO_SCORE_MIN,
  BCORP_PORTFOLIO_SCORE_SPAN,
  BCORP_ENGAGEMENT_NEUTRAL_SCORE,
  round,
  layer1FactorFromScore,
  layer1EnvironmentLabel,
  engagementBetaFromScore,
  blendedBeta,
  requiredReturn,
  requiredMargin,
  proposedMargin,
  realizedMargin,
  minimumDealPrice,
  priceFloor,
  gap,
  layer2Verdict,
  bcorpPortfolioModifier,
  bcorpImpactAdjustment,
  bcorpVerdict,
  retrospectiveAssessment
};
