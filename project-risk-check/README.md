# Project Risk Check

A simpler, SMB-focused guided version of CAPM for Agencies that lives inside the main repo as a second app path.

## Goal

Help small agencies answer:

- Is this project risky?
- What margin should we require?
- Does the quote clear the hurdle?
- Should we go, reprice, sell discovery first, or walk away?

## Product shape

- one-question-at-a-time wizard
- plain-language explanations
- small-agency framing
- results page with chart, hurdle, recommendation, and tweakable inputs

## Alignment with the main app

This app intentionally keeps the **same core hurdle math** as the main Decision Cards hybrid model when Layer 1 is treated as neutral (`1.00`):

- `Engagement β = project score / 21`
- `Required margin = safe-work margin + β × (typical project margin − safe-work margin)`
- proposed margin, margin gap, and price floor use the same underlying formulas

What is different here is the **guidance layer**:

- this app is more opinionated about when to recommend `Sell discovery first`
- it also uses plainer language and a more guided workflow for smaller agencies

So the formula logic should stay aligned, while the UX and recommendation framing can stay simpler and more direct.

## Current files

- `index.html` — app shell
- `scripts/questions.js` — baseline, risk, and commercial question data
- `scripts/recommendations.js` — first-pass recommendation rules
- `scripts/state.js` — app state shape and validation helpers
- `scripts/routes.js` — route map and step metadata
- `../scripts/shared-calc-core.mjs` — canonical shared calculation helpers used by both apps
- `styles/app.css` — starter UI styles
- `tests/` — lightweight calculation, recommendation, state/route, and DOM smoke tests

## Tests

Run from this directory:

```bash
npm test
```

Current coverage includes:

- calculation helpers
- recommendation logic
- validation and route helpers
- basic DOM wizard / results / tweak-panel flows

## Shared calc core

The formula logic now uses one canonical shared module:

- `../scripts/shared-calc-core.mjs`

`project-risk-check/` imports that module directly. The main app still uses `scripts/calc-core.js`, but that file is now a thin generated compatibility wrapper around the same shared source.

This keeps:

- one source of truth for the formulas
- app-specific recommendation logic separate
- parity testable across both app paths
