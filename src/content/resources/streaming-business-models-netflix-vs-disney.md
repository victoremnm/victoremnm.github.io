---
title: "Streaming Business Models: A Data Engineer's Analysis of Netflix vs Disney"
description: "Breaking down revenue models, key metrics, and data architectures behind streaming businesses."
date: 2020-04-17
tags: ["data-engineering", "business-analysis", "streaming", "netflix", "disney"]
draft: true
---

Working in streaming taught me that understanding the business model is essential for building good data infrastructure. Here's a breakdown of what drives streaming businesses from a data perspective.

## Netflix: Pure Subscription Play

Netflix's model is straightforward:

**Primary revenue**: Monthly membership fees
- Members billed in advance
- Revenue recognized ratably over each monthly period
- Presented net of collected taxes

**Key metric**: Paid Streaming Memberships

| Region | March 2020 (MM) | March 2019 (MM) |
| --- | --- | --- |
| US | 69.9 | 66.6 |
| EMEA | 58.7 | 42.5 |
| LATAM | 34.3 | 27.5 |
| APAC | 19.8 | 12.1 |

**Cost structure** (as % of revenue):
- Cost of Revenue: 62%
- Marketing: 9%
- Technology & Development: 8%
- G&A: 4%
- Interest Expense: 3%

**Seasonality**: Q1 and Q4 (October-March) = highest growth, driven by:
- Consumer electronics purchases
- Increased viewing
- Content release schedules

## Disney: The Bundle Complex

Disney's streaming is more complex due to multiple properties and bundle strategies.

**Monthly Revenue Per Subscriber** (Q1 2020):
| Service | Paid Subs (MM) | ARPU |
| --- | --- | --- |
| Disney+ | 26.5 | $5.56 |
| ESPN+ | 6.6 | $4.44 |
| Hulu SVOD | 27.2 | $13.15 |
| Hulu Live TV + SVOD | 3.2 | $59.47 |

Note the massive ARPU difference between live TV bundles ($59.47) and standalone SVOD ($5.56).

## Data Architecture Implications

### Subscription State Tracking

Subscription states are more nuanced than "active" or "cancelled." You need to track:

- **Entitlement status**  -  can they access content right now?
- **Payment history**  -  have they ever paid vs. always free trial?
- **Cancellation type**  -  voluntary (user chose to leave) vs. involuntary (payment failed)
- **Pending states**  -  grace periods before full cancellation

This allows you to derive actionable segments like "at-risk paid subscribers" or "trial users likely to convert."

### The Multi-Platform Challenge

Streaming companies often have multiple apps with different instrumentation:
- Different analytics SDKs per platform
- Separate event schemas that need unification
- Conformed dimension tables to join across platforms

The key is building a **unified identity layer** that maps users across all touchpoints.

## Key Metrics to Track

**Engagement:**
- Monthly/Daily Active Users (MAU/DAU)
- Hours streamed per user
- Content completion rates

**Revenue:**
- ARPU (Average Revenue Per User)
- Money moved per listing
- Revenue by content type

**Retention:**
- Churn rate (voluntary vs involuntary)
- Reactivation rates
- Trial conversion rates

## The Partnership Complexity

Netflix notes that when price is established by partners (in bundles):

> "Payments are recognized as a reduction of revenues"

This means bundled subscribers reduce your headline revenue even if they add users. Something to track in your data model.

## Takeaway for Data Engineers

Build your subscription data model to handle:
1. Multiple entitlement sources
2. State transitions over time
3. Bundle economics
4. Platform-specific instrumentation differences

The business complexity directly impacts your data architecture.

---

*Source: Netflix 10-Q/10-K, Disney 10-Q filings*
