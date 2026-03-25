# Backlog

## Working Style

Backlog items in this repo should be executed with:

- **GSD** for phased execution and verification
- **BDD-style stories** for user-facing workflows
- **TDD** for calculator and state behavior

The intent is lightweight behavioral clarity, not a formal BDD framework.

## Now

### [P0] Quick-win adoption bundle

**Outcome:** The Decision Cards feel usable immediately for first-time presales use.

**Includes:**
- local persistence
- `Reset all`
- simple first-use path with explicit defaults

**Estimate:** 4–6 hours

**Why now:** This is the highest value-per-hour improvement available.

### [P1] Add persistence to the Decision Cards

**Outcome:** Scores and inputs survive reloads.

**Tasks:**
- persist all score state and calculator inputs to `localStorage`
- restore state on load before first calculation
- add `Reset all` action
- add small note explaining local-only persistence
- add tests for restore/reset behavior

**Estimate:** 2–4 hours

### [P1] Add `Reset all`

**Outcome:** Users can clear scores and inputs safely without manual cleanup.

**Tasks:**
- add a visible reset control
- clear stored state and in-memory state
- restore default values where appropriate
- add a small confirmation or explanatory note if needed

**Estimate:** 20–40 minutes

### [P1] Add a simple first-use path

**Outcome:** A new user can score one deal with defaults and get a useful result quickly.

**Tasks:**
- allow Layer 2-only evaluation with explicit default values
- clearly mark defaults as provisional
- add a “start simple” path in the UI or overview
- avoid forcing full Layer 1 understanding on first use

**Estimate:** 3–5 hours

### [P1] Add CSV export

**Outcome:** Teams can move score and result data into Sheets or other lightweight workflows.

**Tasks:**
- export current scores, inputs, hurdle, gap, and verdict as CSV
- keep field names stable
- include B Corp values when present

**Estimate:** 1–2 hours

### [P1] Add a walkthrough stub

**Outcome:** A short practical example bridges the gap between the overview and the longer texts.

**Tasks:**
- add one short scenario page or section
- show a realistic deal from score to verdict
- link it from the overview

**Estimate:** 1–2 hours

### [P1] Add a practical walkthrough page

**Outcome:** New users can see one realistic deal flow from start to finish in under two minutes.

**Tasks:**
- add a short walkthrough page under `tldr/` or `overview/`
- show one realistic agency scenario with actual numbers
- link it from the overview, decision guide, and app primer
- keep it shorter and more concrete than the TL;DR

**Estimate:** 3–5 hours

### [P1] Clean up Layer 1 explanatory language

**Outcome:** The docs consistently explain what Layer 1 does to the formula.

**Tasks:**
- standardize wording around `Layer 1 factor`
- explain multiplication vs line-rotation metaphor clearly
- update theory, overview, and any affected helper text

**Estimate:** 1–2 hours

## Next

### [P2] Review the caution band

**Outcome:** The `Caution` threshold is explicitly defended as either absolute or relative.

**Tasks:**
- document current `3`-point rule in app and theory
- compare with a proportional alternative
- run scenario comparisons
- decide whether to retain the absolute band
- update tests accordingly

**Estimate:** 2–4 hours

### [P2] Add side-by-side scenario comparison

**Outcome:** Teams can compare two deal structures for the same engagement.

**Tasks:**
- duplicate score/input state into `Scenario A` / `Scenario B`
- compare hurdle, proposed margin, gap, and verdict side by side
- keep export/reporting coherent
- add regression coverage for scenario switching

**Estimate:** 6–10 hours

### [P2] Add retrospective mode / postmortem calibration

**Outcome:** Agencies can score completed work and compare predicted vs actual results.

**Tasks:**
- define completed-project inputs
- capture actual cost/margin outcome fields
- compare forecast vs actual results
- use the mode as a confidence-building and calibration tool

**Estimate:** 5–8 hours

### [P2] Add lightweight integration surfaces

**Outcome:** The tool becomes easier to adopt without requiring full native integrations.

**Tasks:**
- add CSV export for scores and outcomes
- design a Sheets-friendly export shape
- design a Notion-friendly template shape
- identify minimal CRM handoff fields for later

**Estimate:** 4–8 hours

## Later

### [P3] Soften front-end branding

**Outcome:** The tool feels less finance-gated while keeping the project identity.

**Tasks:**
- prefer `Decision Cards`, `pricing governance`, and `deal evaluation` in high-level UI
- keep `CAPM` strongest in theory-facing surfaces
- review overview, app primer, and CTA copy

**Estimate:** 2–4 hours

### [P3] Gather social proof and first case study

**Outcome:** Adoption messaging includes a real usage story instead of only theoretical claims.

**Tasks:**
- identify one agency or internal use case
- document one scored deal and resulting decision
- publish a short case study or testimonial

**Estimate:** depends on real usage cycle

### [P3] Accessibility validation follow-up

**Outcome:** Accessibility claims are supported by real assistive-technology use, not just automated audit and keyboard checks.

**Tasks:**
- run a full VoiceOver pass on macOS
- run an NVDA pass on Windows when available
- fix any wording, focus, or announcement issues found
- consider rounding main UI outputs to reduce false precision

**Estimate:** 2–4 hours for validation, plus any follow-up fixes

### [P3] Model optionality explicitly

**Outcome:** Teams can document why a marginal deal may still be strategically valuable.

**Tasks:**
- decide whether optionality belongs as override, note, or explicit adjustment
- avoid hiding it inside beta
- document it as a conscious exception path

**Estimate:** 3–6 hours

### [P3] Extend exports and integrations

**Outcome:** Exports become more useful operationally.

**Tasks:**
- add CSV export of scores and calculations
- explore shareable state URL
- explore lightweight CRM/project handoff formats

**Estimate:** 4–8 hours

## Definition of Done for the next release

- persistence works reliably
- practical walkthrough is linked from the overview
- simple first-use path exists for new users
- Layer 1 framing is consistent across docs
- caution-band rule is explicitly documented
- a retrospective mode exists or is clearly specified for the next milestone
- accessibility validation has been rerun after major UI changes
- accessibility and regression checks still pass
- generated HTML stays in sync with source Markdown
