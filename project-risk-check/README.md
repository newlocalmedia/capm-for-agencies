# Agency Deal Risk Check

Staging scaffold for a simpler, SMB-focused guided version of CAPM for Agencies.

This lives inside the main repo for now so it can be reviewed and evolved, but it is intended to become a separate repository later.

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

## Current scaffold

- `index.html` — app shell
- `scripts/questions.js` — baseline, risk, and commercial question data
- `scripts/recommendations.js` — first-pass recommendation rules
- `scripts/state.js` — app state shape and validation helpers
- `scripts/routes.js` — route map and step metadata
- `scripts/calc-core.js` — simplified shared calculation helpers
- `styles/app.css` — starter UI styles

## Split to a new repo later

When ready:

1. copy this directory into a new repository
2. keep only the files inside this folder
3. wire up tests and CI
4. iterate separately from the main CAPM for Agencies product
