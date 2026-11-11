/**
 * Farflung Clues — core helpers shared by the collector and the site.
 *
 * The official game publishes each day's deck as a static file
 * `days/1/<YYYY-MM-DD>.json` on farflung.game. The deck payload is
 * base64 text obfuscated with a repeating XOR key so players cannot
 * peek mid-game. This module decodes and normalizes that payload into
 * the shape used by the site, and derives spoiler-safe hints.
 *
 * Everything here is read-only derivation. It never fabricates answers,
 * tiers or shares: if a field is missing it stays missing.
 */

export const ORIGIN = 'https://farflung.game';
export const INDEX_URL = `${ORIGIN}/days/1/index.json`;
export const dayUrl = (date) => `${ORIGIN}/days/1/${date}.json`;

/** Game day files exist from this date onward. */
export const FIRST_DAY = '2026-10-05';
/** Number of prompts per daily expedition. */
export const PROMPT_COUNT = 5;

/** Rarity tiers, fastest-to-furthest. */
export const TIERS = ['tourist', 'traveller', 'wayfarer', 'uncharted', 'farflung'];
export const TIER_LABELS = {
  tourist: 'Common',
  traveller: 'Uncommon',
  wayfarer: 'Rare',
  uncharted: 'Elusive',
  farflung: 'Farflung',
};

const KEY = new TextEncoder().encode('farflung: no peeking');
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Decode the obfuscated deck string into its JSON array. */
export function decodeDeck(encoded) {
  if (typeof encoded !== 'string' || encoded.length === 0) {
    throw new Error('deck payload missing');
  }
  const bytes = Buffer.from(encoded, 'base64'); // tolerates std/url alphabets
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] ^= KEY[i % KEY.length] ^ ((i * 31) & 255);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function isCalendarDate(text) {
  if (typeof text !== 'string' || !DATE_ONLY.test(text)) return false;
  const [y, m, d] = text.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
}

/** Expedition number: FIRST_DAY is #1. */
export function expeditionNumber(date) {
  if (!isCalendarDate(date)) return null;
  const days = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${FIRST_DAY}T00:00:00Z`)) / 86400000);
  return days >= 0 ? days + 1 : null;
}

/** YYYY-MM-DD of "today" in a given IANA zone (defaults to the runtime zone). */
export function todayIn(zone = Intl.DateTimeFormat().resolvedOptions().timeZone, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(now);
}

/** The game opens a new expedition at midnight, the player's local time. */
export function nextLocalMidnight(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next;
}

/** One-line feature for archive listings: theme derived from the first prompt's slug id. */
export function expeditionTheme(day) {
  const first = day.prompts?.[0];
  if (!first) return '';
  if (first.id) {
    return first.id
      .split(/[-_]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return first.text.split(/\s+/).slice(0, 5).join(' ');
}

/** Group one prompt's answers by tier, keeping the official order. */
export function groupByTier(answers) {
  const groups = {};
  for (const tier of TIERS) groups[tier] = [];
  for (const answer of answers || []) {
    if (groups[answer.tier]) groups[answer.tier].push(answer);
  }
  return groups;
}

/**
 * Spoiler-safe derived hints for one prompt. Derived only from the deck's
 * shape (counts, initials, lengths); never reveals an answer outright.
 */
export function deriveHints(prompt) {
  const named = (prompt.answers || []).filter((a) => a.name);
  const initials = [...new Set(named.map((a) => a.name[0].toUpperCase()))].sort();
  const top = named[0] || null;
  return {
    answerCount: (prompt.answers || []).length,
    farflungCount: groupByTier(prompt.answers || []).farflung.length,
    initials,
    topHint: top
      ? { initials: top.name.split(/\s+/).map((w) => w[0].toUpperCase()).join(' '), letters: top.name.replace(/\s+/g, '').length }
      : null,
  };
}

/** Normalize one decoded deck into the site's day record. */
export function normalizeDay(raw, countryName, day) {
  if (!Array.isArray(raw) || raw.length !== PROMPT_COUNT) {
    throw new Error(`expected ${PROMPT_COUNT} prompts`);
  }
  const prompts = raw.map((p) => {
    const answers = (p.answers || []).map((a) => ({
      code: a.code,
      name: countryName(a.code) || a.code,
      share: typeof a.share === 'number' ? Math.round(a.share * 1000) / 1000 : null,
      tier: TIERS.includes(a.tier) ? a.tier : null,
    }));
    const tiers = {};
    for (const [tier, list] of Object.entries(groupByTier(answers))) {
      tiers[tier] = list.length;
    }
    return {
      id: p.id,
      text: p.text,
      accepts: p.accepts || null,
      note: p.note || null,
      gems: Array.isArray(p.gems) ? p.gems : [],
      gemNote: p.gemNote || null,
      answers,
      tiers,
      hints: null, // filled below
    };
  });
  const dayRecord = { day: day || null, expedition: expeditionNumber(day), prompts };
  for (const p of dayRecord.prompts) p.hints = deriveHints(p);
  return dayRecord;
}
