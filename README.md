# CAPM for Agencies — Playbook Cards

Interactive two-layer risk assessment tools for agency project pricing, based on the Capital Asset Pricing Model (CAPM) adapted from financial economics.

## What is this?

Most agencies price risk through gut-feel contingency percentages or hourly padding. The CAPM framework gives you a principled, portfolio-aware approach by separating **systematic risk** (forces that hit your whole book of work) from **idiosyncratic risk** (project-specific variables that wash out across engagements).

These playbook cards implement a two-layer risk assessment:

### Layer 1: Systematic Risk Calibration
A periodic strategic review (quarterly or on market shift) that scores portfolio-level risk factors: platform stability, talent market, economic conditions, regulatory exposure, revenue concentration, and rate pressure. Produces a systematic adjustment factor that sets the environment for all engagement pricing.

### Layer 2: Engagement Risk Scoring
A per-engagement assessment during presales that scores project-specific factors: client track record, scope clarity, technical complexity, internal capacity, contract type, political complexity, and timeline pressure. Combined with the Layer 1 factor, it produces a minimum acceptable margin via the CAPM formula.

## Usage

### Interactive (browser)
Visit the hosted version and click to score each factor. The calculators update in real time.

### Printable (PDF)
Download reference cards from the `/pdf` directory:
- `capm-playbook-cards.pdf` — Both cards
- `capm-layer1-systematic-risk.pdf` — Systematic risk card only
- `capm-layer2-engagement-risk.pdf` — Engagement risk card only
- `capm-b-corp-engagement-risk.pdf` — B-Corp impact / risk card only


## The Formula

**E(R) = Rf + β × (Rm − Rf)**

In agency terms:

**Minimum Margin = Base Margin + Blended β × Risk Premium**

Where Blended β = (Engagement Score / 21) × Systematic Adjustment Factor

## Hosting

This repo is configured for GitHub Pages. Enable Pages in your repo settings with source set to the root (`/`) of the `main` branch.

## License

MIT

## Credits

Dan Knauss • March 2026

Based on *CAPM for Agencies: The Capital Asset Pricing Model Applied to Agency Project Pricing and Risk Assessment*.
