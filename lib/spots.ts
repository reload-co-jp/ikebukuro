import {
  getAllArticles,
  getEventStatus,
  isEventArticle,
  type AreaId,
  type Article,
  type EventArticle,
} from "./articles"

export type Spot = {
  /** URL segment under /spots/. */
  id: string
  name: string
  /** Short name used in headings, e.g. 「東武百貨店」. */
  shortName: string
  /** What people search for, used in the page title, e.g. 「催事・イベント」. */
  topic: string
  area: AreaId
  address?: string
  description: string
  /**
   * Strings that identify the spot in an article's event venue, tags or
   * title. Matching is a plain substring test, so keep them specific.
   */
  match: string[]
}

/**
 * Major Ikebukuro venues that get a landing page. These target searches such
 * as 「サンシャインシティ イベント」 or 「東武百貨店 池袋 催事」, which the
 * area pages (east / west …) are too broad to rank for.
 */
export const SPOTS: Spot[] = [
  {
    id: "sunshine-city",
    name: "サンシャインシティ",
    shortName: "サンシャインシティ",
    topic: "イベント",
    area: "sunshine",
    address: "東京都豊島区東池袋3-1",
    description:
      "展示ホール、噴水広場、サンシャイン水族館、サンシャイン60展望台 てんぼうパーク、プラネタリウム満天、ナンジャタウンなどが集まる池袋東口の複合施設。物産展やアニメ・ゲームの展示、リリースイベントが毎週のように開かれる。",
    match: [
      "サンシャインシティ",
      "サンシャイン60",
      "サンシャイン水族館",
      "てんぼうパーク",
      "ナンジャタウン",
      "プラネタリウム満天",
      "サンシャインシティプリンスホテル",
    ],
  },
  {
    id: "sunshine-city-exhibition-hall",
    name: "サンシャインシティ 展示ホール",
    shortName: "展示ホール",
    topic: "イベント・展示会",
    area: "sunshine",
    description:
      "サンシャインシティのワールドインポートマートビルと文化会館ビルにある展示ホールA〜D。全国の物産展、アニメ・マンガの展覧会、即売会や体験型イベントの会場になる。",
    match: ["展示ホール"],
  },
  {
    id: "sunshine-aquarium",
    name: "サンシャイン水族館",
    shortName: "サンシャイン水族館",
    topic: "イベント・特別展",
    area: "sunshine",
    description:
      "サンシャインシティ ワールドインポートマートビル屋上にある都市型水族館。季節の特別展やアニメ・ゲームとのコラボイベントを定期的に開催している。",
    match: ["サンシャイン水族館"],
  },
  {
    id: "tenbou-park",
    name: "サンシャイン60展望台 てんぼうパーク",
    shortName: "てんぼうパーク",
    topic: "イベント",
    area: "sunshine",
    description:
      "サンシャイン60の60階、海抜251mにある展望台。芝生エリアのある「公園」がテーマで、季節イベントやコラボ企画、初日の出の特別営業などを行う。",
    match: ["てんぼうパーク", "サンシャイン60展望台"],
  },
  {
    id: "tobu-ikebukuro",
    name: "東武百貨店 池袋本店",
    shortName: "東武百貨店",
    topic: "催事・物産展",
    area: "west",
    address: "東京都豊島区西池袋1-1-25",
    description:
      "池袋駅西口に直結する百貨店。8階催事場ではパン祭や各地の物産展、ポップアップストアなどの催事が週替わりで開かれる。",
    match: ["東武百貨店", "池袋東武"],
  },
  {
    id: "seibu-ikebukuro",
    name: "西武池袋本店",
    shortName: "西武池袋本店",
    topic: "催事・イベント",
    area: "east",
    address: "東京都豊島区南池袋1-28-1",
    description:
      "池袋駅東口に直結する百貨店。催事やフロアリニューアルのほか、別館の三省堂書店 池袋本店ではマンガ・アニメのPOP UPも開かれる。",
    match: ["西武池袋本店", "三省堂書店 池袋本店"],
  },
  {
    id: "ikebukuro-parco",
    name: "池袋PARCO・P'PARCO",
    shortName: "池袋PARCO",
    topic: "POP UP・イベント",
    area: "east",
    address: "東京都豊島区南池袋1-28-2",
    description:
      "池袋駅東口の池袋PARCO本館と別館P'PARCO。アニメ・キャラクターのPOP UP STOREやタイアップ企画が数多く開かれる。",
    match: ["池袋PARCO", "池袋パルコ", "P'PARCO"],
  },
  {
    id: "tokyo-geigeki",
    name: "東京芸術劇場",
    shortName: "東京芸術劇場",
    topic: "公演・イベント",
    area: "west",
    address: "東京都豊島区西池袋1-8-1",
    description:
      "池袋西口公園に面した劇場・コンサートホール。演劇やコンサートのほか、劇場ツアーやワークショップなど一般参加できる企画もある。",
    match: ["東京芸術劇場"],
  },
  {
    id: "ikebukuro-west-gate-park",
    name: "池袋西口公園（グローバルリング）",
    shortName: "池袋西口公園",
    topic: "イベント",
    area: "west",
    address: "東京都豊島区西池袋1-8-26",
    description:
      "野外劇場「グローバルリングシアター」がある池袋西口の公園。音楽フェスやマルシェ、地域のお祭りの会場になる。",
    match: ["池袋西口公園", "グローバルリング"],
  },
  {
    id: "hareza-ikebukuro",
    name: "Hareza池袋・中池袋公園",
    shortName: "Hareza池袋",
    topic: "イベント",
    area: "east",
    description:
      "劇場・ホール・シネコンが集まるHareza池袋と、隣接する中池袋公園。アニメのコラボ企画や公園でのイベントがよく開かれる。",
    match: ["Hareza", "ハレザ", "中池袋公園", "としま区民センター"],
  },
  {
    id: "anime-tokyo-station",
    name: "アニメ東京ステーション",
    shortName: "アニメ東京ステーション",
    topic: "企画展・イベント",
    area: "east",
    description:
      "日本のアニメの歴史と最新作を紹介する池袋の施設。人気作品の企画展や上映会、ワークショップを開催している。",
    match: ["アニメ東京ステーション"],
  },
  {
    id: "tokiwaso",
    name: "トキワ荘マンガミュージアム・トキワ荘通り",
    shortName: "トキワ荘",
    topic: "企画展・イベント",
    area: "tokiwaso",
    description:
      "手塚治虫らが暮らしたアパートを再現した豊島区立トキワ荘マンガミュージアムと、南長崎のトキワ荘通り周辺。マンガ家の企画展や昭和レトロのイベントが開かれる。",
    match: ["トキワ荘"],
  },
  {
    id: "mejiro-garden",
    name: "豊島区立目白庭園",
    shortName: "目白庭園",
    topic: "イベント・ライトアップ",
    area: "mejiro",
    address: "東京都豊島区目白3-20-18",
    description:
      "JR目白駅から徒歩5分の池泉回遊式の日本庭園。数寄屋造りの「赤鳥庵」での催しや、秋の紅葉ライトアップが人気。",
    match: ["目白庭園"],
  },
]

/** Spots need at least this many articles to get a page (avoid thin pages). */
export const MIN_SPOT_ARTICLES = 2

const haystack = (a: Article) =>
  [a.event?.venue ?? "", a.title, ...a.tags].join("\n")

export const spotMatches = (spot: Spot, article: Article) => {
  const text = haystack(article)
  return spot.match.some((m) => text.includes(m))
}

export const getSpotArticles = (spot: Spot): Article[] =>
  getAllArticles().filter((a) => spotMatches(spot, a))

/** Spots with enough articles to publish a page. */
export const getSpots = (): Spot[] =>
  SPOTS.filter((s) => getSpotArticles(s).length >= MIN_SPOT_ARTICLES)

export const getSpotById = (id: string): Spot | undefined =>
  getSpots().find((s) => s.id === id)

/**
 * The most specific published spot for an article: the one whose match
 * strings appear in the event venue first, preferring later (narrower)
 * entries such as 展示ホール over サンシャインシティ.
 */
export const getSpotForArticle = (article: Article): Spot | undefined => {
  const spots = getSpots()
  const venue = article.event?.venue ?? ""
  const byVenue = spots.filter((s) => s.match.some((m) => venue.includes(m)))
  if (byVenue.length > 0) return byVenue[byVenue.length - 1]
  return spots.filter((s) => spotMatches(s, article)).at(-1)
}

/** Narrowest published spot whose match strings include this exact tag. */
export const getSpotForTag = (tag: string): Spot | undefined =>
  getSpots()
    .filter((s) => s.match.includes(tag) || s.shortName === tag)
    .at(-1)

/** Ongoing and upcoming events at the spot, ongoing first, by start date. */
export const getSpotCurrentEvents = (
  spot: Spot,
  today: string
): EventArticle[] =>
  getSpotArticles(spot)
    .filter(isEventArticle)
    .filter((a) => getEventStatus(a.event, today) !== "ended")
    .sort(
      (a, b) =>
        a.event.startDate.localeCompare(b.event.startDate) || a.id - b.id
    )
