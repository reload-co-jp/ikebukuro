# Ikebukuro Source List

Sources for recurring Ikebukuro article harvesting. Everything under "Script sources" is fetched by `pnpm harvest list all` / `pnpm harvest scan` (`SOURCES` in `../scripts/harvest.py`). "WebSearch sources" can't be fetched from the agent environment and must be checked by search.

## Script sources

### Local media (high hit rate)

- 池袋タイムズ — `ikebukuro_times`, `ikebukuro_times_event`
  - https://ikebukuro-times.com/ , https://ikebukuro-times.com/archives/category/event
  - Local events, department-store fairs, openings/closures. Often links to the official page — use that as the primary source. Monthly/weekly roundup posts (`event2026xx.html`) are a good list of further candidates.
- 池袋パーク — `ikebukuropark`
  - https://www.ikebukuropark.info/
  - Event pages with dates/venue. Discovery source; confirm on the official page.
- 池袋経済新聞 — `keizai`
  - https://ikebukuro.keizai.biz/
  - Openings, local news, festivals.

### Venues / facilities

- サンシャインシティ イベント — `sunshinecity`
  - https://sunshinecity.jp/event/
  - Exhibition halls, 噴水広場, 展望台 (てんぼうパーク). Shop/restaurant news is filtered out (mostly product promos).
- 池袋PARCO お知らせ — `parco`
  - https://ikebukuro.parco.jp/pnews/
  - Mostly facility notices; P'PARCO pop-ups usually surface via collabocafe instead.
- エソラ池袋 — `esola`
  - https://www.metropro-sc.jp/esola-ikebukuro/
- アニメ東京ステーション — `animetokyo`
  - https://animetokyo.jp/
  - Free anime facility run by 日本動画協会 (池袋). Special exhibitions (企画展), screenings, workshops, talk events. Exhibitions are the main article material; small workshops are low priority.
- 東京芸術劇場 — `geigeki`
  - https://www.geigeki.jp/performance/ (paged `?paged=N`, first 3 pages)
  - Listing row includes dates and hall. Concert/theatre heavy and many year-long series or rental exhibitions — add only notable events (festivals, big productions, free events, 池袋西口公園 tie-ins).
- コニカミノルタプラネタリウム 満天 — `manten`
  - https://planetarium.konicaminolta.jp/manten/
  - Sunshine City. New programs, collaboration screenings, seasonal events. `【全館】` items run at all halls — write them from the 池袋 angle only if 満天 is included.

### Aggregators / discovery

- Collabo Cafe ikebukuro tag — `collabocafe`
  - https://collabo-cafe.com/events/tag/ikebukuro/
  - Collab cafes and pop-ups. Includes other cities' legs of tours — check the Ikebukuro venue (`detail` warns when the page never mentions 池袋).
- PR TIMES 池袋 — `prtimes`
  - https://prtimes.jp/topics/keywords/%E6%B1%A0%E8%A2%8B
- Enjoy Tokyo 池袋 — `enjoytokyo`
  - https://www.enjoytokyo.jp/event/list/area1303/
  - Listing row includes the date range.
- WalkerPlus 豊島区 — `walkerplus`
  - https://www.walkerplus.com/event_list/ar0313116/toshima/ (paged `2.html` ...)
  - Listing row includes dates and venue. Many long-running items; check end dates.
- Google News RSS「池袋」 — `gnews`
  - Redirect URLs; resolve to the real article. Discovery only.
- Ceek.jp News「池袋」 — `ceek`
  - Discovery only; noisy.

## WebSearch sources (not fetchable by the script)

- 東武百貨店 池袋店 催事 — https://www.tobu-dept.jp/ikebukuro/event/ (connection reset). Search `東武百貨店 池袋 催事 <月>` or use 池袋タイムズ coverage.
- 西武池袋本店 — https://www.sogo-seibu.jp/ikebukuro/ (Wix, JS-rendered). Search `西武池袋本店 催事` / `西武池袋 イベント`.
- Hareza池袋 / 東京建物 Brillia HALL / としまえんパーク — https://hareza-ikebukuro.com/ (403). Search `Hareza池袋 イベント`.
- 豊島区 イベント — https://www.city.toshima.lg.jp/ (connection reset). Search `site:city.toshima.lg.jp イベント`.
- サンシャイン水族館 — https://sunshinecity.jp/aquarium/event_performance/event/ (JS-rendered).
- アニメイト池袋本店 — https://www.animate.co.jp/shop/ikebukuro/ (schedule page is JS-rendered).
- 池袋西口公園 GLOBAL RING THEATRE — https://globalring-music.com/ (single landing page, no event list). Search `GLOBAL RING THEATRE 池袋 <月>` / `池袋西口公園 イベント`.
- IWGPグルメ等の単発イベント公式サイト — e.g. https://iwgp-gourmet.com/ . One-event sites with no listing; search `池袋 グルメフェス <年>` / `池袋西口公園 フェス` and confirm on the event's own site.
- トキワ荘マンガミュージアム — https://www.mangamuseum.toshima.tokyo.jp/ (blocked from this environment).
- X.com — search `池袋 イベント`, `池袋 コラボカフェ`, `池袋 POP UP`, `池袋 オープン`, `乙女ロード`, `サンシャインシティ 開催`. Official accounts only; confirm on official pages.

## Quick Search Patterns

- `"<event title>" 池袋`
- `池袋 POP UP <年>年<月>月`
- `サンシャインシティ 展示ホール <月>月`
- `site:<official-domain> "<event keyword>"`
