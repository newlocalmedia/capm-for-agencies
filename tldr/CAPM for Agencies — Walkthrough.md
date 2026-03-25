## One Deal, Start to Finish

[[APP_CARDS_ASIDE]]

This is the shortest practical example of how the Decision Cards are meant to be used.

The goal is not to prove that the math is magically exact. The goal is to show how a small agency can start with the default calibration, score a real-looking engagement, compare the proposed margin to the hurdle, and make a clearer decision.

## The Scenario

A small open-source web agency is looking at a `$120,000` CMS redesign and rebuild for a repeat client.

The work is not fully specified, but it is not a greenfield unknown either. The technical approach is familiar. The deal is fixed fee with some padding already built in. The client is known, but the approval path is not especially simple.

That is a normal agency situation: not a dream deal, not a disaster, and exactly the kind of opportunity where people tend to price from instinct.

## Start with the Default Calibration

For a first pass, use the default calculator inputs:

* Agency <em>R<sub>f</sub></em> = `10%`
* Portfolio <em>R<sub>m</sub></em> = `22%`
* Layer 1 factor = `1.00`

That is the current neutral setup in the cards. It lets a new team begin with [Layer 2](../index.html#layer2-card) right away, without pretending they already have a fully calibrated portfolio model.

## Score the Engagement

Use these Layer 2 scores:

* Client Track Record = `2`
  Repeat client. Known relationship, not a trust problem.
* Scope Clarity = `3`
  Enough detail to price, but not enough to say delivery planning is finished.
* Technical Complexity = `2`
  Mostly familiar stack and implementation pattern.
* Internal Capacity = `3`
  The team can do it, but it is not completely slack.
* Contract Type = `4`
  Fixed fee with agency-side delivery risk still carrying real downside.
* Political Complexity = `3`
  More than one approver, but not a hostile stakeholder environment.
* Timeline Pressure = `3`
  Firm deadline, but not an obvious panic schedule.

That gives a raw Layer 2 score of:

`2 + 3 + 2 + 3 + 4 + 3 + 3 = 20`

## Run the Math

In the current hybrid model:

* Engagement <em>β</em> = `20 / 21 = 0.95`
* Blended <em>β</em> = `0.95 × 1.00 = 0.95`
* Required margin <em>E</em>(<em>R</em>) = `10 + 0.95 × (22 - 10) = 21.4%`

Now enter the deal economics:

* Deal price = `$120,000`
* Estimated delivery cost = `$92,000`

The proposed margin is:

`($120,000 - $92,000) / $120,000 = 23.3%`

So the margin gap is:

`23.3% - 21.4% = +1.9 points`

## Read the Verdict

On the current cards, that is a **Go**.

The engagement clears the hurdle, but not by a huge amount. That is an important distinction. The model is not saying "this is a great deal." It is saying the current proposal clears the minimum acceptable return for the risk being named.

That gives the team a clearer conversation:

* yes, this can proceed at the current price
* no, it does not have a massive safety margin
* if scope worsens or delivery cost rises, this deal can move into caution quickly

## What to Do Next

If you want to pressure-test the result, make one of these changes in the cards:

* raise Scope Clarity from `3` to `4`
* raise Timeline Pressure from `3` to `4`
* raise Estimated Delivery Cost from `$92,000` to `$96,000`

That is usually more useful than debating the formula in the abstract. You can see immediately whether the deal still clears the hurdle, slips into caution, or stops making sense at the current price.

## When to Sell Discovery First

If this same deal had:

* vaguer requirements
* a tighter fixed-fee structure
* more unfamiliar technical work
* or stronger client red flags

then the right answer might not be "price the implementation higher." The right answer might be: sell a paid discovery phase first.

That is one of the main reasons this framework exists. It helps a team decide not only whether to take the work, but what exactly should be sold next.

## Why This Example Matters

Most agencies do some version of this thinking already. They just do it informally, in different heads, with different vocabularies, and usually too late.

The Decision Cards make that reasoning explicit:

* start with a neutral default if you need to
* score the deal in shared language
* compare the proposed margin to the hurdle
* then decide whether to proceed, reprice, or sell discovery first

That is the practical value of the model.
