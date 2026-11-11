# Farflung Clues

An independent, unofficial companion site for [Farflung](https://farflung.game), the daily geography game — hints, answer archives, tier explanations and reset-time guidance. Built as a sibling of the Krillion Clues companion (same product pattern: daily answers + spoiler-safe hints + archive + evergreen guide pages).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Today's expedition: five prompts, spoiler-safe hints, reveal-gated answer tables, local-midnight countdown |
| `/hints/` | Spoiler-free clue index |
| `/archive/` + `/archive/<date>/` | Every collected expedition with full tier tables |
| `/how-to-play/` | Rules & scoring guide |
| `/tiers/` | The five rarity tiers, with observed frequencies |
| `/farflung-unlimited/` | Official status of an endless mode + practice advice (targets `farflung unlimited` searches) |
| `/farflung-reset-time/` | Local-midnight reset explainer + live countdown |
| `/privacy/` | noindex privacy page (no cookies, no analytics) |

## Data pipeline

The official game ships each day's deck as an obfuscated static file (`days/1/<date>.json` on farflung.game — base64 payload XOR-masked so players cannot peek mid-game). Our collector decodes it and normalizes it into snapshots the static build consumes:

```bash
npm run fetch-days     # collect new day files → src/data/days/*.json
npm run validate-data  # shape-check every snapshot
npm test               # unit + data tests
npm run build          # static site → dist/
```

Safety rules in the collector:

- **Never collects a day newer than today (UTC)** — future decks exist on the official CDN and stay private.
- Fails closed on unexpected shapes; never fabricates answers, tiers or shares.
- Non-ISO territory codes used by the game are aliased (`XKX` → Kosovo, `CYN` → Northern Cyprus, `ATC` → Akrotiri).
- Country names come from the [world-countries](https://www.npmjs.com/package/world-countries) dataset (ODbL-derived; committed to `src/data/countries.json`).

A scheduled GitHub Action (`.github/workflows/update-data.yml`) refreshes the data daily and rebuilds, so the site stays current without manual runs.

## Deployment

Any static host works; the site is plain Astro `output: 'static'` with no server runtime. For Cloudflare Pages / Netlify / GitHub Pages, point the build command at `npm run build` and publish `dist/`. Set the production domain in `astro.config.mjs` (`site`) and `src/layouts/BaseLayout.astro` (`SITE`).

## Local development

```bash
npm ci
npm run dev        # http://127.0.0.1:4322
```

## Legal & attribution

- **Not affiliated** with Farflung or Farflung LLC. "Farflung" is the game's trademark; this site is a non-official reference/companion and clearly labels itself as such on every page.
- Day files are read from the game's public CDN. Readability is not permission: **before operating this site commercially, confirm reuse/redistribution rights with the publisher** (contact: hello@farflung.game per the official site). Answer lists are kept behind reveal clicks and generated summaries rather than wholesale republication, and any takedown request should be honored promptly.
- Country names: world-countries dataset (CC ODbL-ish; see upstream for details).
- Code: MIT (see `LICENSE`).

## Repository

https://github.com/YOUR_ACCOUNT/farflung-companion
