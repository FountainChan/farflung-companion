#!/usr/bin/env node
/** Validate committed data snapshots: shapes, tiers, date ordering. */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DAYS = path.join(ROOT, 'src', 'data', 'days');
const TIERS = new Set(['tourist', 'traveller', 'wayfarer', 'uncharted', 'farflung']);
let failures = 0;
const fail = (msg) => { failures += 1; console.error(`FAIL ${msg}`); };

const files = (await readdir(DAYS)).filter((f) => f.endsWith('.json')).sort();
if (files.length === 0) fail('no day files found');

for (const file of files) {
  const date = file.replace('.json', '');
  let day;
  try { day = JSON.parse(await readFile(path.join(DAYS, file), 'utf8')); }
  catch { fail(`${date}: not valid JSON`); continue; }
  if (!Array.isArray(day.prompts) || day.prompts.length !== 5) fail(`${date}: prompts !== 5`);
  for (const [i, p] of (day.prompts || []).entries()) {
    if (!p.id || !p.text) fail(`${date}[${i}]: missing id/text`);
    if (!Array.isArray(p.answers) || p.answers.length < 2) fail(`${date}[${i}]: too few answers`);
    for (const a of p.answers || []) {
      if (!TIERS.has(a.tier)) fail(`${date}[${i}]: bad tier ${a.tier}`);
      if (!a.code || !a.name) fail(`${date}[${i}]: answer missing code/name`);
    }
    if (!p.hints || typeof p.hints.answerCount !== 'number') fail(`${date}[${i}]: missing hints`);
  }
}

console.log(failures === 0 ? `OK: ${files.length} day files valid` : `${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
