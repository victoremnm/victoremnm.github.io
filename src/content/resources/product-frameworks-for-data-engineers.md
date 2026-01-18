---
title: "Product Frameworks Every Data Engineer Should Know"
description: "From AARRR to Porter's 5 Forces - the business frameworks that help data engineers build meaningful analytics."
date: 2020-04-28
tags: ["data-engineering", "product", "frameworks", "analytics", "business"]
draft: true
---

As a data engineer, understanding product and business frameworks makes you significantly more effective. You'll build better metrics, ask better questions, and deliver more impactful analysis.

## Goal Setting: AARRR (Pirate Metrics)

The AARRR framework breaks the user journey into measurable stages:

- **Acquisition** - How do users find you?
- **Activation** - Do they have a great first experience?
- **Retention** - Do they come back?
- **Revenue** - Do they pay?
- **Referral** - Do they tell others?

Each stage implies different metrics and fact tables. Build your warehouse to track the full funnel.

## Situational Analysis: The 5 Cs

When analyzing a company or market, examine:

### 1. Climate (External Environment)
- Regulation
- Technology trends
- Economic conditions
- Cultural trends
- Political landscape

### 2. Customers
- Segments and segment sizes
- Growth rates
- Demographics, geography, purchasing behaviors
- Distribution channels
- Price sensitivity
- Future needs and wants

### 3. Company
- Products and customer segments
- Core competencies
- Barriers to entry
- What makes the service different?

### 4. Collaborators
- Suppliers
- Distributors
- Partners

### 5. Competition
- Who are they?
- Market share
- Competitive positioning
- Porter's 5 Forces analysis

**Tip for disguising 5Cs in conversation:**
- Users = Customers
- Rivals = Competitors
- Capabilities = Company

## Product-Level Analysis

When analyzing a specific product:

1. **Users** - Environmental factors, Customers vs Users (who pays vs who uses)
2. **Pain Points / Use Cases** - What problems are being solved?
3. **Vision** - Where is this going?
4. **Solutions** - Current approaches
5. **Trade-offs** - What was sacrificed for what?

## Strategic Decision Making: SWOT

A 2x2 matrix crossing:
- Internal vs External
- Good vs Bad

| | Good | Bad |
|---|---|---|
| **Internal** | Strengths | Weaknesses |
| **External** | Opportunities | Threats |

## Market Entry: Porter's 5 Forces

Five forces define industry attractiveness:

1. **Existing Competition** - How fierce is rivalry?
2. **Threat of Substitutes** - Can customers switch easily?
3. **Threat of New Entrants** - How hard is it to enter?
4. **Supplier Power** - Can suppliers dictate terms?
5. **Buyer Power** - Can customers dictate terms?

**Example from Ad-tech:**
Buyers use "threat of backward integration" - in-housing media buying to reduce costs. Businesses relying heavily on ads to monetize traffic often bring this capability in-house.

### Competitive Strategies

Companies generally compete on:
- Low-Cost vs Differentiated
- Broad vs Narrow Markets

Commoditized markets = low barriers to entry = low profits.

## Marketing: The 4 Ps

- **Product** - What are you selling?
- **Price** - What does it cost?
- **Promotion** - How do people learn about it?
- **Placement** - Where can they get it?

## Micro vs Macro Strategy

### Micro (Short-term, Existing Products)
- Will customers want X?
- Will the business model work in practice?

### Macro (Long-term, New Markets)
- Does this fit the company's greater vision?
- Will it open new opportunities?
- Will it secure an existing market?

## Example: Twitter Metrics

From Twitter's 10-Q, key metrics include:

- **mDAU (Monetizable Daily Active Users)**: Authenticated accounts that have logged in or used a Twitter product on a given day
- **Total Ad Engagements**: Impressions from mDAU
- **CPM (Cost Per Mille)**: Cost per thousand impressions
- **CPC (Cost Per Click)**
- **CTR (Clickthrough Rate)**
- **CPE (Cost Per Engagement)**

**Data model implication:**

```sql
-- Fact Active User Table
SELECT
    to_date(ts) AS ds,
    user_id,
    MAX(CASE WHEN action_id IN (active_actions) THEN 1 ELSE 0 END)
        AS is_monetizable_active
FROM fact_actions_user
GROUP BY 1, 2
HAVING is_monetizable_active = 1
```

## Why This Matters for Data Engineers

Understanding these frameworks helps you:

1. **Ask better questions** - "What's our retention rate by acquisition channel?" instead of "How many users do we have?"
2. **Build better metrics** - Metrics aligned with business goals
3. **Prioritize work** - Focus on high-impact analysis
4. **Communicate with stakeholders** - Speak their language

---

*Build data infrastructure that answers business questions, not just technical ones.*
