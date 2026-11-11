import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DAYS = path.join(ROOT, 'src', 'data', 'days');

test('committed day snapshots are complete and spoiler-consistent', () => {
  const files = readdirSync(DAYS).filter((f) => f.endsWith('.json')).sort();
  assert.ok(files.length >= 30, `expected many day files, got ${files.length}`);
  for (const file of files) {
    const day = JSON.parse(readFileSync(path.join(DAYS, file), 'utf8'));
    const date = file.replace('.json', '');
    assert.equal(day.day, date, `${date}: day field matches filename`);
    assert.ok(Number.isInteger(day.expedition) && day.expedition >= 1);
    assert.equal(day.prompts.length, 5, `${date}: five prompts`);
    for (const [i, p] of day.prompts.entries()) {
      assert.ok(p.text && p.id, `${date}[${i}]: id/text`);
      assert.ok(p.answers.length >= 2, `${date}[${i}]: answers`);
      assert.ok(p.hints && p.hints.initials.length > 0, `${date}[${i}]: hints`);
      // every answer has a resolved English name (not a bare code)
      for (const a of p.answers) {
        assert.ok(a.name && !/^[A-Z]{3}$/.test(a.name), `${date}[${i}]: answer name unresolved for ${a.code}`);
      }
    }
  }
});
