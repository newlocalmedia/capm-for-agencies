export function classifyRiskSignals(scores = {}) {
  const severe = [];
  const elevated = [];

  Object.entries(scores).forEach(([factor, value]) => {
    if (value >= 5) severe.push(factor);
    else if (value >= 4) elevated.push(factor);
  });

  return {
    severe,
    elevated,
    stackedDiscoveryRisk: ['scope', 'tech', 'political'].filter((factor) => (scores[factor] || 0) >= 4),
    stackedDeliveryRisk: ['timeline', 'capacity', 'contract'].filter((factor) => (scores[factor] || 0) >= 4)
  };
}

export function shouldSellDiscoveryFirst(scores = {}) {
  const scope = scores.scope || 0;
  const tech = scores.tech || 0;
  const political = scores.political || 0;
  const triggers = [scope, tech, political].filter((value) => value >= 4).length;

  return scope >= 5 || (scope >= 4 && tech >= 4) || (scope >= 4 && political >= 4) || triggers >= 2;
}

export function shouldWalkAway({ gap, scores = {}, priceFloorExceedsQuote = false }) {
  const severeRiskCount = Object.values(scores).filter((value) => value >= 5).length;
  if (gap <= -8) return true;
  if (priceFloorExceedsQuote && severeRiskCount >= 2) return true;
  return severeRiskCount >= 3;
}

export function getRecommendation({ scores = {}, requiredMargin = null, proposedMargin = null, gap = null, priceFloorExceedsQuote = false }) {
  const signals = classifyRiskSignals(scores);

  if (requiredMargin === null || proposedMargin === null || gap === null) {
    return {
      key: 'incomplete',
      headline: 'Enter the project inputs to see the recommendation.',
      tone: 'neutral',
      why: [],
      nextSteps: []
    };
  }

  if (shouldWalkAway({ gap, scores, priceFloorExceedsQuote })) {
    return {
      key: 'walk-away',
      headline: 'Walk away',
      tone: 'stop',
      why: [
        'This quote is too far below the required margin for the level of risk.',
        'The deal looks commercially weak unless price, scope, or terms change materially.'
      ],
      nextSteps: [
        'Decline the work in its current form.',
        'Only revisit it if scope, pricing, or contract terms change materially.'
      ]
    };
  }

  if (shouldSellDiscoveryFirst(scores)) {
    return {
      key: 'discovery-first',
      headline: 'Sell discovery first',
      tone: 'caution',
      why: [
        'There is still too much uncertainty for confident implementation pricing.',
        'Discovery is probably the right thing to sell before committing to a delivery quote.'
      ],
      nextSteps: [
        'Propose a paid discovery phase first.',
        'Use that work to tighten scope, assumptions, and pricing.'
      ]
    };
  }

  if (gap < 0) {
    return {
      key: 'reprice',
      headline: 'Reprice',
      tone: 'caution',
      why: [
        'The current quote does not clear the required margin for this level of risk.',
        signals.elevated.length ? 'Several risks are elevated enough to justify a stronger margin buffer.' : 'The margin buffer is still too thin.'
      ],
      nextSteps: [
        'Raise the price, reduce scope, or improve contract terms.',
        'If the work is still unclear, sell discovery before implementation.'
      ]
    };
  }

  return {
    key: 'go',
    headline: 'Go',
    tone: 'go',
    why: [
      'The current quote clears the required margin for the risk you scored.',
      signals.elevated.length ? 'There are still elevated risks, but the margin appears to compensate for them.' : 'The economics look workable as priced.'
    ],
    nextSteps: [
      'Proceed, but document the main risk assumptions.',
      'Watch the highest-risk factors during delivery.'
    ]
  };
}
