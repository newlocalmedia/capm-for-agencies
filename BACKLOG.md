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

### [P1] Rewrite doc navigation around a clear reading order

**Outcome:** The docs feel like one intentional reading ladder rather than a loose set of pages.

**Tasks:**
- define the recommended order across Overview, Walkthrough, Decision Guide, Theory, Calibration Notes, and Discovery essay
- ensure the app and overview link to all major pages that matter
- make the lesser-known pages easier to discover without adding clutter

### [P1] Integrate the discovery essay more directly with the core thesis

**Outcome:** `Why Discovery Comes First` reads as part of `price before you plan`, not a side essay.

**Tasks:**
- tighten cross-links to the app and theory where needed
- reinforce that discovery is pricing/governance-relevant, not separate from it
- keep the page focused on when implementation pricing is premature

## P2 — Next

### [P2] Add card dependency cues in the app

**Outcome:** Users can see at a glance how Layer 1, Layer 2, and Layer 3 relate.

**Tasks:**
- visually indicate that Layer 1 feeds Layer 2
- clarify that Layer 3 is an overlay after the financial hurdle
- reinforce entry-point guidance inside or near the cards, not just in the primer

### [P2] Explain the chart inline in plain language

**Outcome:** Users who skip the theory still understand what the chart is showing.

**Tasks:**
- add a compact explanation of what the line means
- explain what it means for a point to clear or miss the hurdle
- avoid assuming familiarity with the security market line

### [P2] Review the caution band

**Outcome:** The `Caution` threshold is either defended as-is or replaced with a better rule.

**Tasks:**
- compare the current fixed `3`-point band against proportional alternatives
- test behavior on low-risk and high-risk deals
- update docs and tests once the rule is settled

### [P2] Reduce false precision in the main UI

**Outcome:** The UI presentation better matches the heuristic nature of the model.

**Tasks:**
- review whether the main app should display whole-number percentages instead of one-decimal outputs
- keep internal calculations precise enough for stable comparisons
- document any rounding choices explicitly

### [P2] Document B-Corp midpoint assumptions more clearly

**Outcome:** Contributors can understand the B-Corp constants without reverse-engineering the math.

**Tasks:**
- make midpoint and span constants explicit in code
- mention the B-Corp engagement midpoint clearly in the theory/calibration docs
- keep B-Corp terminology aligned across app, theory, and tests

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
- first-use defaults
- walkthrough page
- decision guide and calibration notes
- export flow
- initial CI setup and authenticated build fix
- social sharing / sitemap / robots / structured data
- initial accessibility pass and keyboard semantics improvements
- major copy cleanup across app, overview, theory, and companion essay
