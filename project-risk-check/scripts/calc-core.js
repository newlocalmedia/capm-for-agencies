export function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function engagementBetaFromScore(score) {
  return round(score / 21, 2);
}

export function requiredMargin(safeMargin, typicalMargin, projectScore) {
  const beta = engagementBetaFromScore(projectScore);
  return round(safeMargin + beta * (typicalMargin - safeMargin), 1);
}

export function proposedMargin(price, cost) {
  if (!Number.isFinite(price) || !Number.isFinite(cost) || price <= 0 || cost < 0) return null;
  return round(((price - cost) / price) * 100, 1);
}

export function priceFloor(cost, required) {
  if (!Number.isFinite(cost) || !Number.isFinite(required) || required >= 100) return null;
  return cost / (1 - required / 100);
}

export function gap(proposed, required) {
  if (!Number.isFinite(proposed) || !Number.isFinite(required)) return null;
  return round(proposed - required, 1);
}
