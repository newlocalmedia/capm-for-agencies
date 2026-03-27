# Roadmap

## Current state

CAPM for Agencies is now a usable public beta with:

- Decision Cards on the main app page
- persistence and reset behavior
- practical walkthrough, decision guide, theory, calibration notes, and discovery essay pages
- export, accessibility improvements, and core calculator tests
- clearer reading-order guidance across the app and reader pages
- CI that now authenticates static-page Markdown rendering with `GITHUB_TOKEN`

The next phase is no longer basic usability. It is **coherence, hardening, and contributor clarity**.

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

## Delivery method

Continue to use:

- **GSD** for phase structure and verification
- **BDD-style acceptance criteria** for user-facing flows
- **TDD** for calculator logic and regression coverage

## Active roadmap

### Phase 1 — Documentation and navigation coherence

**Goal:** Keep the reading path obvious as the docs set evolves.

**Current status:**
- the app, overview, and generated reader pages now surface a clearer reading order
- calibration notes, decision guide, and the discovery essay are linked more directly from the main navigation
- the discovery essay is better integrated with the core pricing thesis

**Remaining scope:**
- keep the planning docs current as features ship
- keep the reading ladder coherent as new pages or examples are added
- avoid letting companion material drift back into side-essay territory

### Phase 2 — In-app clarity and decision guidance

**Goal:** Keep the app understandable without adding product bloat.

**Current status:**
- Layer 1 → Layer 2 → Layer 3 dependency is now reinforced visually in the cards
- the chart now has a plain-language explanation in the app
- one-decimal display is now framed explicitly as visible guidance rather than exact science

**Remaining scope:**
- evaluate whether the app still needs per-card entry hints beyond the primer
- decide whether lightweight undo or per-card clear behavior is worth the extra UI weight
- keep an eye out for any remaining confusing formula or chart copy

### Phase 3 — Model clarity and calibration decisions

**Goal:** Reduce confusion around heuristic choices and tighten model presentation.

**Problems to solve:**
- the fixed `3`-point caution band has now been reviewed against proportional alternatives and is being kept for now
- the UI still presents one-decimal output that may imply more precision than the inputs warrant
- the current precision notes may still need a cleaner long-term presentation

**Scope:**
- document the current caution-band decision and revisit it once retrospective data exists
- decide whether the main UI should round display values more aggressively
- keep the theory and UI aligned on what is heuristic versus measured
- revisit whether the current precision note is enough once more users have seen the calculator

### Phase 4 — Build and architecture hardening

**Goal:** Make the repo easier to maintain and less dependent on fragile infrastructure.

**Problems to solve:**
- static page generation still depends on GitHub’s Markdown API at build time
- `index.html` remains a very large single-file app
- current tests are strong on calculator math but light on UI integration behavior

**Scope:**
- replace the GitHub Markdown API dependency with a local renderer
- evaluate safe extraction of inline app logic into smaller modules
- add DOM-level or browser-level integration coverage for critical app flows

### Phase 5 — Retrospective workflow, if resumed

**Goal:** Resume retrospective mode only when it can be cleanly separated from presales.

**Current status:**
- exploratory work exists on `codex/two-mode`
- `main` intentionally keeps the simpler presales-first workflow

**Scope:**
- preserve original presales state as a baseline record
- keep retrospective data separate
- support explicit re-score / calibration reflection later

## Definition of done for the next meaningful release

A next release should ideally include:

- clearer doc navigation and reading-order guidance
- at least one user-facing improvement to card dependency/chart clarity
- a documented decision on false precision or caution-band behavior
- either a local Markdown renderer or a clearly staged plan to replace the external dependency
- updated roadmap/backlog notes that match the shipped state
