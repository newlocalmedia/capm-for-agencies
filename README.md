# CAPM for Agencies — Decision Cards

Interactive two-layer risk assessment tools for agency project pricing, based on the Capital Asset Pricing Model (CAPM) adapted from financial economics.

**Try it here:** https://newlocalmedia.github.io/capm-for-agencies/

## What is this?

Most agencies price risk through gut-feel contingency percentages or hourly padding. The CAPM framework gives you a principled, portfolio-aware approach by separating **systematic risk** (forces that hit your whole book of work) from **idiosyncratic risk** (project-specific variables that wash out across engagements).

These decision cards implement a two-layer risk assessment. In the pure portfolio-level use, the framework stays closer to CAPM as a hurdle-rate model. In the hybrid engagement-level use, it should be treated as heuristic pricing governance rather than a literal asset-pricing engine.

As a rough fit:
- enterprise and international agencies will usually find the pure approach easier to justify
- small and mid-sized agencies will usually get more immediate value from the hybrid approach

### Layer 1: Systematic Risk Calibration
A periodic strategic review (quarterly or on market shift) that scores portfolio-level risk factors: platform stability, talent market, economic conditions, regulatory exposure, revenue concentration, and rate pressure. Produces a systematic adjustment factor that sets the environment for all engagement pricing. Use the [Layer 1 card](./index.html#layer1-card).

### Layer 2: Engagement Risk Scoring
A per-engagement assessment during presales that scores project-specific factors: client track record, scope clarity, technical complexity, internal capacity, contract type, political complexity, and timeline pressure. Combined with the Layer 1 factor, it produces a minimum acceptable margin via the CAPM formula, which then needs to be compared against the proposed deal margin. Use the [Layer 2 card](./index.html#layer2-card).

### B Corp Impact Overlay
An additional impact-governance pass for mission-driven agencies. It extends the base model with B Lab-aligned portfolio and engagement factors, then shows how the impact adjustment shifts the standard hurdle from `E(R)` to `E(R*)`. Use the [B Corp card](./index.html#bcorp-card).

## Usage

### Interactive (browser)
Visit the hosted version and click to score each factor. The calculators update in real time. The interactive decision cards live in `index.html`.

### Printable (PDF)
Download reference cards from the `pdf/` directory:
- `capm-decision-cards.pdf` — All cards
- `capm-layer1-systematic-risk.pdf` — Systematic risk card only.
- `capm-layer2-engagement-risk.pdf` — Engagement risk card only.
- `capm-b-corp-engagement-risk.pdf` — B Corp impact-adjusted risk card only.

### Text Overview
A text-first landing page lives in `overview/index.html`.

### Worked Walkthrough
A short practical walkthrough of one realistic agency deal lives in `tldr/walkthrough.html`.

### Theory and Background
The long-form theory text and commentary live in `theory/capm-for-agencies.md`.

### Calibration Notes
A deeper implementation note for the current scoring ranges, scenario tests, and calibration choices lives in `tldr/calibration-notes.html`.

### Retrospective Mode Design
The current design note for postmortem scoring and calibration lives in [RETROSPECTIVE-MODE.md](./RETROSPECTIVE-MODE.md).


## The Formula

**E(R) = Rf + β × (Rm − Rf)**

In agency terms:

**Minimum Margin = Base Margin + (Engagement β × Layer 1 factor) × Risk Premium**

Where:

- `Engagement β = Engagement Score / 21`
- `Blended β = Engagement β × Layer 1 factor`

This midpoint-anchored mapping is a deliberate design choice. A neutral Layer 2 engagement score maps to market-like `β = 1.0`, rather than forcing the low end to `β = 0`. That prevents zero-risk pricing while preserving more headroom for difficult deals.

In the current decision-card calibration, the Layer 1 adjustment factor is centered on `1.00` at the midpoint score, and the B Corp overlay uses a neutral midpoint plus moderate widening or narrowing of the impact adjustment rather than an aggressive default amplification. Neutral operational engagement risk maps to market-like beta, and neutral B Corp impact maps to no mission discount or harm premium. See the [calibration notes](./tldr/calibration-notes.html).

## What this is good for

- Internal alignment across sales, solutions, delivery, and leadership.
- Presales discipline before committing to risky work.
- Postmortem calibration by comparing required margin, proposed margin, and realized outcomes.

This repo is most useful as a shared language for risk naming and deal governance. It is not a quantitatively correct pricing engine on its own.

## Adoption Notes

The strongest adoption barriers right now are practical, not theoretical:

- many agencies still rely on relationship judgment and founder instinct, so the framework only works if leadership agrees to use it
- new users may not have enough historical margin data to calibrate `R_f`, `R_m`, and Layer 1 confidently
- a standalone static tool is harder to adopt than something that fits into existing CRM, spreadsheet, or presales workflows
- the CAPM framing signals rigor to some readers and “not for me” to others

The strongest adoption accelerators are:

- a simple first-use path with explicit defaults
- retrospective scoring and backtesting against completed projects
- lightweight integrations or exports into tools teams already use
- real case studies showing agencies using the framework successfully

## Hosting

This repo is configured for GitHub Pages. Enable Pages in your repo settings with source set to the root (`/`) of the `main` branch.

## Development

The repo now includes a small test and verification layer:

- `npm test` runs calculator regression tests
- `npm run check:app` parses the inline app script and checks that the shared calculation module is wired in
- `npm run build:static` regenerates the theory and TL;DR HTML pages
- `npm run check:generated` fails if the generated pages are out of sync with the committed outputs
- `npm run ci` runs the full local verification sequence used in GitHub Actions

See [CHANGELOG.md](./CHANGELOG.md) for notable changes.

## License

This repository is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License (CC-BY-SA-4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

## Credits

Dan Knauss • March 2026

Based on *CAPM for Agencies: The Capital Asset Pricing Model Applied to Agency Project Pricing and Risk Assessment*.
