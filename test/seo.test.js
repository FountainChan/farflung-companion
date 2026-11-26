import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { allDays, latestDay } from '../src/content.js';
import { GET } from '../src/pages/sitemap.xml.js';

const site = 'https://farflungclues.com';

test('站点地图列出全部历史存档，但排除 canonical 指向首页的当期存档', async () => {
  const sitemap = await GET().text();
  const archiveDays = [...sitemap.matchAll(/<loc>https:\/\/farflungclues\.com\/archive\/([\d-]+)\/<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(archiveDays, allDays().filter((day) => day.day !== latestDay().day).map((day) => day.day));
});

test('隐私页不进入站点地图，但允许抓取以读取 noindex', async () => {
  assert.doesNotMatch(await GET().text(), /<loc>[^<]*\/privacy\//);
  assert.doesNotMatch(readFileSync('public/robots.txt', 'utf8'), /^Disallow:\s*\/privacy\//mi);
});

test('重复域名和存档斜杠永久重定向，正常请求继续交给静态托管', async () => {
  const { default: worker } = await import('../public/_worker.js');
  const assets = { ASSETS: { fetch: (request) => new Response(request.url) } };
  const verify = async (url, expected) => {
    const request = new Request(url);
    const response = await worker.fetch(request, assets);
    assert.equal(response.status, expected ? 301 : 200);
    if (expected) assert.equal(response.headers.get('location'), expected);
    else assert.equal(await response.text(), url);
  };
  await verify('https://www.farflungclues.com/archive//2026-11-10/?source=test', `${site}/archive/2026-11-10/?source=test`);
  await verify('https://www.farflungclues.com/tiers/', `${site}/tiers/`);
  await verify(`${site}/archive//2026-11-10/`, `${site}/archive/2026-11-10/`);
  await verify(`${site}/archive/2026-11-10/`);
  await verify('https://preview.farflung-companion.pages.dev/');
});
