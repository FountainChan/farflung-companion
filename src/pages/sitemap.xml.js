import { allDays, latestDay } from '../content.js';

const SITE = 'https://farflungclues.com';

export function GET() {
  const staticPages = ['', 'hints/', 'archive/', 'how-to-play/', 'tiers/', 'farflung-unlimited/', 'farflung-reset-time/', 'games-like-farflung/', 'farflung-meaning/', 'farflung-answer-key/'];
  const dayPages = allDays().filter((day) => day.day !== latestDay().day);
  const urls = [
    ...staticPages.map((p) => `  <url><loc>${SITE}/${p}</loc></url>`),
    ...dayPages.map((day) => `  <url><loc>${SITE}/archive/${day.day}/</loc></url>`),
  ].join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
