# Backlog

## Current priorities

This backlog tracks work that is still meaningfully open. Completed adoption basics (persistence, reset, walkthrough, initial CI, accessibility pass, export, overview/theory cleanup) have been archived out of the active list.

## P1 — Current

### [P1] Replace GitHub Markdown API dependency with a local renderer

**Outcome:** Static page builds become deterministic and CI no longer depends on external network access or GitHub API limits.

**Tasks:**
- replace the build-time GitHub Markdown API call with a local Markdown renderer
- preserve heading normalization, token replacement, and generated-page output expectations
- confirm generated pages remain stable in CI without network access
- remove any no-longer-needed auth assumptions from the build

### [P1] Keep doc navigation coherent as the page set grows

**Outcome:** The docs continue to feel like one reading ladder rather than drifting back into a loose set of pages.

**Tasks:**
- keep the recommended order visible as new pages or examples are added
- ensure the app and overview continue to link to all major pages that matter
- keep companion material tied to the core pricing thesis

## P2 — Next

### [P3] Revisit the caution band after retrospective data exists

**Outcome:** The current fixed `3`-point band can be confirmed or revised with real outcome data rather than thought experiments alone.

**Current status:**
- a review against `10%` and `12%` proportional alternatives was completed
- the current fixed `3`-point band was kept because it is simpler and already stricter on higher-risk work

**Tasks:**
- compare actual presales calls against realized outcomes once retrospective data exists
- check whether the caution band should vary by risk level in practice, not just in theory
- update docs and tests if a new rule proves better

### [P2] Reduce false precision in the main UI

**Outcome:** The UI presentation better matches the heuristic nature of the model.

**Current status:**
- the app keeps one-decimal outputs so small changes remain visible
- the current UI now labels those outputs as directional guidance rather than exact science

**Tasks:**
- review whether the main app should display whole-number percentages instead of one-decimal outputs
- keep internal calculations precise enough for stable comparisons
- document any rounding choices explicitly

### [P2] Add stronger calculator integration tests

**Outcome:** App wiring and DOM behavior are covered, not just pure math.

**Tasks:**
- add tests for app-to-DOM calculation flows
- cover export behavior more behaviorally where possible
- add more edge-case tests around invalid inputs and UI state

## P3 — Later

### [P3] Break up the single-file app architecture

**Outcome:** The main app becomes easier to review, test, and maintain.

**Tasks:**
- identify safe extraction boundaries for inline JS and CSS
- move more UI logic into separate files without adding unnecessary build complexity
- preserve the simplicity of the static-site deployment model

### [P3] Add lightweight undo / per-card clearing

**Outcome:** Users can recover from accidental score changes without resetting everything.

**Tasks:**
- decide between last-change undo, per-card reset, or both
- keep the behavior simple enough for live presales use

### [P3] Resume two-mode presales vs retrospective workflow

**Outcome:** Retrospective analysis can return without muddying the presales workflow.

**Tasks:**
- continue work from `codex/two-mode`
- preserve the original presales snapshot separately from retrospective inputs
- add explicit edit/re-score behavior instead of silent state sharing

## Archived / completed

These items are no longer active backlog work:

- persistence and reset
- card dependency cues and chart explanation
- B-Corp midpoint constants clarified in code and docs
- initial caution-band review completed; fixed `3`-point band retained for now
- first-use defaults
- walkthrough page
- decision guide and calibration notes
- export flow
- initial CI setup and authenticated build fix
- social sharing / sitemap / robots / structured data
- initial accessibility pass and keyboard semantics improvements
- major copy cleanup across app, overview, theory, and companion essay
