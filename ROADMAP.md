# Roadmap

## Purpose

This roadmap tracks the next practical steps for turning the Decision Cards from a strong first public beta into a more durable presales tool.

The current priorities are:

1. make the tool more usable in real agency workflows
2. make the model’s limits more legible
3. improve adoption with clearer walkthroughs and softer front-end branding

## Delivery Method

The next execution phase should use:

- **GSD** for phase structure, sequencing, and verification
- **BDD-style acceptance criteria** for user-facing behavior
- **TDD** for calculator logic, state behavior, and regression coverage

This does **not** require a heavy Gherkin or Cucumber setup right now. The value of BDD here is in writing behavior clearly before implementation, not in adding a large tooling layer.

### Practical interpretation

- define each backlog item in terms of `Given / When / Then` behavior
- implement or extend tests before changing calculator logic or state flows
- verify each phase against explicit user-facing acceptance criteria before moving on

## Adoption Constraints

These are the main non-technical reasons the model may struggle to spread:

- **Cultural resistance to quantification:** many agencies will still override the framework with relationship logic or founder instinct unless leadership commits to using it.
- **Calibration effort:** `R_f`, `R_m`, and Layer 1 defaults require margin history many agencies do not currently track.
- **No integration story yet:** a standalone static tool is harder to adopt inside existing sales and delivery workflows.
- **CAPM branding friction:** the finance framing signals rigor to some audiences and irrelevance to others.
- **No empirical case studies yet:** the framework still needs visible examples of real agencies using it successfully.

## Adoption Accelerators

These are the highest-leverage ways to improve trust and adoption:

- **Retrospective mode:** let agencies score finished work and compare predicted vs actual outcomes.
- **Simpler first-use path:** let new users try one deal with defaults before understanding the whole model.
- **Integration surfaces:** templates, exports, and lightweight workflow handoffs into tools agencies already use.
- **Social proof:** one credible public adopter matters more than more theory copy.
- **Postmortem calibration loop:** let the tool improve from actual outcomes rather than staying purely static.

## Phase 1 — Practical Adoption

### 1. Persistence

**Goal:** Prevent score loss on reload and make the cards usable in live presales conversations.

**Scope:**
- save form state to `localStorage`
- restore state on load
- add a `Reset` action
- make persistence behavior explicit to users

**Why first:** This is the most obvious product gap.

### 1A. Simple First-Use Path

**Goal:** Let a new user score one deal quickly without understanding the full model first.

**Scope:**
- allow Layer 2 scoring with sane defaults when Layer 1 is incomplete
- present default baseline values explicitly as defaults, not truths
- keep the full two-layer model available for deeper use

**Why early:** Cold-start friction is one of the biggest adoption barriers.

### 2. Practical Walkthrough

**Goal:** Add a short, concrete “what this looks like in practice” artifact between the overview and the long theory.

**Scope:**
- create a short walkthrough page using one realistic deal
- show Layer 1, Layer 2, proposed margin, hurdle, and verdict
- link it from the overview and decision guide

**Why second:** It helps adoption more immediately than more theory.

### 3. Layer 1 Framing Cleanup

**Goal:** Reconcile the explanation of Layer 1 so the docs consistently describe what it does.

**Scope:**
- make the docs explain clearly that the current implementation multiplies the engagement beta by the Layer 1 factor
- explain that this is equivalent to widening or narrowing the effective premium
- remove mixed metaphors where they confuse more than they help

**Why third:** This is a clarity issue, not a product blocker.

## Phase 2 — Calibration and Comparison

### 4. Caution Band Review

**Goal:** Revisit whether the current fixed `3`-point caution band should remain absolute or become relative to the hurdle.

**Scope:**
- document the current rule clearly
- compare absolute and relative alternatives
- test a few scenarios against both approaches
- keep the simpler rule unless the alternative is clearly better

**Why fourth:** This is a calibration decision, not an immediate usability gap.

### 5. Multi-Scenario Comparison

**Goal:** Let teams compare alternate deal structures without losing the current scenario.

**Scope:**
- support `Scenario A` and `Scenario B`
- compare price, cost, hurdle, gap, and verdict side by side
- keep the UI lightweight enough for live presales use

**Why fifth:** High value, but more complex than persistence or documentation.

### 5A. Retrospective and Calibration Loop

**Goal:** Let agencies compare predicted outcomes against actual completed work.

**Scope:**
- define a retrospective scoring mode for completed projects
- capture estimated vs actual cost, margin, and outcome quality
- use that history to refine defaults and increase trust

**Why important:** This is the clearest path to empirical validation and internal buy-in.

## Phase 3 — Positioning and Presentation

### 6. Softer Front-End Branding

**Goal:** Keep `CAPM for Agencies` as the project name while reducing the sense that the tool is “for finance people only.”

**Scope:**
- lead more often with `Decision Cards`, `pricing governance`, and `deal evaluation`
- keep `CAPM` more visible in theory pages than in first-contact UI copy
- reduce unnecessary finance jargon in introductory surfaces

**Why sixth:** Important for adoption, but less urgent than workflow improvements.

### 6A. Adoption Surfaces and Integration

**Goal:** Meet agencies where they already work.

**Scope:**
- add a simple template/export path for Sheets or Notion
- explore lightweight CRM handoff formats before full integrations
- make exports useful in presales review and postmortems

**Why later:** High value, but easier once the core workflow is stable.

### 6B. Social Proof and Case Studies

**Goal:** Replace purely theoretical credibility with demonstrated use.

**Scope:**
- capture at least one internal or partner agency usage story
- document one before/after pricing or go/no-go example
- feature that example in overview or walkthrough materials

**Why later:** This depends on actual use, not just product work.

## Suggested Delivery Sequence

### Fastest credible sequence

1. persistence
2. simple first-use path
3. Layer 1 framing cleanup
4. softer branding
5. practical walkthrough
6. caution-band review
7. multi-scenario comparison
8. retrospective mode
9. integration surfaces
10. social proof

## Quick Wins

If the goal is to improve adoption quickly without opening a large design cycle, the best short bundle is:

1. **Local persistence**
2. **Reset all**
3. **Simple first-use path with explicit defaults**

This gives the biggest usability gain for the least implementation effort.

### Optional add-ons

- **CSV export** for spreadsheet-oriented teams
- **Short walkthrough stub** linked from the overview

## Accessibility Follow-Up

Accessibility is in a much better state than before, but the remaining work is mostly validation rather than structural redesign.

### Next accessibility checks

- run a real **VoiceOver** pass on macOS
- run a real **NVDA** pass on Windows when available
- tighten wording or focus behavior based on actual screen-reader use
- review whether the main UI should show rounded whole-number outputs to reduce false precision

### Priority

These checks should happen alongside the next release cycle, but they do not need to block quick adoption improvements like persistence and first-use simplification.

### Why this order

- `Persistence` has the biggest practical payoff
- `Layer 1 framing cleanup` and `branding` are quick wins
- the `walkthrough` improves adoption before bigger feature work
- `caution band` is a policy choice best handled after the docs are clearer
- `multi-scenario comparison` is the heaviest UI change

## Rough Timing

For one focused engineer working in this repo:

- `1. Persistence`: 2–4 hours
- `Reset all`: 20–40 minutes
- `Simple first-use path`: 1.5–3 hours
- `2. Practical walkthrough`: 3–5 hours
- `3. Layer 1 framing cleanup`: 1–2 hours
- `4. Caution band review`: 2–4 hours
- `5. Multi-scenario comparison`: 6–10 hours
- `6. Softer front-end branding`: 2–4 hours
- `CSV export`: 1–2 hours
- `Walkthrough stub`: 1–2 hours

## Total

- **Fastest reasonable pass on 1–6:** about 2 focused working days
- **More careful pass with testing and copy review:** about 3–4 working days
- **Best quick-win bundle (persistence + reset + first-use path):** about 4–6 hours
- **Quick-win bundle plus CSV export and walkthrough stub:** about 6–9 hours
