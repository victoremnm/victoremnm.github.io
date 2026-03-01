---
title: "Post-Mortem: Chief of Staff"
description: "Why I abandoned my productivity tool to build a better system for technical growth."
date: 2026-02-28
tags: ["reflection", "productivity", "engineering", "post-mortem"]
draft: false
---

In software engineering, we often learn more from our abandoned projects than our successful ones. "Chief of Staff" was my attempt to build the ultimate personal productivity operating system—a CLI tool to manage my time, tasks, and context.

It failed. But it led me to a better approach: **The Technical Log**.

## The Vision
The original idea for `chief-of-staff` was ambitious. I wanted a tool that would:
1.  **Intercept context:** Know what I was working on before I even started.
2.  **Enforce discipline:** Block distractions and force prioritization.
3.  **Quantify output:** Generate metrics on my engineering velocity.

I spent weeks designing the perfect CLI architecture, debating database choices (SQLite vs. JSON), and crafting a "surgical" UI theme.

## Why It Failed

### 1. The Meta-Work Trap
I fell into the classic trap of building a tool to *manage* work instead of actually *doing* the work. I spent more time configuring the linter for `chief-of-staff` than I did using it to track my actual deliverables.

### 2. Over-Engineering
I treated a simple logging problem like a distributed systems challenge. I didn't need a complex database or a robust plugin system. I needed a text file.

### 3. Friction
The tool required manual input that interrupted my flow. If a productivity tool adds friction, it's not a tool—it's a chore.

## The Pivot: From "Manager" to "Logger"

Reflecting on this, I realized that what I actually needed wasn't a "Chief of Staff" to boss me around. I needed a **Log** to remember where I'd been.

I looked at how engineers like [Lilian Weng](https://lilianweng.github.io/) and [Andrej Karpathy](https://karpathy.github.io/) operate. They don't have complex productivity dashboards (publicly, at least). They have **archives**. They treat their work as a stream of technical outputs.

## The New Architecture

I am officially deprecating `chief-of-staff` as a standalone product and rebirthing it as a **philosophy** embedded in this website.

1.  **This Site is the OS:** My `victoremnm.github.io` repo is now my living workspace.
2.  **The "Log" is the Feature:** Instead of a complex app, I'm building a simple script to append daily updates to a markdown file.
3.  **Public by Default:** By logging my technical growth publicly, I create accountability and a knowledge base that scales with me.

The "Chief of Staff" is dead. Long live the **Technical Log**.
