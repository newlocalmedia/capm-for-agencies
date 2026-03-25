# Retrospective Mode

## Purpose

Retrospective mode is the next credibility feature for the Decision Cards.

The current tool helps teams make a pricing decision before committing to work. Retrospective mode should let agencies score completed projects after the fact, compare predicted vs. actual economics, and use that history to refine defaults and build trust in the model.

## Why It Matters

This feature addresses three of the biggest adoption barriers at once:

- the cold-start calibration problem
- the lack of empirical validation
- the need for a postmortem calibration loop rather than a static model

It should make the framework more trustworthy by showing how the scoring logic lined up with what actually happened.

## Core User Story

An agency lead wants to score a completed project, compare the model’s predicted hurdle to the project’s actual margin outcome, and decide whether the model’s assumptions were too soft, too hard, or directionally right.

## Mode Definition

Retrospective mode is not a separate theory. It is a second workflow for the same model.

Two modes should exist:

- **Presales mode**
  Score the current deal and decide whether to proceed, reprice, or sell discovery first.
- **Retrospective mode**
  Score a completed deal and compare predicted vs. actual results for calibration and learning.

## Scope for the First Version

The first retrospective version should stay lightweight.

### Inputs

- agency baseline values:
  - `R_f`
  - `R_m`
  - Layer 1 factor or full Layer 1 scores
- Layer 2 engagement scores
- quoted deal price
- original estimated delivery cost
- actual final delivery cost
- actual recognized revenue if it differs from quoted price
- optional notes:
  - what changed
  - where scope drift came from
  - whether discovery should have been sold first

### Outputs

- predicted required margin `E(R)`
- predicted verdict at time of sale
- proposed margin at time of sale
- actual realized margin
- variance between predicted and actual margin
- a simple interpretation:
  - priced correctly
  - too optimistic
  - too conservative

## Not in the First Version

- automated recalibration of coefficients
- portfolio dashboards
- multi-project analytics
- CRM integration
- statistical claims about model accuracy

Those belong later, after teams have enough project history to justify them.

## Workflow

### Step 1

Load or enter the original pricing context:

- baseline margins
- Layer 1 factor or score
- Layer 2 scores
- proposed deal price
- estimated cost

### Step 2

Enter the actual outcome:

- actual cost
- actual price or recognized revenue
- optional delivery or stakeholder notes

### Step 3

Show the comparison:

- original hurdle
- original proposed margin
- actual realized margin
- whether the deal outperformed or underperformed the pricing assumption

### Step 4

Prompt for learning:

- Was the original score too low?
- Which factors were underestimated?
- Would discovery have been the better sale?
- Should the default baselines be revisited?

## UI Direction

The first release should probably reuse the current card structure rather than invent a whole new application shell.

Suggested UI:

- a top-level mode toggle:
  - `Presales`
  - `Retrospective`
- a compact retrospective results panel under Layer 2
- a final `Postmortem Notes` field
- export support that includes predicted vs. actual comparison

## Data Shape

Suggested persisted object shape:

```json
{
  "mode": "retrospective",
  "inputs": {
    "rf": 10,
    "rm": 22,
    "layer1Factor": 1.00,
    "dealPrice": 120000,
    "estimatedCost": 92000,
    "actualRevenue": 120000,
    "actualCost": 101500
  },
  "scores": {
    "layer1": {},
    "layer2": {},
    "bcorp_l1": {},
    "bcorp_l2": {}
  },
  "notes": {
    "what_changed": "",
    "discovery_call": "",
    "calibration_takeaway": ""
  }
}
```

## Acceptance Criteria

### BDD-style first slice

Given a completed project with known original price and actual cost  
When a user enters the original scores and actual delivery outcome  
Then the interface shows the original predicted hurdle, the original proposed margin, the actual realized margin, and a simple comparison result

Given a project whose actual margin fell below the original hurdle  
When the user enters the actual result  
Then the interface makes the miss visible and invites a short calibration note

Given a project that clearly outperformed the original hurdle  
When the user enters the actual result  
Then the interface shows the positive variance without implying the model is statistically validated from one case

## Release Order

The most practical sequence is:

1. add the retrospective mode design and data shape
2. add a lightweight UI toggle and actual-cost fields
3. add comparison outputs and export support
4. only later consider trend analysis or default recalibration

## Success Metric

The first version succeeds if a small agency can use it to answer:

`Did this project perform better or worse than the pricing logic suggested, and what should we score differently next time?`
