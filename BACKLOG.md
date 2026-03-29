# Backlog

## Current priorities

This backlog tracks work that is still meaningfully open. Completed adoption basics (persistence, reset, walkthrough, initial CI, accessibility pass, export, overview/theory cleanup) have been archived out of the active list.

## P1 — Current

### [P1] Decide how the new guided app should be surfaced

**Outcome:** The repo clearly explains when to use the full Decision Cards app versus `project-risk-check/`.

**Current status:**
- the simpler guided app now lives in `project-risk-check/`
- it is tested, but not yet integrated into the main site navigation or hosting story

**Tasks:**
- decide whether to link it from the main homepage, overview, or docs only
- explain its relationship to the full CAPM for Agencies app in a way that feels complementary, not duplicative
- decide whether it should get its own public path or remain a repo-contained companion app

### [P1] Decide whether a browser-smoke layer is still needed

**Outcome:** The test pyramid matches the actual remaining risk after the new jsdom integration coverage.

**Current status:**
- jsdom tests now cover live Layer 2 calculation updates
- reset and persistence/restore flows are exercised in a real DOM
- missing-input warnings are verified behaviorally for Layer 2 and Layer 3

**Tasks:**
- decide whether one or two browser-level smoke tests would still catch risks jsdom cannot
- add only the smallest useful browser layer if it materially improves confidence
- keep the test setup light enough for a static-site repo
- make the same decision explicitly for `project-risk-check/`, which currently has unit-style tests but no DOM/browser flow coverage

### [P1] Refine retrospective workflow from real use

**Outcome:** The shipped retrospective flow becomes easier to use in real team reviews and postmortems.

**Current status:**
- snapshot-first retrospective mode is now on `main`
- original presales inputs stay visible as secondary reference
- export already supports retrospective comparison, changed factors, and recommendations

**Tasks:**
- gather real usage feedback on the recommendation/takeaway block
- decide whether the original presales baseline should remain always visible or become optionally collapsible later
- tighten any rough edges in export readability or changed-factor presentation if they show up in practice

## P2 — Next

### [P2] Reduce false precision in the main UI

**Outcome:** The UI presentation better matches the heuristic nature of the model.

**Current status:**
- the app keeps one-decimal outputs so small changes remain visible
- the current UI now labels those outputs as directional guidance rather than exact science

**Tasks:**
- review whether the main app should display whole-number percentages instead of one-decimal outputs
- keep internal calculations precise enough for stable comparisons
- document any rounding choices explicitly

### [P2] Keep doc navigation coherent as the page set grows

**Outcome:** The docs continue to feel like one reading ladder rather than drifting back into a loose set of pages.

**Tasks:**
- keep the recommended order visible as new pages or examples are added
- ensure the app and overview continue to link to all major pages that matter
- keep companion material tied to the core pricing thesis
- explain where `project-risk-check/` sits in the reading ladder, if at all

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

### [P3] Revisit the caution band after retrospective data exists

**Outcome:** The current fixed `3`-point band can be confirmed or revised with real outcome data rather than thought experiments alone.

**Current status:**
- a review against `10%` and `12%` proportional alternatives was completed
- the current fixed `3`-point band was kept because it is simpler and already stricter on higher-risk work

**Tasks:**
- compare actual presales calls against realized outcomes once retrospective data exists
- check whether the caution band should vary by risk level in practice, not just in theory
- update docs and tests if a new rule proves better

## Archived / completed

These items are no longer active backlog work:

- persistence and reset
- first-use defaults
- walkthrough, decision guide, calibration notes, and discovery essay pages
- export flow
- card dependency cues and chart explanation
- specific Layer 2 / Layer 3 missing-input guidance
- B-Corp midpoint constants clarified in code and docs
- initial caution-band review completed; fixed `3`-point band retained for now
- initial CI setup and authenticated build fix
- local Markdown renderer and expanded generated-page verification
- jsdom-based DOM integration coverage for key calculator flows
- snapshot-first retrospective workflow with frozen baselines, actuals, Layer 2 re-score, and export
- social sharing / sitemap / robots / structured data
- initial accessibility pass and keyboard semantics improvements
- major copy cleanup across app, overview, theory, and companion essay
- initial guided `project-risk-check/` app scaffold with chart, tweak panel, recommendation logic, and lightweight tests
