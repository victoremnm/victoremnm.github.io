---
title: "Surrogate Keys and Identity Resolution: A Practical Guide"
description: "Why 'there is no such thing as a surrogate key' and how to build mapping tables that handle identity resolution at scale."
date: 2020-06-11
tags: ["data-engineering", "data-modeling", "identity-resolution", "data-warehouse"]
draft: true
---

One of the most valuable lessons I learned early in my data engineering career: **there is no such thing as a surrogate key**. At least not in the way most people think about it.

## The Problem with Naive Surrogate Keys

Many engineers create surrogate keys like this: take a natural key (say, an email), hash it, and use that as your surrogate. Simple, right?

The problem: what happens when your natural key changes or you need to link multiple natural keys to the same entity?

Consider a user who:
- Signs up with `john.smith@disney.com`
- Later uses `john.smith@disneystreaming.com`
- Also has a SWID (software ID) of `101`

These are all the same person. Your surrogate key needs to handle this.

## The Mapping Table Solution

Instead of deriving a surrogate key from a natural key, create a **mapping table** that:
1. Mints brand new IDs independently
2. Manages the lifecycle of those IDs
3. Maps natural keys to surrogate keys over time

| Surrogate Key | Email (NK) | SWID (NK) |
| --- | --- | --- |
| 1 | john.smith@disney.com | NULL |
| 1 | NULL | 101 |
| 1 | john.smith@disneystreaming.com | 101 |

This approach gives you:
- **Ownership** of the surrogate key lifecycle
- **Flexibility** to handle natural key transitions
- **Backward traversability** - you can always find relationships

## Key Considerations

### The Responsibility Shift

When you mint your own surrogate keys, you take on:
- **Deduplication responsibility** - you decide what constitutes the same entity
- **Lifecycle management** - IDs can be active only for specific time periods
- **Migration handling** - when systems change, your mapping table absorbs the complexity

### The Parallelization Problem

Surrogate key generation is inherently serial in SQL. Options:
- Use UUIDs (but maintenance is harder)
- Pre-allocate ID ranges per node
- Accept the serialization for correctness

### Think Entity-First

Don't just build tables - define **entities**. A subscriber isn't just a row; it's a concept with:
- Age (when created)
- Lifecycle (active, churned, reactivated)
- Relationships (to other entities)

When building a warehouse, start with: "What entity am I representing, and what is its lifecycle?"

## Practical Example

```sql
-- Your mapping table becomes the source of truth
SELECT ds,
       surrogate_key,
       natural_key_email
FROM subscriber_identity_map
WHERE ds = '2020-06-01'
  AND surrogate_key = 1

-- Returns all natural keys that map to entity #1
-- ds          | surrogate_key | natural_key_email
-- 2020-06-01  | 1             | john.smith@disney.com
-- 2020-06-01  | 1             | john.smith@disneystreaming.com
```

## The Bottom Line

Surrogate keys aren't magic hash functions. They're **entity identifiers** that you own and manage. Build the infrastructure to mint, lifecycle, and map them - your future self will thank you.

---

*Thanks to conversations with colleagues at Disney Streaming for crystallizing these patterns.*
