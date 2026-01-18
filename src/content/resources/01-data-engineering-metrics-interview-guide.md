---
title: "Data Engineering Metrics Interview Guide"
description: "How to answer product sense questions in data engineering interviews - frameworks, examples, and practice problems."
date: 2025-01-17
tags: ["interviews", "data-engineering", "metrics", "product-sense"]
draft: false
---

# Data Engineering Metrics Interview Guide

*How to answer product sense questions in data engineering interviews*

---

## Why Metrics Questions in Data Engineering?

Data engineering interviews often start with product sense questions, even though the role is technical. Why? Because your data models and pipelines serve business metrics. If you don't understand what you're measuring, you can't build the right systems.

The three canonical question types:

1. **"How would you measure the health of product X?"**
2. **"We're launching feature Y—how do we measure success?"**
3. **"Metric Z declined/increased—how would you investigate?"**

> **Victor's Take:** I've seen candidates nail the SQL portion but stumble here because they jump straight to "I'd look at DAU" without a framework. The framework matters more than the specific metrics you name.

---

## The Framework: North Star → Leading → Lagging → Countermetrics

Every metrics question can be structured with this hierarchy:

| Metric Type | Definition | Example (Ride-sharing) |
|-------------|------------|------------------------|
| **North Star** | The one metric that best captures core value | Completed Rides |
| **Leading Indicators** | Early signals that predict success | App opens, Search queries |
| **Lagging Indicators** | Long-term validation | 30-day retention, LTV |
| **Countermetrics** | Guardrails to catch unintended harm | Driver churn, Support tickets |

### Why This Order?

1. **North Star first** — anchors the conversation and shows you understand the product
2. **Leading indicators** — demonstrates you know what's actionable day-to-day
3. **Lagging indicators** — shows long-term thinking
4. **Countermetrics** — proves you won't optimize one thing at the expense of everything else

---

## Answering "How would you measure the health of product X?"

### Step-by-Step Approach

```
1. CLARIFY: What is the product? Who are the users? What's the business model?
2. PAUSE: Take 30 seconds to think. Jot down notes.
3. CONTEXT: Explain the product's core value proposition
4. USERS: Identify the key personas (new vs returning, buyer vs seller, etc.)
5. METRICS: Walk through North Star → Leading → Lagging → Counter
6. VISUALIZE: Offer to sketch the metric relationships if helpful
```

> **Common Pitfall:** Don't just list metrics. Explain *why* each one matters and how they connect.

### Example: Facebook Marketplace

**North Star:** Transactions Completed (or GMV for revenue focus)

**Why:** Marketplace exists to connect buyers and sellers. A transaction means both sides got value.

| Category | Metrics | Rationale |
|----------|---------|-----------|
| **Leading** | Listings created, Search queries, Messages sent | Early funnel activity |
| **Lagging** | Repeat buyers (30-day), Seller retention | Long-term health |
| **Counter** | Fraud reports, Response time to messages | Trust/safety guardrails |

**Segmentation matters:** Break down by:
- Geography (urban vs rural behave differently)
- Category (electronics vs furniture have different cycles)
- User type (new vs power seller)

---

## Answering "How do we measure success of new feature Y?"

This is about experiment design thinking, not just metrics.

### Framework

```
1. HYPOTHESIS: What behavior change do we expect?
2. PRIMARY METRIC: What single metric tells us it worked?
3. SECONDARY METRICS: What else should improve?
4. GUARDRAILS: What must NOT get worse?
5. TIMELINE: When can we call it?
```

### Example: Instagram Shopping

**Hypothesis:** Adding product tags to posts will increase purchases.

| Metric Type | Metric | Target |
|-------------|--------|--------|
| **Primary** | Conversion rate (view → purchase) | +5% vs control |
| **Secondary** | Add-to-cart rate, Time to purchase | Directionally positive |
| **Guardrails** | Time spent on non-shopping content, Unfollow rate | No degradation |

> **Victor's Take:** Always mention guardrails. It shows maturity. I've seen candidates propose metrics that would obviously cannibalize other parts of the product.

---

## Answering "Metric Z declined—how would you investigate?"

This is the most common "debugging" question. Use the **DECOMPOSE** framework:

```
D - Define the metric precisely (how is it calculated?)
E - Examine the timeline (when did the drop start?)
C - Check for external factors (holidays, competitors, outages)
O - Observe segments (which users/regions/platforms affected?)
M - Map the funnel (where in the user journey is the drop?)
P - Probe data quality (is this a real drop or instrumentation issue?)
O - Outline hypotheses (rank by likelihood)
S - Suggest next steps (what data would confirm/reject each hypothesis?)
E - Escalate appropriately (who needs to know?)
```

### Example: Netflix DAU Declined 10%

**Initial questions:**
- When exactly did the drop start?
- Is it across all regions or specific markets?
- Device breakdown—mobile vs TV vs web?
- Did we have any app updates, outages, or content changes?

**Segmentation analysis:**
```
DAU by region → US flat, LATAM down 15%
DAU by device → Mobile down, TV flat
DAU by tenure → New users down more than existing
```

**Hypothesis formation:**
1. Recent mobile app update in LATAM markets has a bug
2. A competitor launched a promotion in LATAM
3. Payment processing issue affecting new signups

**Next steps:** Check crash logs for mobile, check signup funnel completion rates, check payment success rates by region.

---

## Practice Problems

### Problem 1: DAU Rollup Calculation

You're given daily active user flags by platform:

```python
dau = {
    'ios': [1, 0, 1, 1, 0, 1, 1],
    'android': [1, 0, 0, 0, 0, 1, 1],
    'web': [0, 0, 0, 0, 1, 0, 1]
}

rollup = {
    'mobile': ['ios', 'android'],
    'overall': ['ios', 'android', 'web']
}
```

**Question:** Calculate DAU for `mobile` and `overall` for the week.

<details>
<summary>Clarifying Questions to Ask</summary>

- Is a user counted once even if active on multiple platforms? (Yes—dedupe)
- Will there always be these 3 platforms? (For now, yes)
- What does 1 vs 0 represent? (1 = active that day)

</details>

<details>
<summary>Solution Approach</summary>

For each day, a user is "mobile active" if ios OR android = 1.
For each day, a user is "overall active" if ios OR android OR web = 1.

```python
mobile = [max(dau['ios'][i], dau['android'][i]) for i in range(7)]
# [1, 0, 1, 1, 0, 1, 1] → sum = 5

overall = [max(dau['ios'][i], dau['android'][i], dau['web'][i]) for i in range(7)]
# [1, 0, 1, 1, 1, 1, 1] → sum = 6
```

</details>

### Problem 2: Session Definition

Given user events with timestamps, group them into sessions where a new session starts if there's a gap > 30 minutes.

```python
events = [('user_A', 100), ('user_A', 150), ('user_A', 3000), ('user_B', 200)]
# Expected: {'user_A': [[100, 150], [3000]], 'user_B': [[200]]}
```

> **Victor's Take:** This pattern comes up constantly in analytics. Understand it cold. The key insight: sort first, then iterate tracking the gap.

---

## Quick Reference: Metrics by Product Type

| Product Type | North Star | Key Leading | Key Lagging |
|--------------|------------|-------------|-------------|
| **Social (FB, IG)** | DAU or Time Spent | Posts, Comments | 7-day retention |
| **Marketplace** | Transactions | Listings, Messages | Repeat buyers |
| **Streaming** | Hours Watched | Starts, Completion rate | Subscriber retention |
| **Ride-sharing** | Rides Completed | App opens, Searches | Driver/Rider retention |
| **E-commerce** | Purchases | Cart adds, Checkout starts | LTV, Repeat rate |
| **SaaS** | Monthly Active Teams | Feature adoption | Net Revenue Retention |

---

## Video Resources

These videos walk through the frameworks in action:

| Topic | Video | When to Watch |
|-------|-------|---------------|
| General metrics framework | [Metrics to Measure Success](https://www.youtube.com/watch?v=2A2UwaPaNgQ) | Before any interview |
| Marketplace metrics | [Facebook Marketplace Interview](https://www.youtube.com/watch?v=_FANcClDHa8) | If interviewing for marketplace products |
| Metric decline investigation | [Netflix Inactive Users](https://www.youtube.com/watch?v=nbB1H6XpPuU) | For debugging questions |

---

## Key Takeaways

1. **Use a framework** — Don't just list metrics. Show structured thinking.
2. **Start with North Star** — Anchor the conversation in business value.
3. **Always include countermetrics** — Shows you think about tradeoffs.
4. **Segment everything** — The aggregate number hides the story.
5. **For declines, be systematic** — Timeline → External factors → Segments → Hypotheses.

> **Final Victor's Take:** The best candidates I've seen treat metrics questions like a conversation, not a recitation. They ask clarifying questions, think out loud, and adjust based on the interviewer's reactions. The framework is your skeleton—flesh it out with genuine curiosity about the product.

---

*Next in series: [Data Modeling for Interviews: Facts, Dimensions & Design Patterns](./02-data-modeling-interviews.md)*
