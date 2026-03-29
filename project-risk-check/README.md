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
- `scripts/calc-core.js` — simplified shared calculation helpers
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

## Shared calc core plan

The cleanest way to share the math with the main app is:

1. **Define one canonical pure module**
   - move the shared math into a format-neutral ESM file, for example:
     - `scripts/shared/calc-core.js`

2. **Let each app consume that canonical file**
   - `project-risk-check/` imports it directly
   - the main app either:
     - imports it via a small module wrapper, or
     - keeps a thin compatibility wrapper for the current UMD/global pattern

3. **Keep app-specific logic separate**
   - the main app keeps:
     - Layer 1 helpers
     - B Corp helpers
     - retrospective helpers
   - this app keeps:
     - guided recommendation copy
     - simpler discovery-first / walk-away rules

4. **Prove parity with tests**
   - add a small cross-app parity test for:
     - engagement beta
     - required margin at neutral Layer 1
     - proposed margin
     - gap
     - price floor

That approach keeps the formula aligned without forcing the two UIs to converge.
