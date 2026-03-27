## CAPM for Agencies — Calibration Notes

### Purpose

Use this if you want the implementation details behind the current Decision Cards build: the score mappings, the current calibration choices, and a few sanity-test scenarios run against the live calculator.

Run the current implementation here:

* [Layer 1 card](../index.html#layer1-card)
* [Layer 2 card](../index.html#layer2-card)
* [B Corp card](../index.html#bcorp-card)

## What Changed

Two calibration changes matter in the current build:

1. **Layer 1 is now truly neutral at the midpoint.**
   The systematic adjustment factor now maps:
   * `6` to `0.85`
   * `18` to `1.00`
   * `30` to `1.15`

   This makes the midpoint score behave like a real normal environment instead of quietly pushing the hybrid hurdle upward.

2. **The B Corp overlay is now less aggressive by default.**
   * the B Corp portfolio score is neutral at its midpoint
   * the portfolio modifier now ranges from `0.8` to `1.2`
   * each B Corp engagement point away from its midpoint is worth about `1.0` margin point before that modifier is applied

   This keeps the overlay useful as governance without turning it into a large automatic pricing swing.

## Current Formula Choices

### Layer 1

The Layer 1 composite score is mapped into a **systematic adjustment factor**. In the current build, the range is intentionally moderate:

* lowest environment: `0.85`
* midpoint environment: `1.00`
* highest environment: `1.15`

That factor is then used in two ways:

* in the **pure approach**, it sets the portfolio-wide hurdle directly
* in the **hybrid approach**, it weights the engagement beta

### Layer 2

The current hybrid implementation is:

* **Engagement** `β = Score / 21`
* **Blended** `β = (Engagement Score / 21) × Layer 1 factor`
* **Required Margin** <em>E</em>(<em>R</em>) = <em>R<sub>f</sub></em> + Blended <em>β</em> × (<em>R<sub>m</sub></em> - <em>R<sub>f</sub></em>)

This is a midpoint-anchored calibration, not an endpoint-anchored one. A neutral Layer 2 engagement score maps to market-like `β = 1.0`. The low end does not collapse to `β = 0`, which intentionally prevents zero-risk pricing while preserving more headroom for difficult deals.

The decision thresholds are:

* **Go**: proposed margin is at or above <em>E</em>(<em>R</em>)
* **Caution**: proposed margin is within `3` margin points below <em>E</em>(<em>R</em>)
* **Stop**: proposed margin is more than `3` points below <em>E</em>(<em>R</em>)

### Caution Band Review

Using the current defaults (`R_f = 10%`, `R_m = 22%`), a low-risk deal at blended `β = 0.50` clears at `16.0%`, while a high-risk deal at blended `β = 1.50` clears at `28.0%`.

| Case | Hurdle E(R) | Fixed 3-point band | 10% proportional band | 12% proportional band |
| --- | ---: | --- | --- | --- |
| Low risk (`β = 0.50`) | `16.0%` | caution from `13.0%` to `15.9%` | caution from `14.4%` to `15.9%` | caution from `14.1%` to `15.9%` |
| High risk (`β = 1.50`) | `28.0%` | caution from `25.0%` to `27.9%` | caution from `25.2%` to `27.9%` | caution from `24.6%` to `27.9%` |

What this shows:

* the current fixed `3`-point band is about `18.8%` of the low-risk hurdle and `10.7%` of the high-risk hurdle
* so the current rule is actually **more forgiving on safer work and stricter on riskier work**
* a `10%` proportional band tightens low-risk deals sharply and only slightly tightens high-risk deals
* a `12%` proportional band is closer to the current rule, but it starts widening caution on higher-risk work

Side by side, that means:

* at `-2.5` points below the hurdle, a low-risk deal stays **Caution** under the fixed rule but becomes **Stop** under both proportional alternatives tested here
* at the same `-2.5` points, a high-risk deal stays **Caution** under the fixed rule and under both proportional alternatives
* at `-3.0` points below the hurdle, a high-risk deal stays **Caution** under the fixed rule, becomes **Stop** under a `10%` band, and stays **Caution** under a `12%` band

**Decision for now:** keep the fixed `3`-point caution band. It is simpler to explain, and it already applies a tighter leash to high-risk work than the proportional alternatives tested here. This should still be revisited once retrospective data exists.

### B Corp Overlay

The current B Corp implementation uses:

* **Standard hurdle**: <em>E</em>(<em>R</em>) from Layer 2
* **Impact-adjusted hurdle**: <em>E</em>(<em>R</em>*) = <em>E</em>(<em>R</em>) + Impact Adjustment

Where:

* B Corp Layer 1 midpoint is neutral
* B Corp Layer 1 modifies scale from `0.8` to `1.2`
* B Corp Layer 2 midpoint is neutral at `12` on a `4–20` scale
* each B Corp Layer 2 point away from midpoint is worth about `1.0` point before that portfolio modifier is applied

So the current automatic adjustment is:

* `Impact Adjustment = (B Corp L2 score - 12) × 1.0 × portfolio modifier`

This is still heuristic. It is designed to make the trade-off visible and discussable, not to discover an objectively correct mission premium. It is also midpoint-anchored by design: neutral B Corp impact maps to no mission discount or harm premium, while more strongly aligned or more harmful work moves the hurdle down or up from that center.

## Sanity-Test Scenarios

The scenarios below were run against the live form and checked against the displayed outputs.

### Scenario 1 — Calm Small Agency, Straightforward Project

Inputs:

* <em>R<sub>f</sub></em> = `10%`
* <em>R<sub>m</sub></em> = `22%`
* Layer 1 scores: all `2`
* Layer 2 scores: all `2`
* Deal price: `$120,000`
* Estimated cost: `$92,000`

Expected behavior:

* Layer 1 factor should be mildly favorable
* the hurdle should stay below the portfolio average
* the proposed margin should clear comfortably

Observed result:

* Layer 1 factor: `0.93`
* Engagement `β`: `0.67`
* Blended `β`: `0.62`
* Required margin: `17.4%`
* Proposed margin: `23.3%`
* Gap: `+5.9 points`
* Verdict: **Go**

This makes sense.

### Scenario 2 — Elevated-Risk Market, Ugly Fixed-Price Build

Inputs:

* <em>R<sub>f</sub></em> = `10%`
* <em>R<sub>m</sub></em> = `22%`
* Layer 1 scores: `4, 4, 3, 4, 4, 4`
* Layer 2 scores: `4, 5, 4, 4, 4, 4, 5`
* Deal price: `$200,000`
* Estimated cost: `$150,000`

Observed result:

* Layer 1 factor: `1.06`
* Engagement `β`: `1.43`
* Blended `β`: `1.52`
* Required margin: `28.2%`
* Proposed margin: `25.0%`
* Gap: `-3.2 points`
* Verdict: **Stop**

This also makes sense. The deal is not absurdly underwater, but it still fails the stated threshold.

### Scenario 3 — Mission-Aligned B Corp Work

Inputs:

* same financial inputs as Scenario 1
* B Corp Layer 1 scores: all `2`
* B Corp Layer 2 scores: `1, 1, 2, 2`

Observed result:

* Standard hurdle: `17.4%`
* B Corp impact adjustment: `-5.4%`
* Impact-adjusted hurdle: `12.0%`
* Verdict: **Mission-aligned**

This is still a meaningful mission discount, but it is more defensible than the earlier, much larger automatic swing.

### Scenario 4 — Harmful but Financially Attractive Work

Inputs:

* <em>R<sub>f</sub></em> = `10%`
* <em>R<sub>m</sub></em> = `22%`
* Layer 1 scores: all `3`
* Layer 2 scores: all `3`
* Deal price: `$210,000`
* Estimated cost: `$150,000`
* B Corp Layer 1 scores: all `4`
* B Corp Layer 2 scores: `5, 4, 4, 4`

Observed result:

* Standard hurdle: `22.0%`
* B Corp impact adjustment: `+5.5%`
* Impact-adjusted hurdle: `27.5%`
* Proposed margin: `28.6%`
* Verdict: **Harm premium cleared financially — review mission trade-offs explicitly**

This is a good example of the B Corp overlay doing what it should: making the mission cost visible without automatically forcing every bad-fit deal into a stop.

## What To Watch For

One practical calibration note: agency-wide **net margin** benchmarks and project-level **portfolio margin** benchmarks are not the same thing. Industry averages may sit in the mid-teens, while a usable project-margin benchmark for pricing decisions may reasonably be higher.

The current Decision Cards build is strongest when:

* the team agrees on what the score anchors mean
* the same people score similar deals repeatedly
* the agency compares required margin, proposed margin, and actual outcomes over time

It is weakest when:

* users treat the numbers as statistically discovered truths
* the portfolio baselines are guessed rather than observed
* the B Corp overlay is mistaken for an official B Lab formula

## Recommended Use

Treat these calibrations as defaults, not doctrine.

If you have enough historical data, you should revise them:

* based on closed-won and closed-lost deals
* based on margin slippage in delivery
* based on how often `Go`, `Caution`, and `Stop` calls proved right in retrospect

That is the real point of the model: not numerical purity, but disciplined judgment that gets better over time.
