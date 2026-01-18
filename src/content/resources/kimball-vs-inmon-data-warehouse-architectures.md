---
title: "Kimball vs Inmon: Choosing a Data Warehouse Architecture"
description: "A practical comparison of Bill Inmon's top-down enterprise approach versus Ralph Kimball's bottom-up dimensional modeling for building data warehouses."
date: 2020-06-23
tags: ["data-engineering", "data-warehouse", "architecture", "kimball", "inmon"]
draft: true
---

When building a data warehouse, two dominant philosophies emerge: Bill Inmon's top-down enterprise approach and Ralph Kimball's bottom-up dimensional modeling. Understanding when to use each can save your organization significant time and resources.

## The Two Philosophies

### Bill Inmon: Top-Down Enterprise Approach

Inmon recommends starting with a **big centralized enterprise data warehouse** where all available data from transaction systems are consolidated into:
- Subject-oriented
- Integrated
- Time-variant
- Non-volatile

Data marts are then built for the analytic needs of individual departments.

### Ralph Kimball: Bottom-Up Dimensional Approach

Kimball recommends starting with **mission-critical data marts** that serve immediate analytic needs of departments. These data marts are then integrated for data consistency through a "bus architecture." The key tool here is the **dimensional model**.

## Decision Framework: When to Choose Each

| Characteristic | Favours Kimball | Favours Inmon |
| --- | --- | --- |
| **Business decision support** | Tactical | Strategic |
| **Data integration requirements** | Individual business requirements | Enterprise-wide integration |
| **Structure of data** | KPIs, business performance measures, scorecards | Data meeting multiple/varied needs |
| **Source system stability** | Source systems are quite stable | High rate of change |
| **Team composition** | Small team of generalists | Bigger team of specialists |
| **Time constraints** | Urgent need for first data warehouse | Longer time allowed |
| **Cost to build** | Low start-up cost | High start-up costs |

## Key Takeaways

1. **Start with business needs, not technical preferences** - If your org needs quick tactical insights, Kimball's approach delivers faster
2. **Consider your team** - Kimball works better with smaller generalist teams
3. **Plan for change** - If source systems change frequently, Inmon's normalized approach handles this better
4. **Cost vs. time tradeoff** - Kimball is faster to first value; Inmon is more comprehensive long-term

## My Experience

Working at Disney Streaming, we saw this tension play out. Marketing, DPA, and EPA functioned as semi-decentralized data marts (Kimball-style), but this led to challenges when we needed enterprise-wide consistency for subscription data across Disney+, ESPN+, and Hulu.

The lesson: hybrid approaches often work best. Start with Kimball for speed, but plan for eventual integration.

---

*Sources: [Kimball Group](https://www.kimballgroup.com/), [zentut.com](https://www.zentut.com/data-warehouse/kimball-and-inmon-data-warehouse-architectures/)*
