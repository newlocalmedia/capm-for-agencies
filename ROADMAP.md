# Roadmap

## Current state

CAPM for Agencies is now a usable public beta with:

- Decision Cards on the main app page
- a second guided app for smaller agencies in `project-risk-check/`
- persistence and reset behavior
- practical walkthrough, decision guide, theory, calibration notes, and discovery essay pages
- export, accessibility improvements, and core calculator tests
- clearer reading-order guidance across the app and reader pages
- more specific Layer 2 / Layer 3 commercial-input guidance
- CI that now installs a local Markdown renderer for static page generation
- DOM integration tests for key Layer 2, warning, reset, and persistence flows
- a snapshot-first retrospective workflow with frozen presales baselines, actual-outcome comparison, Layer 2 re-score, and retrospective export

The next phase is no longer basic usability. It is **hardening, maintainability, evidence-building, and keeping the two app paths coherent**.

## Archived / completed foundation work

These are complete enough to move out of the active roadmap:

- first public beta and follow-up patch releases
- persistence and `Reset all`
- first-use defaults
- walkthrough page
- decision guide and calibration notes
- social metadata / sitemap / robots / structured data
- app export flow
- major copy and IA cleanup across app + docs
- accessibility-first pass and keyboard semantics improvements
- initial CI and regression-test setup
- first retrospective-mode exploration and branch split (`codex/two-mode`)
- initial caution-band review and fixed-band decision
- app dependency cues, chart help, and precision framing
- local Markdown renderer for static page generation
- first jsdom-based DOM integration test layer
- snapshot-first retrospective workflow on `main`
- first standalone guided-app path moved into `project-risk-check/`

## Delivery method

Continue to use:

- **GSD** for phase structure and verification
- **BDD-style acceptance criteria** for user-facing flows
- **TDD** for calculator logic and regression coverage

## Active roadmap

### Phase 1 — Build and architecture hardening

**Goal:** Make the repo easier to maintain now that it contains both the full Decision Cards app and the simpler guided app.

**Current status:**
- static page generation now uses a local Markdown renderer instead of GitHub’s API
- generated-page verification now covers the walkthrough and discovery essay pages too
- key calculator flows now have DOM-level integration coverage in jsdom
- `index.html` is still a very large single-file app
- `project-risk-check/` is now a second app path with its own lightweight tests

**Remaining scope:**
- evaluate safe extraction of inline app logic into smaller modules
- add a smaller browser-smoke layer if jsdom leaves important behavior unverified
- keep generated-page output stable as the local renderer evolves
- decide how much calculation logic should remain shared in practice across the two app paths

### Phase 2 — Precision, presentation, and trust

**Goal:** Keep the live calculator responsive without overstating certainty.

**Current status:**
- the app keeps one-decimal outputs so small changes remain visible
- the UI now frames those outputs as directional guidance rather than exact science
- the fixed `3`-point caution band has been reviewed against proportional alternatives and is being kept for now

**Remaining scope:**
- decide whether any outputs should move to whole-number display in specific contexts
- revisit whether the current precision note is enough once more users have used the calculator
- revisit the caution-band rule only when retrospective data exists

### Phase 3 — Documentation coherence and evidence-building

**Goal:** Keep the docs coherent and start building stronger evidence for the model’s choices.

**Current status:**
- the app, overview, and generated reader pages now surface a clearer reading order
- calibration notes, decision guide, and the discovery essay are linked more directly from the main navigation
- the discovery essay is better integrated with the core pricing thesis

**Remaining scope:**
- keep the reading ladder coherent as new pages or examples are added
- avoid letting companion material drift back into side-essay territory
- add more retrospective or case-based evidence now that the workflow exists on `main`
- explain the relationship between the full Decision Cards app and the simpler guided `project-risk-check/` app without making the repo feel split-brain

### Phase 5 — Guided app productization

**Goal:** Turn `project-risk-check/` from a staged companion app into a stable second entry point for the repo.

**Current status:**
- `project-risk-check/` now exists inside the main repo
- it already has:
  - a guided one-question-at-a-time flow
  - a simpler results screen with chart and tweak panel
  - recommendation logic
  - lightweight tests for calculations, recommendation rules, state, and routes

**Scope:**
- decide how and where the guided app should be linked from the main site
- add a small DOM smoke layer for the guided flow if it continues to evolve
- keep the language and recommendation logic aligned with the main app where alignment matters
- decide whether it should eventually share more code with the main calculator core or intentionally diverge

### Phase 4 — Retrospective evidence and refinement

**Goal:** Turn the shipped retrospective workflow into a stronger calibration and postmortem tool.

**Current status:**
- `main` now includes:
  - snapshot-first retrospective entry
  - frozen presales baselines
  - actual revenue / actual cost comparison
  - Layer 2 retrospective re-score
  - retrospective HTML export
- the core UX direction is now proven and test-covered

**Scope:**
- refine the recommendation/takeaway logic with real usage feedback
- decide whether the original presales baseline should stay always visible or become optionally collapsible later
- add stronger evidence loops, example postmortems, or saved-history support if needed
- revisit the caution band and other calibration choices when actual retrospective data accumulates

## Definition of done for the next meaningful release

A next release should ideally include:

- stronger DOM-level or browser-level coverage for key calculator flows
- or a conscious decision that the current jsdom layer is enough for this static app
- a cleaner decision on long-term precision presentation in the live UI
- a clearer staged plan for safely shrinking the main app architecture
- retrospective workflow polish informed by real review/export use
- clearer positioning and navigation for the new `project-risk-check/` path
- updated roadmap/backlog notes that continue to match the shipped state
