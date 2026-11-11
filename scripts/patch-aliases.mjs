#!/usr/bin/env node
/** One-off: patch unresolved territory names in existing day snapshots. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DAYS = path.join(ROOT, 'src', 'data', 'days');
const ALIASES = { XKX: 'Kosovo', CYN: 'Northern Cyprus', ATC: 'Akrotiri' };

let patched = 0;
for (const file of readdirSync(DAYS).filter((f) => f.endsWith('.json'))) {
  const full = path.join(DAYS, file);
  const day = JSON.parse(readFileSync(full, 'utf8'));
  let changed = false;
  for (const p of day.prompts) {
    for (const a of p.answers) {
      if (/^[A-Z]{3}$/.test(a.name) && ALIASES[a.name]) { a.name = ALIASES[a.name]; changed = true; patched += 1; }
    }
    const initials = [...new Set(p.answers.map((a) => a.name[0].toUpperCase()))].sort();
    if (JSON.stringify(p.hints.initials) !== JSON.stringify(initials)) { p.hints.initials = initials; changed = true; }
  }
  if (changed) writeFileSync(full, `${JSON.stringify(day, null, 2)}\n`);
}
console.log(`patched ${patched} answer names`);
