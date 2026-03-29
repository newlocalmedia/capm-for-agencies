import { riskQuestions } from './questions.js';

export const initialState = {
  baseline: {
    safeMargin: '10',
    typicalMargin: '22'
  },
  risk: Object.fromEntries(riskQuestions.map((question) => [question.id, null])),
  commercial: {
    dealPrice: '',
    deliveryCost: ''
  }
};

export function cloneState(state = initialState) {
  return JSON.parse(JSON.stringify(state));
}

export function getStoredState() {
  try {
    const raw = localStorage.getItem('agency-deal-risk-check');
    return raw ? JSON.parse(raw) : cloneState();
  } catch {
    return cloneState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem('agency-deal-risk-check', JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function validateBaseline(state) {
  const safe = parseFloat(state.baseline.safeMargin);
  const typical = parseFloat(state.baseline.typicalMargin);

  if (!Number.isFinite(safe) || safe < 0 || safe > 40) {
    return 'Enter a safe-work margin between 0% and 40%.';
  }
  if (!Number.isFinite(typical) || typical < 0 || typical > 60) {
    return 'Enter a typical project margin between 0% and 60%.';
  }
  if (typical < safe) {
    return 'Typical project margin should not be lower than safe-work margin.';
  }
  return '';
}

export function validateCommercial(state) {
  const price = parseFloat(state.commercial.dealPrice);
  const cost = parseFloat(state.commercial.deliveryCost);

  if (!Number.isFinite(price) || price <= 0) {
    return 'Enter a quoted project price greater than zero.';
  }
  if (!Number.isFinite(cost) || cost < 0) {
    return 'Enter an estimated delivery cost that is zero or higher.';
  }
  return '';
}

export function allRiskQuestionsAnswered(state) {
  return Object.values(state.risk).every((value) => Number.isInteger(value) && value >= 1 && value <= 5);
}

export function totalRiskScore(state) {
  return Object.values(state.risk).reduce((sum, value) => sum + (value || 0), 0);
}
