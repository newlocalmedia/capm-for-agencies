# Roadmap

## Current state

CAPM for Agencies is now a usable public beta with:

- Decision Cards on the main app page
- persistence and reset behavior
- practical walkthrough, decision guide, theory, calibration notes, and discovery essay pages
- export, accessibility improvements, and core calculator tests
- clearer reading-order guidance across the app and reader pages
- more specific Layer 2 / Layer 3 commercial-input guidance
- CI that now installs a local Markdown renderer for static page generation
- DOM integration tests for key Layer 2, warning, reset, and persistence flows

The next phase is no longer basic usability. It is **hardening, maintainability, and evidence-building**.

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

## Delivery method

Continue to use:

- **GSD** for phase structure and verification
- **BDD-style acceptance criteria** for user-facing flows
- **TDD** for calculator logic and regression coverage

## Active roadmap

### Phase 1 — Build and architecture hardening

**Goal:** Make the repo easier to maintain now that the most fragile build dependency is gone.

**Current status:**
- static page generation now uses a local Markdown renderer instead of GitHub’s API
- generated-page verification now covers the walkthrough and discovery essay pages too
- key calculator flows now have DOM-level integration coverage in jsdom
- `index.html` is still a very large single-file app

**Remaining scope:**
- evaluate safe extraction of inline app logic into smaller modules
- add a smaller browser-smoke layer if jsdom leaves important behavior unverified
- keep generated-page output stable as the local renderer evolves

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
- add more retrospective or case-based evidence when the product supports it

### Phase 4 — Retrospective workflow, if resumed

**Goal:** Resume retrospective mode only when it can be cleanly separated from presales.

**Current status:**
- exploratory work exists on `codex/two-mode`
- `main` intentionally keeps the simpler presales-first workflow

**Scope:**
- freeze presales state into an explicit baseline snapshot before retrospective entry
- promote retrospective comparison to the primary view, with original cards secondary
- include deal metadata, export, and side-by-side re-score in the first meaningful version

## Definition of done for the next meaningful release

A next release should ideally include:

- stronger DOM-level or browser-level coverage for key calculator flows
- or a conscious decision that the current jsdom layer is enough for this static app
- a cleaner decision on long-term precision presentation in the live UI
- a clearer staged plan for safely shrinking the main app architecture
- updated roadmap/backlog notes that continue to match the shipped state
