#!/usr/bin/env node
/**
 * Collector — fetch farflung.game day files, decode, normalize and store
 * JSON snapshots the site builds from.
 *
 * - src/data/days-index.json : { days: [...], fetchedAt, source }
 * - src/data/days/<date>.json: normalized day record
 * - src/data/countries.json  : ISO alpha-3 → name (fetched once, kept in repo)
 *
 * Safety rules:
 * - never writes a day newer than today (UTC); future decks stay private;
 * - fails closed on any unexpected shape; partial writes never happen
 *   (files are written after the whole run validates).
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDEX_URL, dayUrl, decodeDeck, isCalendarDate, normalizeDay, todayIn, FIRST_DAY } from '../src/farflung.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA = path.join(ROOT, 'src', 'data');

const UA = 'FarflungBot/0.1 (companion site; contact via repository issues)';
const TIMEOUT_MS = 15000;

/** Non-ISO codes the game uses for special territories. */
const COUNTRY_ALIASES = {
  XKX: 'Kosovo',
  CYN: 'Northern Cyprus',
  ATC: 'Akrotiri',
};

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

async function ensureCountries() {
  const file = path.join(DATA, 'countries.json');
  try {
    const map = JSON.parse(await readFile(file, 'utf8'));
    if (map && typeof map === 'object' && Object.keys(map).length > 100) return map;
    throw new Error('countries.json too small');
  } catch {
    const list = await getJson('https://unpkg.com/world-countries@5/countries.json');
    const map = {};
    for (const c of list) if (c.cca3 && c.name?.common) map[c.cca3] = c.name.common;
    await mkdir(DATA, { recursive: true });
    await writeFile(file, `${JSON.stringify(map, null, 2)}\n`);
    return map;
  }
}

async function main() {
  const countries = await ensureCountries();
  const countryName = (code) => countries[code] || COUNTRY_ALIASES[code] || null;

  const index = await getJson(INDEX_URL);
  if (!index || !Array.isArray(index.days)) throw new Error('bad index: missing days[]');

  const todayUtc = todayIn('UTC');
  const days = index.days.filter((d) => isCalendarDate(d) && d >= FIRST_DAY && d <= todayUtc);
  const skippedFuture = index.days.length - days.length;

  await mkdir(path.join(DATA, 'days'), { recursive: true });
  let written = 0;
  const errors = [];
  for (const date of days) {
    try {
      const raw = await getJson(dayUrl(date));
      const deck = decodeDeck(raw.deck);
      const record = normalizeDay(deck, countryName, date);
      const file = path.join(DATA, 'days', `${date}.json`);
      await writeFile(file, `${JSON.stringify(record, null, 2)}\n`);
      written += 1;
    } catch (err) {
      errors.push(`${date}: ${err.message}`);
    }
  }

  const manifest = {
    source: INDEX_URL,
    origin: 'https://farflung.game',
    fetchedAt: new Date().toISOString(),
    dataThrough: todayUtc,
    daysTotal: index.days.length,
    daysSkippedFutureOrRecent: skippedFuture,
    daysWritten: written,
    firstDay: FIRST_DAY,
    errors,
  };
  await writeFile(path.join(DATA, 'days-index.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`[fetch-days] wrote ${written}/${days.length} days (skipped ${skippedFuture} future entries), errors: ${errors.length}`);
  if (errors.length) {
    for (const e of errors) console.error(`[fetch-days] ${e}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[fetch-days] fatal:', err.message);
  process.exit(1);
});
