---
title: "Dimensional Modeling Fundamentals: Facts, Dimensions, and Snapshots"
description: "Core concepts from Kimball's Dimensional Warehouse Toolkit - star schemas, fact table types, and the enterprise bus architecture."
date: 2020-05-01
tags: ["data-engineering", "dimensional-modeling", "kimball", "data-warehouse"]
draft: true
---

Ralph Kimball's *Dimensional Data Warehouse Toolkit* remains the definitive guide to building analytics-ready data warehouses. Here are the core concepts every data engineer should internalize.

## Star Schema vs OLAP Cubes

While OLAP cube technology continues improving, Kimball recommends:

> **Load detailed, atomic information into a star schema first; optional OLAP cubes are then populated from the star schema.**

This gives you flexibility - the star schema serves as your foundation, and OLAP cubes become a performance optimization layer.

## The Three Fact Table Types

Not all facts are created equal. Understanding which type to use is crucial.

### 1. Transaction Facts

Records individual events as they occur:
- Each row = one transaction
- Completely additive across all dimensions
- Most granular, most flexible

### 2. Periodic Snapshots

Captures the state at regular intervals:
- Daily, weekly, monthly snapshots
- Good for inventory, balances, status tracking
- **Semi-additive facts** - can't simply sum across time

For semi-additive facts like account balances, the most useful aggregation is **averaging**:
- An account with $100 on day 1 and $60 on day 2 has an $80 average balance
- You can't sum these values directly

### 3. Accumulating Snapshots

Tracks a process from start to finish:
- One row per instance of a process
- Gets updated as the process progresses
- Useful for tracking lifecycles (orders, subscriptions, support tickets)

**LAG Facts tip**: Store time lags from the process start point. Then any lag between two steps = simple subtraction.

## Managing Snapshot Growth

Periodic snapshots can get large. A practical approach:

> Keep the last 60 days at daily granularity, then revert to weekly snapshots for historical data.

This reduces 3 years of snapshots from 1,095 rows to 208 rows (60 daily + 148 weekly). Store these in **separate fact tables** due to their different periodicity.

## The Enterprise Bus Architecture

The key to Kimball's approach: **conformed dimensions**.

A bus matrix maps:
- **Rows**: Business processes (orders, shipments, inventory)
- **Columns**: Shared dimensions (date, customer, product, location)

When multiple fact tables share the same dimension definitions, you get:
- Consistent reporting across processes
- Ability to drill across fact tables
- Enterprise-wide analytics without a massive monolithic warehouse

## Star Schema: Advantages and Pitfalls

**Advantages:**
- Query performance (fewer joins)
- Business user friendly
- Flexible aggregation

**Pitfalls:**
- Data integrity not well-enforced (denormalized state)
- One-off inserts/updates can create anomalies
- Requires controlled loading (batch or trickle-feeds)

## Snowflake Dimensions

When hierarchies are normalized within dimensions:
- Low-cardinality attributes become secondary tables
- Creates a "snowflake" structure
- Trades query simplicity for storage efficiency

Generally: **prefer star schemas** unless you have specific reasons to snowflake.

## Practical Takeaways

1. **Start with business processes** - Align your fact tables with how the business operates
2. **Design for the most granular level** - You can always aggregate up
3. **Invest in conformed dimensions** - This is where enterprise value comes from
4. **Choose the right fact table type** - Transactions, periodic snapshots, or accumulating snapshots based on your use case

---

*Source: The Data Warehouse Toolkit by Ralph Kimball*
