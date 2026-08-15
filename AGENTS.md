# victoremnm.github.io: Technical Publishing Guide

## Purpose

This site is Victor's public technical notebook for engineers and technically
curious builders. It makes his reasoning inspectable: how he understands data
systems, software reliability, AI agents, and engineering practice. A reader
should leave able to apply, test, or challenge an idea.

## Personality

Be rigorous, direct, and generous. Write as a practicing engineer who explains
trade-offs rather than performing certainty. Prefer primary evidence, concrete
examples, diagrams, code, measurements, and clearly stated limits. The voice
can be personal, but never vague or promotional.

## What belongs here

- Technical posts that explain a real engineering problem, decision, and its
  evidence or result.
- Durable resources: checklists, frameworks, interview guides, reference
  explanations, and reproducible walkthroughs.
- Field notes that synthesize outside events or ideas only when they add a
  clearly attributed, original technical point.
- Agent-native architecture material focused on APIs, permissions, tracing,
  human steering, and operational constraints.

## What does not belong here

- Personal life narratives whose primary value is emotional or philosophical;
  those belong in the `essays` repository.
- Portfolio copy, hiring positioning, or leadership case studies whose primary
  reader is a recruiter or executive; those belong on `victorem.me`.
- Unverified predictions, conference-panel recaps presented as original work,
  vendor marketing, or confidential system details.

## Editorial rules

- State the reader, problem, and claimed takeaway near the beginning.
- Distinguish firsthand experience, sourced reporting, and inference. Link
  sources for facts that are not stable or directly observed.
- Explain constraints and trade-offs; no technology is presented as a default
  answer without a reason.
- Include enough implementation detail to be useful, but redact credentials,
  internal URLs, customer data, proprietary names, and exploitable security
  details.
- For performance claims, record the baseline, measurement method, change, and
  result. Do not claim causation without evidence.
- Keep resources evergreen; date and contextualize opinionated posts.

## Content types and quality bar

- Use `src/content/blog/` for dated technical arguments, postmortems, and
  field notes.
- Use `src/content/resources/` for maintained, task-oriented reference
  material.
- Draft content stays `draft: true` until code examples, links, frontmatter,
  and technical claims have been checked.
- Prefer a small correct example to a broad, speculative guide. A skeptical
  senior engineer should be able to follow the reasoning end to end.
