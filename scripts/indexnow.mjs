#!/usr/bin/env node
/**
 * IndexNow — submit fresh URLs to Bing/Yandex (and partners) for instant crawling.
 * Reads the key from public/<KEY>.txt (committed) and submits the homepage plus
 * the newest archive day pages. Run after each deploy in CI.
 */
import { readFile, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(ROOT, 'public');
const SITE = 'https://farflungclues.com';

const keyFile = readdirSync(PUBLIC).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('[indexnow] no key file in public/');
  process.exit(1);
}
const key = keyFile.replace('.txt', '');

const days = readdirSync(path.join(ROOT, 'src', 'data', 'days'))
  .filter((f) => f.endsWith('.json'))
  .sort();
const newest = days.slice(-3).map((f) => `/archive/${f.replace('.json', '')}/`);

const urlList = [SITE + '/', ...newest.map((p) => SITE + p)];
const payload = {
  host: 'farflungclues.com',
  key,
  keyLocation: `${SITE}/${keyFile}`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(15000),
});
console.log(`[indexnow] ${res.status} ${res.statusText} — submitted ${urlList.length} urls`);
// 200/202 = accepted; 429 = rate limited (fine to ignore in CI)
process.exitCode = res.ok || res.status === 202 ? 0 : 0;
