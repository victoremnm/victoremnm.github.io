---
title: "What Every Engineer Should Know About Logs and Real-time Data"
description: "Lessons from LinkedIn's engineering blog on where data cleanup should live in your data architecture."
date: 2020-05-30
tags: ["data-engineering", "real-time", "logs", "architecture", "streaming"]
draft: true
---

LinkedIn's engineering blog has a seminal piece that every data engineer should read: *"The Log: What every software engineer should know about real-time data's unifying abstraction."*

The core insight is deceptively simple but has profound implications for how you architect data systems.

## The Log as Unifying Abstraction

A log is an append-only, totally-ordered sequence of records ordered by time. This simple structure turns out to be the foundation for:
- Database replication
- Stream processing
- Change data capture
- Event sourcing

## Where Should Data Cleanup Live?

Here's the key architectural question: when you have data flowing through your system, where do transformations and cleanup belong?

There are three options:

### 1. At the Producer (Recommended)

**Cleanup done prior to publishing to the log by the data producer.**

This is the best model because:
- The producer knows their data best
- Schema enforcement happens at the source
- Downstream consumers get clean, canonical data
- Logic should be **lossless and reversible** at this stage

### 2. As a Real-time Transformation

Transform the log in-flight, producing a new transformed log.

Good for:
- Cross-cutting concerns
- Enrichment that requires context from multiple sources
- When producers can't be changed

### 3. At Load Time

Transform during the load into the destination system.

This is often the default but creates problems:
- Logic gets duplicated across consumers
- Schema drift affects each consumer differently
- Harder to debug and maintain

## The Producer-First Principle

The best data architectures put the burden of data quality on **producers**, not consumers.

Why? The team that creates the data:
- Knows the semantics
- Can enforce invariants
- Has context about edge cases
- Can fix issues at the source

## Practical Implications

When building a data pipeline:

1. **Push for canonical schemas at the source** - Don't just accept whatever the producer gives you
2. **Make cleanup lossless** - You should be able to reconstruct the original data
3. **Design for reversibility** - Transformations should be undoable when possible
4. **Keep logs immutable** - The power of logs comes from their append-only nature

## My Takeaway

At Disney Streaming, we saw the cost of accepting denormalized data at the source. Stream payloads came with embedded metadata (program_id, series_id) that should have been joined downstream. This meant:
- Running DISTINCTs to build dimension tables
- Facts that were denormalized from the start
- Harder migrations when upstream schemas changed

The lesson: invest in influencing data production and ingestion to capture the right context at the right level.

---

*Source: [LinkedIn Engineering - The Log](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)*
