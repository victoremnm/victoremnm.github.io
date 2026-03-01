#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const todayStr = `${year}-${month}-${day}`;

const contentDir = path.join(process.cwd(), 'src/content/logs');
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

const filename = `${year}-${month}.md`;
const filePath = path.join(contentDir, filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`\n🤖 Chief of Staff: Logging for ${todayStr}\n`);

// 1. Get git activity for the day
try {
  const gitLog = execSync(`git log --since="6am" --pretty=format:"- %s" --author="$(git config user.name)"`).toString();
  if (gitLog) {
    console.log(`\nRecent Commits:\n${gitLog}\n`);
  }
} catch (e) {
  // Ignore
}

rl.question('📝 What did you ship today? (1 sentence): ', (shipped) => {
  rl.question('💡 What did you learn or find interesting? (1 sentence): ', (learning) => {
    const entry = `\n### ${todayStr}\n- **Ship:** ${shipped}\n- **Learn:** ${learning}\n`;

    let fileContent = '';
    if (!fs.existsSync(filePath)) {
      fileContent = `---
title: "Log: ${year}-${month}"
description: "Daily engineering updates for ${year}-${month}"
date: ${year}-${month}-01
tags: ["log"]
---
`;
      fs.writeFileSync(filePath, fileContent + entry);
    } else {
      fs.appendFileSync(filePath, entry);
    }

    console.log(`\n✅ Logged to ${filename}`);
    rl.close();
  });
});
