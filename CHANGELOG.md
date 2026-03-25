# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a lightweight, date-free changelog for now.

## [Unreleased]

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
