---
title: "How I Auto-Log Every Claude Code Session to Track My Own Learning"
description: "Building a self-logging system with Claude Code hooks, git-based session capture, and weekly digest generation — so I never lose context between sessions."
date: 2026-03-15
tags: ["productivity", "claude-code", "engineering", "meta"]
draft: false
---

I work across multiple repos simultaneously — a data pipeline backend in Go/Rust, a React frontend, a personal site, side projects. By Thursday I've forgotten what I was debugging on Monday. By next week I've forgotten the architectural decision we made and why.

I built a system to fix this. It auto-logs every Claude Code session as it happens, appends it to a daily markdown file, and generates a weekly digest of concepts and patterns from the work. Here's how it's built.

## The Core Problem

Context loss compounds in two ways:

**Within a project:** You spend 45 minutes debugging a weird ClickHouse replication issue, find the fix, move on. Next time the same issue surfaces you start from scratch because you didn't write it down.

**Across projects:** You're an EM touching multiple repos. The mental context for each one is different. Without a log, switching between them means re-orienting every time.

I tried explicit daily journals. They require discipline I don't always have at end-of-day. I tried JIRA / Linear tickets. Too much ceremony for small learnings. What I wanted was a system that captures without requiring me to actively do the capturing.

## The Architecture

Three moving parts:

### 1. Claude Code Hooks (Automatic Capture)

Claude Code supports hooks — shell commands that run on lifecycle events (session start, session stop, file edit, etc.). I configured a `stop` hook that fires whenever a session ends:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "python3 /path/to/log_session.py"
          }
        ]
      }
    ]
  }
}
```

The script runs automatically — I don't have to remember to log.

### 2. The Session Logger (`log_session.py`)

The logger does three things:

1. **Gets the current repo context** — runs `git status --short` and `git log --oneline -5` to capture what was in-flight
2. **Appends to a daily file** — writes to `logs/sessions/YYYY-MM-DD.md` in a structured format
3. **Stamps the timestamp** — so you can see the rhythm of work across a day

```python
import subprocess
import datetime
from pathlib import Path

def get_git_context():
    try:
        status = subprocess.run(
            ["git", "status", "--short"],
            capture_output=True, text=True, cwd="."
        ).stdout.strip()
        
        log = subprocess.run(
            ["git", "log", "--oneline", "-5"],
            capture_output=True, text=True, cwd="."
        ).stdout.strip()
        
        return status, log
    except Exception:
        return "", ""

def append_session_log(repo_name: str, status: str, commits: str):
    today = datetime.date.today().isoformat()
    log_dir = Path("logs/sessions")
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / f"{today}.md"
    
    timestamp = datetime.datetime.now().strftime("%H:%M")
    
    entry = f"""
### {today} {timestamp} - Auto-logged session in {repo_name}

**Recent commits:**
```
{commits}
```

**Uncommitted changes:**
```
{status}
```

"""
    with open(log_file, "a") as f:
        if not log_file.exists() or log_file.stat().st_size == 0:
            f.write(f"# Session Log - {today}\n\n")
        f.write(entry)
```

The output is intentionally raw. I'm not trying to be clever about what gets logged — just capture the state.

### 3. The Weekly Digest (`session_learning_report.py`)

Once a week (via cron, 9 AM Monday), a report generator reads the last 7 days of session logs and produces a learning digest. It:

- Counts sessions per project
- Extracts concept mentions (SQL, Rust, ClickHouse, Solana, etc.)
- Flags questions phrased as learning opportunities ("why does X work this way", "what's the difference between Y and Z")
- Outputs a ranked list of concepts to review

The output is a markdown file in `docs/session-insights/` that I can skim in 2 minutes to remember what the week looked like.

A sample from a week in January:

```
| Concept      | Mentions | Signal |
|--------------|----------|--------|
| solana       | 12       | 🟡 Review |
| dbt          | 11       | 🟡 Review |
| clickhouse   | 9        | 🟢 Familiar |
| sql          | 9        | 🟢 Familiar |
| rust         | 9        | 🟢 Familiar |
```

The emoji signals are simple thresholds: seen once or twice is just noise, 5+ times means it's worth a deliberate study session.

## What I've Learned From the Logs

Running this for ~3 months now, a few observations:

**I use Claude Code more than I think.** A week I'd characterize as "light" often has 60–80 sessions across repos. High-output weeks hit 200+. It's made me more intentional about *what* I'm asking versus just reaching for it as a reflex.

**The uncommitted changes column is more valuable than the commit log.** Commits represent resolved decisions. The uncommitted state captures what's in-flight — which is where context loss actually hurts. Seeing `?? useTokenSearch.ts` on a Monday means I know where I left off.

**Learning gaps cluster.** The same concepts show up on the review list week after week until I actually sit down and go deep. Solana's account model was on my list for six weeks before I finally spent an afternoon reading through the docs properly.

**The log is a forcing function for writing.** Looking at a week of raw session logs and realizing "that ClickHouse work was genuinely interesting" is what prompted the [pipeline post I wrote](/blog/clickhouse-latency-minutes-to-30ms). The log makes invisible work visible.

## The Setup

If you use Claude Code and want something similar:

1. Add a `Stop` hook in your Claude settings pointing to a simple script
2. The script should capture `git status`, `git log --oneline -5`, and the current directory/repo name
3. Append to a date-stamped markdown file
4. Optional: add a weekly cron that aggregates across log files

The whole thing is ~100 lines of Python and a one-line JSON hook config. Low overhead, high return.

The goal isn't perfect documentation. It's just enough signal that Monday-you can orient quickly to where Friday-you left off.
