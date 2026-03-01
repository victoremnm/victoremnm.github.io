#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

const LOG_DIR = path.join(process.cwd(), 'src/content/blog/logs'); // Future location for logs
// For now, let's just log to a simple file or create a new blog post if needed.
// Actually, let's create a dedicated 'log' collection or just append to a weekly log.
// Let's use a simple YYYY-MM-DD.md format in src/content/work/logs for now, or just append to a massive log.
// The user wants a "Technical Log". Let's put it in src/content/blog/log-YYYY-MM.md for monthly logs?
// Or better: src/content/blog/YYYY-MM-DD-log.md.

// Let's go with: src/content/blog/log-[YYYY]-[MM].md and append daily entries.
// Actually, user wants "Technical Log" like a stream.
// Let's try to append to a "current" log file.

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const todayStr = `${year}-${month}-${day}`;

// Ensure directory exists
const contentDir = path.join(process.cwd(), 'src/content/logs');
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

// We will create/append to a file named `log-${year}-${month}.md`
const filename = `${year}-${month}.md`;
const filePath = path.join(contentDir, filename);

// ... (rest of code)

  // Check if file exists to add frontmatter
  let fileContent = '';
  if (!fs.existsSync(filePath)) {
    fileContent = `---
title: "Log: ${year}-${month}"
description: "Daily engineering updates for ${year}-${month}"
date: ${year}-${month}-01
tags: ["log"]
---
`;
  } else {
// ...
    fileContent = fs.readFileSync(filePath, 'utf8');
  }

  // Append entry
  // If the file already has content, just append.
  // But we want to prepend the entry to the top of the list? No, chronological is better for logs?
  // Actually, reverse chronological is usually better for reading.
  // Let's append for now to keep it simple, or insert after frontmatter.

  // Simple append:
  fs.appendFileSync(filePath, entry);
  
  if (!fs.existsSync(filePath)) {
      // If we just created it, write the whole thing
      fs.writeFileSync(filePath, fileContent + entry);
  }

  console.log(`
✅ Logged to ${filename}`);
  rl.close();
});
