## CAPM for Agencies — Decision Guide

### Purpose

Use this as a repeatable presales workflow for:

* setting a required margin
* checking whether a specific deal clears it
* making go, caution, or stop decisions before commitment

The hook is still "price before you plan," but in practice that means price before delivery planning is committed, not before the solutions team has done enough technical assessment to price responsibly.

CAPM in one sentence: it is a finance model for deciding what return is worth a given level of risk. In this agency version, it helps you separate portfolio risk from deal risk, set a minimum acceptable margin, and decide whether the work deserves a yes at the quoted price.

Run the workflow in the app:

* [Layer 1 card](../index.html#layer1-card)
* [Layer 2 card](../index.html#layer2-card)
* [B-Corp card](../index.html#bcorp-card)

## Inputs

You need five commercial inputs:

* **Agency** <em>R<sub>f</sub></em>: margin from your lowest-risk work
* **Portfolio** <em>R<sub>m</sub></em>: average margin across project work
* **Layer 1 factor**: the current systematic environment
* **Deal Price**
* **Estimated Delivery Cost**

## Step 1 — Set Your Baselines

**Agency** <em>R<sub>f</sub></em>

* use the margin from your safest, most predictable revenue
* typical examples: retainers, maintenance, contracted support

**Portfolio** <em>R<sub>m</sub></em>

* use your average project margin over the last 1 to 2 years
* if internal history is weak, use the best benchmark you have

**Risk premium**

* <em>R<sub>m</sub></em> - <em>R<sub>f</sub></em>

## Step 2 — Calibrate Layer 1

Score the six Layer 1 factors in the [Layer 1 card](../index.html#layer1-card):

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

This is a presales risk assessment, not full delivery planning. In the [Layer 2 card](../index.html#layer2-card), you want enough solutions-team input to price responsibly: technical complexity, client concerns, scope shape, and capacity pressure. If implementation still cannot be priced confidently, the right next move is to price a discovery phase first.

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
* **Required Margin** <em>E</em>(<em>R</em>) = <em>R<sub>f</sub></em> + Blended <em>β</em> × (<em>R<sub>m</sub></em> - <em>R<sub>f</sub></em>)

This gives you the minimum acceptable margin for the deal.

## Step 5 — Check The Actual Deal

Enter:

* **Deal Price**
* **Estimated Delivery Cost**

Then calculate:

* **Proposed Margin** `= (Price - Cost) / Price`

This is the critical decision step.

The model is not complete when you know the hurdle. It is complete when you compare the **proposed margin** to <em>E</em>(<em>R</em>).

## Step 6 — Decide

In the current app:

| Outcome | Condition | Action |
| ----- | ----- | ----- |
| **Go** | proposed margin is at or above <em>E</em>(<em>R</em>) | proceed |
| **Caution** | proposed margin is within 3 margin points below <em>E</em>(<em>R</em>) | reprice, reduce risk, or change structure |
| **Stop** | proposed margin is more than 3 points below <em>E</em>(<em>R</em>) | decline or materially renegotiate |

Also check the **minimum deal price** implied by the hurdle. That gives you a concrete repricing number.

## Step 7 — Use The B-Corp Overlay When It Matters

If you are using the [B-Corp card](../index.html#bcorp-card), do one more pass:

* score the B-Corp portfolio factors
* score the B-Corp engagement factors
* review the **impact adjustment**
* compare the proposed margin against **impact-adjusted** <em>E</em>(<em>R</em>*)

In the current app, the B-Corp card keeps the standard hurdle visible, then shows how mission discount or harm premium shifts it up or down.

## Step 8 — Use The Pure Approach Correctly

For the pure approach:

* treat the Layer 2 score as a **risk index**, not as CAPM beta
* use it to size contingency, shape contract structure, and flag delivery risk
* use the Layer 1 environment to set the portfolio-wide hurdle

Pure-approach hurdle:

* <em>E</em>(<em>R</em>) = <em>R<sub>f</sub></em> + Layer 1 factor × (<em>R<sub>m</sub></em> - <em>R<sub>f</sub></em>)

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
* an impact-adjusted margin if the B-Corp overlay is in play
* a proposed margin
* a margin gap
* a minimum deal price
* a documented go, caution, or stop decision
