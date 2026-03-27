# Roadmap

## Current state

CAPM for Agencies is now a usable public beta with:

- Decision Cards on the main app page
- persistence and reset behavior
- practical walkthrough, decision guide, theory, calibration notes, and discovery essay pages
- export, accessibility improvements, and core calculator tests
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

**Goal:** Make the reading path and page relationships obvious.

**Problems to solve:**
- `ROADMAP.md` and `BACKLOG.md` had drifted behind the actual product state
- the main docs cluster is broader than the top nav suggests
- the discovery essay still risks feeling adjacent rather than structurally tied to the `price before you plan` thesis

**Scope:**
- keep the planning docs current as features ship
- define and surface a clearer reading order across overview, walkthrough, decision guide, theory, calibration notes, and discovery essay
- tighten cross-links so every major page is reachable from the app or overview
- continue integrating the discovery essay with the core pricing thesis

### Phase 2 — In-app clarity and decision guidance

**Goal:** Reduce avoidable user confusion without adding product bloat.

**Problems to solve:**
- Layer 1 → Layer 2 → Layer 3 dependency is still mostly explained in text rather than reinforced visually
- the chart still assumes more theory context than some users will have
- there is no lightweight undo for score changes

**Scope:**
- add clearer dependency cues between cards
- explain the chart inline in plain language
- evaluate whether the app needs per-card entry hints beyond the primer
- consider lightweight undo or per-card clear behavior if it can be added cleanly

### Phase 3 — Model clarity and calibration decisions

**Goal:** Reduce confusion around heuristic choices and tighten model presentation.

**Problems to solve:**
- the fixed `3`-point caution band may be proportionally too forgiving on risky deals
- the UI still presents one-decimal output that may imply more precision than the inputs warrant
- B-Corp midpoint assumptions are mathematically sound but need clearer contributor-facing documentation

**Scope:**
- review absolute vs relative caution-band behavior
- decide whether the main UI should round display values more aggressively
- document B-Corp midpoint constants in code and docs more explicitly
- keep the theory and UI aligned on what is heuristic versus measured

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
