---
name: ikebukuro-article-harvester
description: >
  Use this skill when asked to find, collect, or add new Ikebukuro-related
  articles (池袋の新着記事・イベントを拾う／記事を追加) by checking recurring
  source sites for events, collaboration cafes, pop-ups, gourmet fairs,
  exhibitions, store openings/closures and other happenings in Ikebukuro and
  the rest of 豊島区 (目白, 南長崎・トキワ荘, 大塚, 巣鴨 ...). It prioritizes bulk
  harvesting: collect many candidates, remove duplicates against
  `data/articles.json`, confirm facts from official sources, then add every
  safely verified non-duplicate article in one pass.
metadata:
  short-description: 池袋記事候補を重複除外し一括記事化する
---

# Ikebukuro Article Harvester

Find new article candidates for イケブクロLive from a fixed set of sources, dedupe, confirm facts, then write entries in `data/articles.json`.

Use when asked "池袋の記事を追加", "新しい記事を拾って", "イベントを巡回して追加", "harvest", or given a source-list page instead of one specific event page.

## Quick Start

1. Read [references/source-list.md](references/source-list.md).
2. Run `pnpm harvest scan > tmp/scan.log 2>&1` (no agent needed). It lists every source, dedups each row against `data/articles.json` and `references/excluded-candidates.jsonl`, fetches `detail` for each `new` row in parallel, and writes `tmp/harvest-queue.json`:
   - `new` — no match; has `detail` (`title`, `ogdesc`, `facts`, `warning`).
   - `maybe_dup` — has `matches`; open the listed slugs and compare venue/dates. Also the merge-check queue.
   - `needs_resolve` — Google News redirect; resolve the real article URL (WebSearch the exact title), then `pnpm harvest dedup`.
   - `errors` — sources that failed to fetch; rerun once, then fall back to WebSearch.
     Read the queue with a small script (e.g. `python3 -c` printing status/source/title/url) rather than the raw JSON — it is large.
3. Run the WebSearch sweep for sources the script cannot fetch (東武百貨店, Hareza池袋, 豊島区, サンシャイン水族館, X.com — see source list).
4. Triage. A `detail.warning` ("never mentions 池袋/豊島区") means the page is out of scope — drop or log it. The warning is weak, though: collabocafe pages mention 池袋 in their sidebar tags, so for tour-style pop-ups (collabocafe, prtimes, gnews) always confirm the Ikebukuro venue in `ogdesc`/`facts`.
5. Dedupe every remaining candidate in one batch: `pnpm harvest dedup "<keyword>|<url>" ... > tmp/dedup.txt 2>&1`, then read the file.
6. Confirm facts for each candidate from the primary/official page (date, venue, price, hours, reservation). Delegate batched page fetches to the `web-scraper` agent when there are many URLs; keep editorial decisions here.
7. Write all new articles and merges in one edit of `data/articles.json` (see [Article Format](#article-format)), log every held/rejected URL with `pnpm harvest exclude`, then run `pnpm test` and `pnpm build`.

## Harvest Script

`pnpm harvest <subcommand>` = `python3 .claude/skills/ikebukuro-article-harvester/scripts/harvest.py <subcommand>`.

- `scan [out.json]` — list all → dedup → detail for `new` → `tmp/harvest-queue.json`.
- `list <source|all> [--all]` — `(title, url)` rows per source. Collapses syndicated duplicate titles to one row with `(xN)`, drops crime/accident noise, and skips URLs already in `sources[].url` or in the excluded log (`--all` disables the skip).
- `detail <url>...` — prints `TITLE` / `OGDESC` / `FACTS` (date, venue, price, reservation lines) and a warning when the page never mentions an Ikebukuro/豊島区 area word.
- `dedup "<keyword>|<url>" ...` — text match on title/summary/content, short keyword match (bracketed names, katakana, latin words), exact normalized source-URL match, and romanized URL-token vs slug match. Also prints `PREVIOUSLY EXCLUDED`.
- `exclude "<url>" "<reason>" "<note>"` — append to `references/excluded-candidates.jsonl`.
- `next-id` — next free `id` for a new article.

Sources and their parsing notes live in the `SOURCES` dict at the top of the script. If a site changes its HTML and a source returns 0 rows, fix the entry there so the fix persists.

## Candidate Rules

Include:

- Events, fairs, pop-ups, collaboration cafes, exhibitions, live/stage events, festivals, workshops, seasonal illuminations, gourmet fairs (incl. 百貨店の催事).
- Non-event happenings with clear reader value: notable store openings/reopenings/closures, facility renewals, area changes, public notices affecting visitors.
- Places in 豊島区: 池袋東口・西口, サンシャインシティ, 池袋駅, 乙女ロード, 南長崎・トキワ荘, 目白, 大塚, 巣鴨, 雑司が谷, etc.

Exclude:

- Routine shop promotions (new apparel items, monthly recommendations, ordinary new menu items) with no event angle.
- Generic national campaigns with no Ikebukuro venue; other cities' legs of a tour.
- Crime/accident news (train accidents, incidents) unless it has a lasting visitor impact (closures, access restrictions).
- Events that have already ended.
- Items whose core facts (date + venue for events; date + place + impact for news) cannot be confirmed from a reliable source.
- Items already in `data/articles.json`.

Held/rejected candidates are logged with a `reason`: `out_of_scope_area`, `event_ended`, `not_ikebukuro_specific`, `insufficient_facts`, `low_value`. Log per candidate as you go. Do not log true duplicates (their URL is added to `sources` instead).

## Duplicate Check

Title keywords alone under-detect duplicates: aggregators use colloquial/short titles while articles here use formal ones. Always run the batched `dedup` with both a keyword and the URL.

- A match is a signal, not proof — open the existing article and compare venue and dates. A recurring franchise at a new venue or a new run is `new`.
- `SOURCE URL MATCH` = existing article.
- On a duplicate, merge-check the newer source: add it to `sources` (official first, deduped by normalized URL) and merge newly confirmed facts (performers, goods, menu, prices, hours, reservation rules) into `summary` / `content` / `event`. Don't change `slug`, `id` or `publishedAt`.
- Keep a ledger while working: `new` / `merge` / `duplicate` / `hold`.

## Source Priority

1. Official event / venue / shop / organizer page, official ticket page, official press release.
2. Official SNS posts.
3. Local media and aggregators (池袋タイムズ, 池袋パーク, 池袋経済新聞, Collabo Cafe, Enjoy Tokyo, WalkerPlus, PR TIMES) — good for discovery; always look for the official page and list it first in `sources`.

X.com and news aggregators are discovery only — never write from an unverified post.

## Article Format

Follow the schema in `README.md` (「記事の追加」) and `lib/articles.ts`:

- `id`: `pnpm harvest next-id` (increment for each new article in the batch).
- `slug`: lowercase ASCII, digits and hyphens; descriptive English/romaji, usually ending with the year (e.g. `kagawa-fair-sunshine-city-2026`).
- `title`: formal Japanese headline naming the event, venue and the key hook.
- `summary`: 1–2 sentences with dates and venue (used as the description).
- `content`: Markdown with `## 概要`, `## 内容`, `## 開催情報` (bulleted **イベント名** / **会期** / **会場** / **料金** etc.), `## こんな人におすすめ`. Write only facts the sources state.
- `publishedAt`: today (JST, `YYYY-MM-DD`). The array must stay sorted newest first — insert new articles at the top.
- `area`: one of `east`, `west`, `sunshine`, `station`, `tokiwaso`, `mejiro`, `citywide`.
- `categories`: from `anime`, `collab`, `gourmet`, `art`, `festival`, `music`, `family`, `seasonal` (main one first).
- `tags`: venue, IP/brand and topic keywords.
- `sources`: every page used, official first, with clear labels (`公式サイト`, `サンシャインシティ イベントページ`, `PR TIMES プレスリリース`, `池袋タイムズ 記事` ...).
- `event`: only for dated events — `name`, `venue`, `address` (optional), `startDate`, `endDate` (omit if open-ended), `hours` (optional), `price`, `free`, `reservation`.
- No images: this site does not reprint third-party photos; thumbnails are generated from the category color.

## Output When Harvesting

Implement directly, then report compactly:

- `追加`: new slugs
- `マージ`: existing slugs updated (what was added)
- `重複`: merge-checked with nothing new
- `保留`: reason (each logged to `references/excluded-candidates.jsonl`)
- `確認`: `pnpm test` and `pnpm build` results
