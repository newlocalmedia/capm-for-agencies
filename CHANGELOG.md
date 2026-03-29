# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a lightweight, date-free changelog for now.

## [Unreleased]

### Added
- Clearer reading-order guidance across the app, overview, and generated reader pages so the docs now behave more like a deliberate ladder than a loose set of links.
- Page-level `Reading order` guidance in generated reader-page mastheads.
- A documented caution-band review in the calibration notes comparing the fixed `3`-point rule against `10%` and `12%` proportional alternatives.
- A local Markdown renderer for static page generation, plus `requirements.txt` and CI installation for the Python build dependency.
- A jsdom-based DOM integration test layer covering live Layer 2 calculator updates, missing-input warnings, reset behavior, and persistence/restore flows.
- A snapshot-first retrospective workflow on the main app page with:
  - Presales / Retrospective mode switching
  - frozen presales snapshots
  - deal metadata and actual outcome fields
  - Layer 2 retrospective re-scoring
  - retrospective export/report output
- Draft-PR and CI coverage for the retrospective branch, including Node dependency installation in GitHub Actions.
- A second in-repo app path at `project-risk-check/` for smaller agencies that want a simpler guided risk-and-pricing workflow.
- A canonical shared ESM calc core at `scripts/shared-calc-core.mjs`, plus parity tests to keep the main app wrapper and the guided app aligned on shared formulas.

### Changed
- Expanded top navigation from the app to surface the TL;DR, Decision Guide, and Calibration Notes directly.
- Updated the main README, roadmap, backlog, overview page, main app navigation, and generated reader pages to treat `project-risk-check/` as a first-class companion app option.
- Switched `project-risk-check/` to import the shared calc core directly while the main app continues to use a generated compatibility wrapper at `scripts/calc-core.js`.
- Improved Layer 2 and Layer 3 missing-input messages so they now refer to the specific missing commercial field(s), with Layer 3 linking back to the Layer 2 inputs.
- Tightened calculator display rounding so sanitized baseline inputs and manual B Corp overrides no longer leak floating-point noise into visible UI strings.
- Switched static page generation from GitHub’s Markdown API to a local renderer and expanded generated-file verification to cover the walkthrough and discovery essay pages.
- Promoted retrospective comparison into the primary visual review area while keeping original presales inputs visible as a secondary reference.
- Improved retrospective review language with clearer section labels, changed-factor hierarchy, recommendation copy, and a stronger refresh-frozen-snapshot hint.

### Fixed
- Prevented long Layer 2 result subtext from forcing awkward wrapping in the proposed-margin area when large deal figures are displayed.
- Hardened calculator input sanitation so baseline and manual-adjustment values are rounded consistently before reuse.
- Closed the biggest test-gap between pure calculator math and the live app by exercising real DOM state changes instead of only parsing HTML structure.
- Fixed CI for DOM integration coverage by installing Node dependencies before running the test suite.

## [0.1.1]

### Added
- Browser persistence for Decision Card scores and calculator inputs so work restores automatically after reload.
- A top-level `Reset All` flow that clears saved state, restores the first-pass defaults, and disables export again.
- A practical walkthrough in [tldr/CAPM for Agencies — Walkthrough.md](/Users/danknauss/Developer/GitHub/capm-for-agencies/tldr/CAPM%20for%20Agencies%20%E2%80%94%20Walkthrough.md) and [tldr/walkthrough.html](/Users/danknauss/Developer/GitHub/capm-for-agencies/tldr/walkthrough.html).
- A retrospective-mode design note in [RETROSPECTIVE-MODE.md](/Users/danknauss/Developer/GitHub/capm-for-agencies/RETROSPECTIVE-MODE.md) to guide postmortem scoring and calibration work.

### Changed
- Made the first-use path clearer by loading explicit neutral defaults for `R_f`, `R_m`, and the Layer 1 factor so a new user can start with Layer 2 immediately.
- Linked the walkthrough and retrospective-mode design through the app, overview, README, roadmap, and backlog.

### Fixed
- Extended export/persistence regression coverage so the app now tests restore/reset behavior and commercial-input handling more thoroughly.

## [0.1.0]

### Added
- A shared calculation module at [scripts/calc-core.js](/Users/danknauss/Developer/GitHub/capm-for-agencies/scripts/calc-core.js) so the Decision Cards and automated tests use the same formula logic.
- Regression tests for the calculator math in [tests/calculations.test.js](/Users/danknauss/Developer/GitHub/capm-for-agencies/tests/calculations.test.js).
- GitHub Actions CI in [.github/workflows/ci.yml](/Users/danknauss/Developer/GitHub/capm-for-agencies/.github/workflows/ci.yml) to run calculator tests, app syntax checks, static-page generation, and generated-file verification.
- A calibration deep dive in [tldr/CAPM for Agencies — Calibration Notes.md](/Users/danknauss/Developer/GitHub/capm-for-agencies/tldr/CAPM%20for%20Agencies%20%E2%80%94%20Calibration%20Notes.md) and [tldr/calibration-notes.html](/Users/danknauss/Developer/GitHub/capm-for-agencies/tldr/calibration-notes.html).
- Print-ready export previews with charts from the Decision Cards.

### Changed
- Re-centered the Layer 1 systematic adjustment factor so the midpoint score now maps to `1.00`, with the current range set to `0.85` through `1.15`.
- Softened the B Corp overlay so the portfolio midpoint is neutral and the automatic impact adjustment is more moderate.
- Renamed user-facing navigation away from `manuscript` toward `Understand the Theory` and `Theory and Background`.
- Added a plain-language CAPM introduction across the app, overview page, TL;DR, and theory pages.
- Improved the overview and reader pages so the reading path between TL;DR, Decision Guide, and theory is clearer.

### Fixed
- Corrected the main decision logic so verdicts compare actual proposed margin to the hurdle rather than comparing the hurdle to `R_m`.
- Fixed several formula-label and typography inconsistencies, including `R_f`, `R_m`, `E(R)`, and `E(R*)`.
- Fixed stale B Corp overlay state so clearing scores no longer leaves old impact adjustments and verdicts on screen.
- Fixed tooltip behavior so only one small info tip stays open at a time, including for keyboard users.
- Fixed tooltip clipping at card edges.
- Improved accessibility with explicit labels, better focus handling, improved disclosures, and contrast corrections that now produce a clean Lighthouse accessibility score.

### Docs
- Clarified throughout the docs that the hybrid model is heuristic pricing governance rather than a literal asset-pricing engine.
- Strengthened the distinction between presales solutioning, delivery planning, and paid discovery.
- Added enterprise-versus-small-agency guidance across the site.
- Added and regenerated manuscript figures, reader pages, and printable decision-card PDFs.
