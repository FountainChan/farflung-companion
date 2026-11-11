/** Site content helpers — load and query committed day snapshots. */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Astro always runs from the project root; bundled builds cannot rely on import.meta.url.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'src', 'data');
const DAYS_DIR = path.join(DATA_DIR, 'days');

let cache = null;

function loadAll() {
  if (cache) return cache;
  const days = [];
  for (const file of readdirSync(DAYS_DIR)) {
    if (!file.endsWith('.json')) continue;
    days.push(JSON.parse(readFileSync(path.join(DAYS_DIR, file), 'utf8')));
  }
  days.sort((a, b) => a.day.localeCompare(b.day));
  cache = days;
  return days;
}

/** All collected day records, oldest first. Each record carries its `day` date. */
export function allDays() {
  return loadAll();
}

/** Latest collected day (used as "today" for the static build). */
export function latestDay() {
  const days = loadAll();
  return days[days.length - 1] || null;
}

export function getDay(date) {
  return loadAll().find((d) => d.day === date) || null;
}

export function dayStats() {
  const days = loadAll();
  let answers = 0;
  let farflung = 0;
  for (const day of days) {
    for (const prompt of day.prompts) {
      answers += prompt.answers.length;
      farflung += prompt.tiers.farflung || 0;
    }
  }
  return { days: days.length, answers, farflung };
}
