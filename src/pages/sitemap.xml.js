import { allDays } from '../content.js';

const SITE = 'https://farflungclues.com';

export function getStaticPaths() {
  return [{ params: {} }];
}

export function GET() {
  const staticPages = ['', 'hints/', 'archive/', 'how-to-play/', 'tiers/', 'farflung-unlimited/', 'farflung-reset-time/', 'privacy/'];
  const dayPages = allDays().map((day) => `archive/${day.day}/`);
  const urls = [...staticPages, ...dayPages]
    .map((p) => `  <url><loc>${SITE}/${p}</loc></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
