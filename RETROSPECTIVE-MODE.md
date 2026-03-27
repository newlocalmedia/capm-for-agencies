# Retrospective Mode

> **Status:** The first snapshot-first retrospective workflow described here is now shipped on `main`. This document remains a planning/reference note for later refinement, evidence-building, and saved-history work.

## Purpose

Retrospective mode is the next credibility feature for the Decision Cards.

The current tool helps teams make a pricing decision before committing to work. Retrospective mode should let agencies compare the original presales logic to the actual commercial outcome, then capture what they would score differently next time.

This is how the model stops being only a governance thought experiment and starts becoming a calibration loop.

## Why It Matters

This feature addresses several adoption barriers at once:

- the cold-start calibration problem
- the lack of empirical validation
- the need for a postmortem learning loop rather than a static model
- the need to make pricing conversations portable into team review and operations

## Core Design Principle

**The mode toggle is not just a view switch. It is a workflow transition.**

Presales mode is a live draft. Retrospective mode should be entered by freezing that draft into an original presales snapshot.

That means:

- a user can start in presales, score a deal, and later convert that exact deal into a retrospective
- the original presales record is preserved as the baseline for comparison
- retrospective fields are layered on top of that frozen snapshot
- editing the original presales inputs later requires an explicit unlock action, not a casual mode switch

This avoids the main ambiguity in the current two-mode prototype: changing a score in retrospective mode should not silently rewrite history.

## UX Direction

Retrospective mode should not feel like Layer 2 with a few extra fields. It answers a different question.

### Presales mode asks:

`Should we take this deal at this price?`

### Retrospective mode asks:

`How did the original pricing logic compare with what actually happened?`

So in retrospective mode:

- the **comparison view becomes primary**
- the original scoring cards become secondary or collapsible
- the frozen presales snapshot stays visible as reference data
- the learning and re-score controls are part of the main flow, not buried as notes

## First-Version Scope

The first useful retrospective version should include all of the following.

### 1. Frozen presales snapshot

When a user enters retrospective mode, preserve:

- `R_f`
- `R_m`
- Layer 1 factor or scores
- Layer 2 scores
- quoted deal price
- estimated delivery cost
- original hurdle and verdict at time of sale

### 2. Deal metadata

Add these fields now, even before multi-project history exists:

- deal name or identifier
- presales decision date
- retrospective entry date

Without them, later project history becomes a migration problem.

### 3. Actual outcome fields

- actual recognized revenue
- actual final delivery cost

### 4. Primary comparison view

Show, as the main retrospective output:

- predicted hurdle `E(R)`
- predicted proposed margin at time of sale
- actual realized margin
- variance between predicted and actual margin
- simple interpretation:
  - priced correctly
  - too optimistic
  - too conservative

### 5. Per-factor re-score path

This should be part of the first version, not deferred.

For each Layer 2 factor, show:

- original score
- optional retrospective score
- a simple flag or note indicating whether it was underestimated, overstated, or unchanged

This is the concrete calibration loop. Without it, retrospective mode becomes a note field instead of a learning tool.

### 6. Export from day one

Export is essential in the first version because the main consumer of retrospective output is a team review conversation.

The first version should export a self-contained HTML summary that includes:

- deal metadata
- frozen presales snapshot
- actual outcome
- predicted vs. actual comparison
- re-score deltas
- learning notes

## Revised Workflow

### Step 1 — Start in presales or load a completed deal

A user can:

- work in Presales mode first, then convert that session into a retrospective
- or manually enter a historical deal if they are backfilling older work

### Step 2 — Freeze the presales snapshot

Entering Retrospective mode should create a frozen baseline record.

That snapshot preserves:

- original scores
- baselines
- quoted price
- estimated cost
- original predicted outputs

### Step 3 — Enter actual outcome and metadata

The user enters:

- deal name / identifier
- presales date
- retrospective date
- actual revenue
- actual cost

### Step 4 — Review the comparison as the primary view

Retrospective mode should promote this to the top:

- predicted hurdle
- predicted margin
- actual margin
- variance
- simple verdict

### Step 5 — Re-score what was learned

The user can then answer the useful questions concretely:

- Was the original score too low?
- Which factors were underestimated?
- Would discovery have been the better sale?
- Should the default baselines be revisited?

The most important one is factor re-scoring. That is what turns the retrospective into a calibration exercise instead of a loose postmortem.

### Step 6 — Export the review

The final result should be easy to bring into a team meeting or async review.

## Data Shape

Suggested persisted object shape:

```json
{
  "mode": "retrospective",
  "deal": {
    "id": "acme-cms-rebuild-2026-01",
    "name": "Acme CMS rebuild",
    "presalesDate": "2026-01-15",
    "retrospectiveDate": "2026-04-22"
  },
  "presalesSnapshot": {
    "rf": 10,
    "rm": 22,
    "layer1Factor": 1.00,
    "dealPrice": 120000,
    "estimatedCost": 92000,
    "scores": {
      "layer1": {},
      "layer2": {},
      "bcorp_l1": {},
      "bcorp_l2": {}
    },
    "outputs": {
      "requiredMargin": 21.4,
      "proposedMargin": 23.3,
      "verdict": "Go"
    },
    "locked": true
  },
  "retrospective": {
    "actualRevenue": 120000,
    "actualCost": 101500,
    "rescoredFactors": {
      "layer2": {
        "scope": { "original": 2, "retrospective": 4 },
        "timeline": { "original": 2, "retrospective": 3 }
      }
    },
    "notes": {
      "whatChanged": "",
      "discoveryCall": "",
      "calibrationTakeaway": ""
    }
  }
}
```

## Explicit Non-Goals for the First Version

- automated recalibration of coefficients
- multi-project dashboards
- statistical claims about model accuracy
- CRM integration
- portfolio-level reporting

## Acceptance Criteria

### BDD-style first slice

Given a presales session with scores, price, and estimated cost  
When the user enters Retrospective mode  
Then the original presales state is frozen as a snapshot rather than silently shared as a live editable draft

Given a completed project with actual revenue and actual cost  
When the user enters the outcome data  
Then the interface shows the original predicted hurdle, original predicted margin, actual realized margin, variance, and a simple interpretation

Given a project whose original score understated the real delivery risk  
When the user reviews the deal in Retrospective mode  
Then the interface lets them re-score individual factors side by side with the original values

Given a retrospective review that has been completed  
When the user exports it  
Then the exported result includes the frozen presales snapshot, actual outcome, comparison outputs, re-score deltas, and notes in a shareable HTML report

## Release Order

The most practical build sequence is:

1. freeze presales state as a snapshot and add deal metadata
2. add actual outcome fields, comparison outputs, and export support
3. add side-by-side per-factor re-score and learning prompts
4. only later add multi-project history, dashboards, or automated recalibration

## Success Metric

The first version succeeds if a small agency can answer:

`Did this project perform better or worse than the original pricing logic suggested, and what would we score differently next time?`
