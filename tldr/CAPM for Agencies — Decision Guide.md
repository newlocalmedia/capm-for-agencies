## CAPM for Agencies — Decision Guide

### Purpose

Use this as a repeatable presales workflow for:

* setting a required margin
* checking whether a specific deal clears it
* making go, caution, or stop decisions before commitment

## Inputs

You need five commercial inputs:

* **Agency** `R_f`: margin from your lowest-risk work
* **Portfolio** `R_m`: average margin across project work
* **Layer 1 factor**: the current systematic environment
* **Deal Price**
* **Estimated Delivery Cost**

## Step 1 — Set Your Baselines

**Agency** `R_f`

* use the margin from your safest, most predictable revenue
* typical examples: retainers, maintenance, contracted support

**Portfolio** `R_m`

* use your average project margin over the last 1 to 2 years
* if internal history is weak, use the best benchmark you have

**Risk premium**

* `R_m - R_f`

## Step 2 — Calibrate Layer 1

Score the six Layer 1 factors:

* platform stability
* talent market
* economic conditions
* regulatory exposure
* revenue concentration
* rate pressure

In the app, the combined Layer 1 score maps to a **systematic adjustment factor**:

* `6` maps to `0.85`
* `18` maps to `1.00`
* `30` maps to `1.25`

This factor sets the pricing environment for every engagement.

## Step 3 — Score Layer 2

Score the seven engagement factors:

* client track record
* scope clarity
* technical complexity
* internal capacity
* contract type
* political complexity
* timeline pressure

The Layer 2 card produces:

* **Engagement Score** out of `35`
* **Engagement** `β = Score / 21`

## Step 4 — Calculate The Hybrid Hurdle

Use the current hybrid formula:

* **Blended** `β = (Engagement Score / 21) × Layer 1 factor`
* **Required Margin** `E(R) = R_f + Blended β × (R_m - R_f)`

This gives you the minimum acceptable margin for the deal.

## Step 5 — Check The Actual Deal

Enter:

* **Deal Price**
* **Estimated Delivery Cost**

Then calculate:

* **Proposed Margin** `= (Price - Cost) / Price`

This is the critical decision step.

The model is not complete when you know the hurdle. It is complete when you compare the **proposed margin** to `E(R)`.

## Step 6 — Decide

In the current app:

| Outcome | Condition | Action |
| ----- | ----- | ----- |
| **Go** | proposed margin is at or above `E(R)` | proceed |
| **Caution** | proposed margin is within 3 margin points below `E(R)` | reprice, reduce risk, or change structure |
| **Stop** | proposed margin is more than 3 points below `E(R)` | decline or materially renegotiate |

Also check the **minimum deal price** implied by the hurdle. That gives you a concrete repricing number.

## Step 7 — Use The Pure Approach Correctly

For the pure approach:

* treat the Layer 2 score as a **risk index**, not as CAPM beta
* use it to size contingency, shape contract structure, and flag delivery risk
* use the Layer 1 environment to set the portfolio-wide hurdle

Pure-approach hurdle:

* `E(R) = R_f + Layer 1 factor × (R_m - R_f)`

Then still compare the proposed deal margin against that hurdle.

## Governance Note

This is a **heuristic pricing-governance tool**, not a statistically correct pricing engine.

Its practical value is:

* internal alignment
* presales discipline
* postmortem calibration

The real win is not mathematical precision. It is forcing sales, solutions, delivery, and leadership to name risk in a shared way before committing.

## Outputs

Every evaluated deal should leave with:

* a required margin
* a proposed margin
* a margin gap
* a minimum deal price
* a documented go, caution, or stop decision
