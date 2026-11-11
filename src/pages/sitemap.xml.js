import { allDays } from '../content.js';

const SITE = 'https://farflungclues.com';
// 静态指南页的 lastmod 取构建时间（每日 CI 重构建即自然前移）。
const buildDate = new Date().toISOString().slice(0, 10);

export function getStaticPaths() {
  return [{ params: {} }];
}

export function GET() {
  const staticPages = ['', 'hints/', 'archive/', 'how-to-play/', 'tiers/', 'farflung-unlimited/', 'farflung-reset-time/', 'games-like-farflung/', 'farflung-meaning/', 'farflung-answer-key/', 'privacy/'];
  const dayPages = allDays().map((day) => ({ path: `archive/${day.day}/`, lastmod: day.day }));
  const urls = [
    ...staticPages.map((p) => `  <url><loc>${SITE}/${p}</loc><lastmod>${buildDate}</lastmod></url>`),
    ...dayPages.map((p) => `  <url><loc>${SITE}/${p.path}</loc><lastmod>${p.lastmod}</lastmod></url>`),
  ].join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
