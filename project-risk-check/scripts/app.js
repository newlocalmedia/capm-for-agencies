import { baselineQuestions, commercialFields, riskQuestions } from './questions.js';
import { getRecommendation } from './recommendations.js';
import { gap, priceFloor, proposedMargin, requiredMargin } from './calc-core.js';
import { allRiskQuestionsAnswered, getStoredState, saveState, totalRiskScore, validateBaseline, validateCommercial } from './state.js';
import { getCurrentPath, getProgress, getRoute, navigate } from './routes.js';

const app = document.getElementById('app');
let state = getStoredState();

function nextPath(path) {
  const all = [
    'welcome',
    'baseline-safe',
    'baseline-typical',
    'risk-intro',
    'risk/client',
    'risk/scope',
    'risk/tech',
    'risk/capacity',
    'risk/contract',
    'risk/stakeholders',
    'risk/timeline',
    'commercial',
    'results'
  ];
  return all[Math.min(all.length - 1, all.indexOf(path) + 1)];
}

function prevPath(path) {
  const all = [
    'welcome',
    'baseline-safe',
    'baseline-typical',
    'risk-intro',
    'risk/client',
    'risk/scope',
    'risk/tech',
    'risk/capacity',
    'risk/contract',
    'risk/stakeholders',
    'risk/timeline',
    'commercial',
    'results'
  ];
  return all[Math.max(0, all.indexOf(path) - 1)];
}

function renderProgress(path) {
  const progress = getProgress(path);
  return `
    <div class="progress" aria-hidden="true"><div class="progress-bar" style="width:${progress.percent}%"></div></div>
    <div class="step-meta">
      <span>Step ${progress.current} of ${progress.total}</span>
      <span>${progress.percent}%</span>
    </div>
  `;
}

function getPhaseConfig(path) {
  if (path === 'welcome' || path === 'how-it-works') return 'welcome';
  if (path === 'baseline-safe' || path === 'baseline-typical') return 'baselines';
  if (path === 'risk-intro' || path.startsWith('risk/')) return 'risk';
  if (path === 'commercial') return 'commercial';
  return 'results';
}

function getAvailablePhases() {
  const baselineDone = !validateBaseline(state);
  const riskDone = allRiskQuestionsAnswered(state);
  const commercialDone = !validateCommercial(state);
  return {
    baselines: true,
    risk: baselineDone,
    commercial: baselineDone && riskDone,
    results: baselineDone && riskDone && commercialDone
  };
}

function renderPhaseNav(path) {
  const current = getPhaseConfig(path);
  if (current === 'welcome') return '';

  const available = getAvailablePhases();
  const phases = [
    { key: 'baselines', label: 'Baselines', target: 'baseline-safe' },
    { key: 'risk', label: 'Project Risk', target: 'risk-intro' },
    { key: 'commercial', label: 'Commercial', target: 'commercial' },
    { key: 'results', label: 'Results', target: 'results' }
  ];

  return `
    <nav class="phase-nav" aria-label="Major steps">
      ${phases.map((phase) => `
        <button
          class="phase-chip ${current === phase.key ? 'current' : ''} ${available[phase.key] ? 'available' : ''}"
          data-nav="${phase.target}"
          ${available[phase.key] ? '' : 'disabled'}
        >${phase.label}</button>
      `).join('')}
    </nav>
  `;
}

function renderNav({ back, next, nextLabel = 'Continue', backLabel = 'Back' }) {
  return `
    <div class="nav">
      <button class="btn" data-nav="${back}">${backLabel}</button>
      <button class="btn btn-primary" data-nav="${next}">${nextLabel}</button>
    </div>
  `;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function estimatePillWidth(text, fontSize = 12, padX = 10) {
  return Math.max(72, Math.ceil(text.length * (fontSize * 0.63)) + padX * 2);
}

function buildChartPill(opts) {
  const width = opts.chartWidth || 620;
  const height = opts.chartHeight || 280;
  const padX = opts.padX || 10;
  const pillWidth = opts.width || estimatePillWidth(opts.text, opts.fontSize || 12, padX);
  const pillHeight = opts.height || 24;

  let left = opts.x;
  if (opts.anchor === 'center') left -= pillWidth / 2;
  if (opts.anchor === 'end') left -= pillWidth;

  left = clamp(left, 8, width - pillWidth - 8);
  const top = clamp(opts.y, 8, height - pillHeight - 8);

  return (
    `<rect x="${left}" y="${top}" width="${pillWidth}" height="${pillHeight}" rx="12" fill="${opts.fill || 'rgba(247,245,240,0.96)'}" stroke="${opts.stroke || 'rgba(26,26,46,0.10)'}" stroke-width="1.2"></rect>` +
    `<text x="${left + pillWidth / 2}" y="${top + 16}" text-anchor="middle" fill="${opts.color || '#1a1a2e'}" font-size="${opts.fontSize || 12}" font-weight="${opts.weight || 700}">${opts.textMarkup || escapeHtml(opts.text)}</text>`
  );
}

function buildAxesMarkup({ width, height, margin, xTicks, yTicks, xScaleFn, yScaleFn, xLabel = 'Project risk score', yLabel = 'Required margin' }) {
  let axesMarkup = '';

  yTicks.forEach((tick) => {
    const y = yScaleFn(tick);
    axesMarkup += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="rgba(61,56,49,0.10)" stroke-width="1"></line>`;
    if (tick < yTicks[yTicks.length - 1]) {
      axesMarkup += `<text x="${margin.left - 12}" y="${y + 4}" text-anchor="end" fill="#7a756c" font-size="12">${tick}%</text>`;
    }
  });

  xTicks.forEach((tick) => {
    const x = xScaleFn(tick);
    axesMarkup += `<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${height - margin.bottom}" stroke="rgba(61,56,49,0.08)" stroke-width="1"></line>`;
    axesMarkup += `<text x="${x}" y="${height - margin.bottom + 22}" text-anchor="middle" fill="#7a756c" font-size="12">${tick}</text>`;
  });

  axesMarkup += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="#7a756c" stroke-width="2"></line>`;
  axesMarkup += `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="#7a756c" stroke-width="2"></line>`;
  axesMarkup += `<text x="${margin.left}" y="${margin.top - 10}" fill="#6b6963" font-size="13" font-weight="700">${escapeHtml(yLabel)}</text>`;
  axesMarkup += `<text x="${(margin.left + width - margin.right) / 2}" y="${height - 10}" text-anchor="middle" fill="#6b6963" font-size="13" font-weight="700">${escapeHtml(xLabel)}</text>`;

  return axesMarkup;
}

function renderMarginInput({ id, value, placeholder, tweak = '' }) {
  return `
    <div class="inline-input">
      <button type="button" class="stepper-btn" data-step-target="${id}" data-step-dir="-1" aria-label="Decrease value">−</button>
      <div class="input-with-unit">
        <input id="${id}" name="${id}" ${tweak ? `data-tweak="${tweak}"` : ''} inputmode="numeric" value="${value}" placeholder="${placeholder}">
        <span class="input-unit">%</span>
      </div>
      <button type="button" class="stepper-btn" data-step-target="${id}" data-step-dir="1" aria-label="Increase value">+</button>
    </div>
  `;
}

function renderSimpleChart({ required, proposed, score }) {
  const width = 620;
  const height = 280;
  const margin = { top: 28, right: 24, bottom: 52, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const minScore = 7;
  const maxScore = 35;
  const maxMargin = Math.max(40, Math.ceil(Math.max(required || 0, proposed || 0, 30) / 5) * 5);
  const x = (value) => margin.left + ((value - minScore) / (maxScore - minScore)) * plotWidth;
  const y = (value) => margin.top + plotHeight - (value / maxMargin) * plotHeight;

  const safe = parseFloat(state.baseline.safeMargin);
  const typical = parseFloat(state.baseline.typicalMargin);
  const tickScores = [7, 14, 21, 28, 35];
  const yTicks = [];
  for (let tick = 0; tick <= maxMargin; tick += 5) yTicks.push(tick);
  const linePoints = tickScores.map((point) => `${x(point)},${y(requiredMargin(safe, typical, point))}`).join(' ');
  const requiredX = x(score);
  const requiredY = y(required);
  const proposedY = Number.isFinite(proposed) ? y(proposed) : null;
  const labelAnchor = requiredX > (width - margin.right - 170) ? 'end' : 'start';
  const labelX = labelAnchor === 'end' ? requiredX - 16 : requiredX + 16;
  let requiredLabelY = requiredY - 30;
  let proposedLabelY = proposedY !== null ? proposedY - 30 : null;

  if (proposedY !== null && Math.abs(proposedLabelY - requiredLabelY) < 28) {
    if (proposedY <= requiredY) {
      proposedLabelY = proposedY - 42;
      requiredLabelY = requiredY + 10;
    } else {
      requiredLabelY = requiredY - 42;
      proposedLabelY = proposedY + 10;
    }
  }

  return `
    <div class="chart-card">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Margin hurdle chart">
        <rect x="0" y="0" width="${width}" height="${height}" rx="10" fill="rgba(255,255,255,0.6)"></rect>
        ${buildAxesMarkup({
          width,
          height,
          margin,
          xTicks: tickScores,
          yTicks,
          xScaleFn: x,
          yScaleFn: y,
          xLabel: 'Project risk score',
          yLabel: 'Required margin'
        })}
        <polyline fill="none" stroke="#2b4c7e" stroke-width="4" points="${linePoints}"></polyline>
        <circle cx="${x(minScore)}" cy="${y(requiredMargin(safe, typical, minScore))}" r="6" fill="#2b4c7e" stroke="#fff" stroke-width="2"></circle>
        <circle cx="${requiredX}" cy="${requiredY}" r="7" fill="#cb8922" stroke="#fff" stroke-width="2"></circle>
        ${buildChartPill({
          x: labelX,
          y: requiredLabelY,
          text: `Required ${required.toFixed(1)}%`,
          color: '#cb8922',
          stroke: 'rgba(203,137,34,0.22)',
          anchor: labelAnchor,
          chartWidth: width,
          chartHeight: height
        })}
        ${Number.isFinite(proposed) ? `
          <line x1="${requiredX}" y1="${requiredY}" x2="${requiredX}" y2="${proposedY}" stroke="#a04a3a" stroke-width="2" stroke-dasharray="6 5"></line>
          <circle cx="${requiredX}" cy="${proposedY}" r="7" fill="#426347" stroke="#fff" stroke-width="2"></circle>
          ${buildChartPill({
            x: labelX,
            y: proposedLabelY,
            text: `Proposed ${proposed.toFixed(1)}%`,
            color: '#426347',
            stroke: 'rgba(58,125,92,0.20)',
            anchor: labelAnchor,
            chartWidth: width,
            chartHeight: height
          })}
        ` : ''}
      </svg>
      <div class="chart-legend" aria-hidden="true">
        <span class="chart-legend-item"><span class="chart-legend-line"></span> Required margin line</span>
        <span class="chart-legend-item"><span class="chart-legend-dot chart-legend-dot-required"></span> Required margin at this risk score</span>
        ${Number.isFinite(proposed) ? '<span class="chart-legend-item"><span class="chart-legend-dot chart-legend-dot-proposed"></span> Proposed margin</span>' : ''}
      </div>
      <div class="chart-note">This project scored <strong>${score}/35</strong>. Lower scores are safer. Higher scores mean more risk, so the minimum acceptable margin rises.</div>
    </div>
  `;
}

function renderTweakPanel() {
  return `
    <div class="tweak-panel">
      <h3 class="results-section-title">Try a few adjustments</h3>
      <div class="tweak-grid">
        <div class="tweak-field">
          <label for="tweak-safeMargin">Safe-work margin (%)</label>
          ${renderMarginInput({ id: 'tweak-safeMargin', value: state.baseline.safeMargin, placeholder: '10', tweak: 'safeMargin' })}
        </div>
        <div class="tweak-field">
          <label for="tweak-typicalMargin">Typical project margin (%)</label>
          ${renderMarginInput({ id: 'tweak-typicalMargin', value: state.baseline.typicalMargin, placeholder: '22', tweak: 'typicalMargin' })}
        </div>
        <div class="tweak-field">
          <label for="tweak-dealPrice">Quoted project price</label>
          <input id="tweak-dealPrice" data-tweak="dealPrice" inputmode="decimal" value="${state.commercial.dealPrice}">
        </div>
        <div class="tweak-field">
          <label for="tweak-deliveryCost">Estimated delivery cost</label>
          <input id="tweak-deliveryCost" data-tweak="deliveryCost" inputmode="decimal" value="${state.commercial.deliveryCost}">
        </div>
      </div>
      <div class="tweak-help">Change these inputs to see how the hurdle, gap, and recommendation move.</div>
    </div>
  `;
}

function renderWelcome() {
  return `
    <section class="card">
      ${renderProgress('welcome')}
      <h2 class="step-title">How should we price this project?</h2>
      <p class="step-copy">This tool helps small agencies check how risky a project is, what margin it should clear, and whether the current quote fits that risk. You will answer a few questions, then get a required margin, a recommendation, and a simple result view.</p>
      ${renderNav({ back: 'how-it-works', next: 'baseline-safe', nextLabel: 'Start', backLabel: 'How it works' })}
    </section>
  `;
}

function renderBaseline(route) {
  const question = baselineQuestions.find((item) => item.route === route.path);
  const value = state.baseline[question.id];
  return `
    <section class="card">
      ${renderPhaseNav(route.path)}
      ${renderProgress(route.path)}
      <h2 class="step-title">${question.title}</h2>
      <p class="step-copy">${question.help}</p>
      <div class="field">
        <label for="${question.id}">${question.label}</label>
        ${renderMarginInput({ id: question.id, value, placeholder: question.placeholder })}
        <div class="help">${question.why}</div>
        <div class="default-note">These are active default values. Keep them if they fit, or change them.</div>
      </div>
      ${renderNav({ back: prevPath(route.path), next: nextPath(route.path) })}
    </section>
  `;
}

function renderRiskIntro() {
  return `
    <section class="card">
      ${renderPhaseNav('risk-intro')}
      ${renderProgress('risk-intro')}
      <h2 class="step-title">Now let’s score the project risk</h2>
      <p class="step-copy">You’ll answer seven short questions about client, scope, technical uncertainty, capacity, contract structure, stakeholder complexity, and timeline pressure.</p>
      ${renderNav({ back: 'baseline-typical', next: 'risk/client', nextLabel: 'Start project questions' })}
    </section>
  `;
}

function renderRisk(route) {
  const question = riskQuestions.find((item) => `risk/${item.route}` === route.path);
  const selected = state.risk[question.id];
  return `
    <section class="card">
      ${renderPhaseNav(route.path)}
      ${renderProgress(route.path)}
      <h2 class="step-title">${question.title}</h2>
      <p class="step-copy">${question.why}</p>
      <div class="options">
        ${question.options.map((option) => `
          <label class="option">
            <input type="radio" name="${question.id}" value="${option.value}" ${selected === option.value ? 'checked' : ''}>
            <strong>${option.title}</strong>
            <div>${option.desc}</div>
          </label>
        `).join('')}
      </div>
      ${renderNav({ back: prevPath(route.path), next: nextPath(route.path) })}
    </section>
  `;
}

function renderCommercial() {
  return `
    <section class="card">
      ${renderPhaseNav('commercial')}
      ${renderProgress('commercial')}
      <h2 class="step-title">Now enter the current quote</h2>
      <p class="step-copy">Use your best current numbers. You can adjust them later on the results screen.</p>
      ${commercialFields.map((field) => `
        <div class="field">
          <label for="${field.id}">${field.label}</label>
          <input id="${field.id}" name="${field.id}" inputmode="decimal" value="${state.commercial[field.id]}" placeholder="${field.placeholder}">
          <div class="help">${field.help}</div>
        </div>
      `).join('')}
      ${renderNav({ back: 'risk/timeline', next: 'results', nextLabel: 'See results' })}
    </section>
  `;
}

function renderResults() {
  const safe = parseFloat(state.baseline.safeMargin);
  const typical = parseFloat(state.baseline.typicalMargin);
  const price = parseFloat(state.commercial.dealPrice);
  const cost = parseFloat(state.commercial.deliveryCost);
  const score = totalRiskScore(state);
  const required = requiredMargin(safe, typical, score);
  const proposed = proposedMargin(price, cost);
  const gapValue = gap(proposed, required);
  const floor = priceFloor(cost, required);
  const recommendation = getRecommendation({
    scores: state.risk,
    requiredMargin: required,
    proposedMargin: proposed,
    gap: gapValue,
    priceFloorExceedsQuote: Number.isFinite(floor) && Number.isFinite(price) ? floor > price : false
  });
  const gapText = gapValue === null ? '—' : `${gapValue > 0 ? '+' : ''}${gapValue} pts`;
  const proposedText = proposed === null ? '—' : `${proposed}%`;
  const requiredText = `${required}%`;
  const riskBand = score <= 14 ? 'Lower risk' : score <= 21 ? 'Moderate risk' : score <= 28 ? 'Higher risk' : 'Very high risk';
  const riskBandClass = score <= 14 ? 'risk-band-low' : score <= 21 ? 'risk-band-medium' : score <= 28 ? 'risk-band-high' : 'risk-band-severe';
  const priceText = Number.isFinite(price) ? '$' + Math.round(price).toLocaleString() : '—';
  const costText = Number.isFinite(cost) ? '$' + Math.round(cost).toLocaleString() : '—';

  return `
    <section class="card">
      ${renderPhaseNav('results')}
      ${renderProgress('results')}
      <h2 class="step-title">Here’s the risk check</h2>
      <p class="step-copy">This is the current recommendation based on your baseline margins, project risk answers, and quote.</p>
      <div class="result-edit-links">
        <button class="result-edit-link" data-nav="baseline-safe">Edit baseline margins</button>
        <button class="result-edit-link" data-nav="risk-intro">Edit project risk</button>
        <button class="result-edit-link" data-nav="commercial">Edit commercial inputs</button>
      </div>
      <div class="results-grid">
        <div class="metric metric-risk ${riskBandClass}">
          <span class="metric-label">Risk score</span>
          <div class="metric-value">${score}/35</div>
          <div class="metric-band">${riskBand}</div>
          <div class="metric-subtext">Lower is safer. Higher means more project risk.</div>
        </div>
        <div class="metric">
          <span class="metric-label">Required margin</span>
          <div class="metric-value">${requiredText}</div>
          <div class="metric-subtext">The minimum margin this quote should clear at this level of risk.</div>
        </div>
        <div class="metric">
          <span class="metric-label">Proposed margin</span>
          <div class="metric-value">${proposedText}</div>
          <div class="metric-subtext">What the current quote would return based on price and estimated cost.</div>
        </div>
        <div class="metric">
          <span class="metric-label">Margin gap</span>
          <div class="metric-value">${gapText}</div>
          <div class="metric-subtext">How far above or below the required margin the current quote sits.</div>
        </div>
        <div class="metric">
          <span class="metric-label">Price floor</span>
          <div class="metric-value">${Number.isFinite(floor) ? '$' + Math.round(floor).toLocaleString() : '—'}</div>
          <div class="metric-subtext">The minimum quote needed to clear the required margin with this cost estimate.</div>
        </div>
        <div class="metric"><span class="metric-label">Recommendation</span><div class="metric-value">${recommendation.headline}</div></div>
      </div>
      <div class="results-section">
        <div class="recommendation-card recommendation-card-${recommendation.tone}">
          <div class="recommendation-kicker">${riskBand}</div>
          <h3 class="recommendation-title">${recommendation.headline}</h3>
          <p class="step-copy recommendation-copy">${recommendation.why.join(' ')}</p>
          <div class="recommendation-callout">
            <div class="recommendation-callout-title">Commercial inputs</div>
            <div class="recommendation-callout-grid">
              <div class="recommendation-callout-item">
                <span class="recommendation-callout-label">Quoted price</span>
                <strong>${priceText}</strong>
              </div>
              <div class="recommendation-callout-item">
                <span class="recommendation-callout-label">Estimated delivery cost</span>
                <strong>${costText}</strong>
              </div>
            </div>
          </div>
          <ul class="recommendation-list">${recommendation.nextSteps.map((step) => `<li>${step}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="results-section">
        <h3 class="results-section-title">The Line</h3>
        ${renderSimpleChart({ required, proposed, score })}
        <div class="chart-help"><strong>How to read it:</strong> lower risk scores are better. As risk rises, the line climbs. Your quote should land above the line, not below it. The proposed point uses the current quoted price and estimated delivery cost shown above.</div>
      </div>
      <div class="results-section">
        ${renderTweakPanel()}
      </div>
      ${renderNav({ back: 'commercial', next: 'welcome', nextLabel: 'Start over', backLabel: 'Edit inputs' })}
    </section>
  `;
}

function renderHowItWorks() {
  return `
    <section class="card">
      <h2 class="step-title">How it works</h2>
      <p class="step-copy">This tool starts with your safest and typical project margins, scores project risk, then checks whether a proposed project quote clears a risk-adjusted margin. This is simplified hurdle-rate logic, not a precise forecasting formula.</p>
      ${renderNav({ back: 'welcome', next: 'baseline-safe', nextLabel: 'Start', backLabel: 'Back' })}
    </section>
  `;
}

function render() {
  const path = getCurrentPath();
  const route = getRoute(path);

  if (route.type === 'baseline') app.innerHTML = renderBaseline(route);
  else if (route.type === 'risk') app.innerHTML = renderRisk(route);
  else if (route.path === 'risk-intro') app.innerHTML = renderRiskIntro();
  else if (route.path === 'commercial') app.innerHTML = renderCommercial();
  else if (route.path === 'results') app.innerHTML = renderResults();
  else if (route.path === 'how-it-works') app.innerHTML = renderHowItWorks();
  else app.innerHTML = renderWelcome();

  bind();
}

function bind() {
  app.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-nav');
      navigate(target);
    });
  });

  app.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.risk[input.name] = parseInt(input.value, 10);
      saveState(state);
    });
  });

  app.querySelectorAll('[data-step-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-step-target');
      const dir = parseInt(button.getAttribute('data-step-dir') || '0', 10);
      const input = document.getElementById(target);
      if (!input || !Number.isFinite(dir)) return;

      const fallback = input.getAttribute('placeholder') || '0';
      const current = parseInt(input.value || fallback, 10) || 0;
      const next = Math.max(0, current + dir);
      input.value = String(next);

      if (target in state.baseline) state.baseline[target] = input.value;
      if (target === 'tweak-safeMargin') state.baseline.safeMargin = input.value;
      if (target === 'tweak-typicalMargin') state.baseline.typicalMargin = input.value;

      saveState(state);
      if (getCurrentPath() === 'results' && target.startsWith('tweak-')) render();
    });
  });

  app.querySelectorAll('input:not([type="radio"])').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.id in state.baseline) state.baseline[input.id] = input.value;
      if (input.id in state.commercial) state.commercial[input.id] = input.value;
      if (input.dataset.tweak === 'safeMargin') state.baseline.safeMargin = input.value;
      if (input.dataset.tweak === 'typicalMargin') state.baseline.typicalMargin = input.value;
      if (input.dataset.tweak === 'dealPrice') state.commercial.dealPrice = input.value;
      if (input.dataset.tweak === 'deliveryCost') state.commercial.deliveryCost = input.value;
      saveState(state);
      if (getCurrentPath() === 'results' && input.dataset.tweak) render();
    });
  });

  app.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = button.getAttribute('data-nav');
      const path = getCurrentPath();
      if (path === 'baseline-typical' && target === 'risk-intro') {
        const message = validateBaseline(state);
        if (message) {
          event.preventDefault();
          alert(message);
        }
      }
      if (path.startsWith('risk/') && target === nextPath(path)) {
        const route = getRoute(path);
        if (!state.risk[route.id]) {
          event.preventDefault();
          alert('Choose one answer before continuing.');
        }
      }
      if (path === 'commercial' && target === 'results') {
        const message = validateCommercial(state);
        if (message || !allRiskQuestionsAnswered(state)) {
          event.preventDefault();
          alert(message || 'Finish all risk questions first.');
        }
      }
    });
  });
}

window.addEventListener('hashchange', render);
render();
