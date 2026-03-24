# CAPM for Agencies — Decision Cards

Interactive two-layer risk assessment tools for agency project pricing, based on the Capital Asset Pricing Model (CAPM) adapted from financial economics.

## What is this?

Most agencies price risk through gut-feel contingency percentages or hourly padding. The CAPM framework gives you a principled, portfolio-aware approach by separating **systematic risk** (forces that hit your whole book of work) from **idiosyncratic risk** (project-specific variables that wash out across engagements).

These decision cards implement a two-layer risk assessment. In the pure portfolio-level use, the framework stays closer to CAPM as a hurdle-rate model. In the hybrid engagement-level use, it should be treated as heuristic pricing governance rather than a literal asset-pricing engine.

### Layer 1: Systematic Risk Calibration
A periodic strategic review (quarterly or on market shift) that scores portfolio-level risk factors: platform stability, talent market, economic conditions, regulatory exposure, revenue concentration, and rate pressure. Produces a systematic adjustment factor that sets the environment for all engagement pricing. Use the [Layer 1 card](./index.html#layer1-card).

### Layer 2: Engagement Risk Scoring
A per-engagement assessment during presales that scores project-specific factors: client track record, scope clarity, technical complexity, internal capacity, contract type, political complexity, and timeline pressure. Combined with the Layer 1 factor, it produces a minimum acceptable margin via the CAPM formula, which then needs to be compared against the proposed deal margin. Use the [Layer 2 card](./index.html#layer2-card).

### B-Corp Impact Overlay
An additional impact-governance pass for mission-driven agencies. It extends the base model with B Lab-aligned portfolio and engagement factors, then shows how the impact adjustment shifts the standard hurdle from `E(R)` to `E(R*)`. Use the [B-Corp card](./index.html#bcorp-card).

## Usage

### Interactive (browser)
Visit the hosted version and click to score each factor. The calculators update in real time. The interactive app lives in `index.html`.

### Printable (PDF)
Download reference cards from the `pdf/` directory:
- `capm-decision-cards.pdf` — All cards
- `capm-layer1-systematic-risk.pdf` — Systematic risk card only.
- `capm-layer2-engagement-risk.pdf` — Engagement risk card only.
- `capm-b-corp-engagement-risk.pdf` — B-Corp impact-adjusted risk card only.

### Text Overview
A text-first landing page lives in `overview/index.html`.

### Manuscript
The long-form theory and commentary live in `manuscript/capm-for-agencies.md`.


## The Formula

**E(R) = Rf + β × (Rm − Rf)**

In agency terms:

**Minimum Margin = Base Margin + Blended β × Risk Premium**

Where Blended β = (Engagement Score / 21) × Systematic Adjustment Factor

## What this is good for

- Internal alignment across sales, solutions, delivery, and leadership.
- Presales discipline before committing to risky work.
- Postmortem calibration by comparing required margin, proposed margin, and realized outcomes.

This repo is most useful as a shared language for risk naming and deal governance. It is not a quantitatively correct pricing engine on its own.

## Hosting

This repo is configured for GitHub Pages. Enable Pages in your repo settings with source set to the root (`/`) of the `main` branch.

## License

This repository is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License (CC-BY-SA-4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

## Credits

Dan Knauss • March 2026

Based on *CAPM for Agencies: The Capital Asset Pricing Model Applied to Agency Project Pricing and Risk Assessment*.
