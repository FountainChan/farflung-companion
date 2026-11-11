import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeDeck, expeditionNumber, isCalendarDate, normalizeDay,
  deriveHints, groupByTier, TIERS, todayIn, nextLocalMidnight,
} from '../src/farflung.js';

test('decodeDeck round-trips the known obfuscation', () => {
  // Build an encoded payload from a known deck by inverting the transform.
  const deck = [{ id: 'a', text: 't', answers: [{ code: 'JPN', share: 0.2, tier: 'tourist' }] }];
  const key = new TextEncoder().encode('farflung: no peeking');
  const bytes = new TextEncoder().encode(JSON.stringify(deck));
  for (let i = 0; i < bytes.length; i += 1) bytes[i] ^= key[i % key.length] ^ ((i * 31) & 255);
  const encoded = Buffer.from(bytes).toString('base64');
  assert.deepEqual(decodeDeck(encoded), deck);
});

test('decodeDeck rejects bad input', () => {
  assert.throws(() => decodeDeck(''));
  assert.throws(() => decodeDeck(null));
  assert.throws(() => decodeDeck('!!!not-base64!!!'));
});

test('isCalendarDate rejects impossible dates', () => {
  assert.equal(isCalendarDate('2026-11-11'), true);
  assert.equal(isCalendarDate('2026-02-30'), false);
  assert.equal(isCalendarDate('2026-13-01'), false);
  assert.equal(isCalendarDate('oops'), false);
});

test('expeditionNumber counts from FIRST_DAY as #1', () => {
  assert.equal(expeditionNumber('2026-10-05'), 1);
  assert.equal(expeditionNumber('2026-10-06'), 2);
  assert.equal(expeditionNumber('2026-11-11'), 38);
  assert.equal(expeditionNumber('2026-10-04'), null);
  assert.equal(expeditionNumber('nonsense'), null);
});

const prompts = [
  {
    id: 'p1', text: 'Pin a country in Europe',
    answers: [
      { code: 'DEU', share: 0.4, tier: 'tourist' },
      { code: 'BEL', share: 0.1, tier: 'wayfarer' },
      { code: 'LIE', share: 0.02, tier: 'farflung' },
    ],
  },
];

test('normalizeDay enforces five prompts and groups tiers', () => {
  const name = () => 'X';
  assert.throws(() => normalizeDay([], name, '2026-11-11'));
  const five = [];
  for (let i = 0; i < 5; i += 1) five.push(JSON.parse(JSON.stringify(prompts[0])));
  const day = normalizeDay(five, name, '2026-11-11');
  assert.equal(day.day, '2026-11-11');
  assert.equal(day.expedition, 38);
  assert.equal(day.prompts.length, 5);
  const p = day.prompts[0];
  assert.deepEqual(groupByTier(p.answers).farflung.length, 1);
  assert.equal(p.tiers.tourist, 1);
  assert.equal(p.tiers.wayfarer, 1);
  assert.equal(p.tiers.farflung, 1);
  assert.equal(p.hints.answerCount, 3);
  assert.equal(p.hints.farflungCount, 1);
  assert.ok(p.hints.initials.includes('X'));
});

test('deriveHints hides answer values', () => {
  const hints = deriveHints(prompts[0]); // raw answers carry code only, no name
  const json = JSON.stringify(hints);
  assert.ok(!json.includes('DEU'));
  assert.ok(!json.includes('LIE'));
  assert.equal(hints.topHint, null); // nothing leakable without a name
  assert.equal(hints.answerCount, 3);
});

test('tier list order is fastest-to-furthest', () => {
  assert.deepEqual(TIERS, ['tourist', 'traveller', 'wayfarer', 'uncharted', 'farflung']);
});

test('todayIn formats per zone', () => {
  const now = new Date('2026-11-11T18:00:00Z');
  assert.equal(todayIn('UTC', now), '2026-11-11');
  assert.equal(todayIn('Asia/Shanghai', now), '2026-11-12');
});

test('nextLocalMidnight is tomorrow at 00:00 local', () => {
  const now = new Date(2026, 10, 11, 23, 30, 0); // local
  const next = nextLocalMidnight(now);
  assert.equal(next.getHours(), 0);
  assert.equal(next.getDate(), 12);
});
