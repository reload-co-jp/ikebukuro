import articlesData from "../data/articles.json"
import { addDays, weekendRange } from "./date"

export const AREAS = {
  east: {
    name: "池袋東口",
    description:
      "サンシャイン60通りやグリーン大通り、乙女ロード周辺など、アニメショップと飲食店が集まる池袋東口エリア。",
  },
  west: {
    name: "池袋西口",
    description:
      "東武百貨店や池袋西口公園（グローバルリング）、東京芸術劇場がある池袋西口エリア。",
  },
  sunshine: {
    name: "サンシャインシティ",
    description:
      "展示ホールや噴水広場、サンシャイン水族館、展望台、プラネタリウムを擁する複合施設サンシャインシティ。",
  },
  station: {
    name: "池袋駅",
    description:
      "JR・東武・西武・東京メトロが乗り入れる池袋駅の構内や改札外イベントスペース。",
  },
  tokiwaso: {
    name: "南長崎・トキワ荘",
    description:
      "トキワ荘マンガミュージアムを中心に、マンガの聖地として親しまれる南長崎・椎名町エリア。",
  },
  mejiro: {
    name: "目白",
    description:
      "目白庭園や自由学園明日館など、落ち着いた雰囲気の文化スポットが点在する目白エリア。",
  },
  citywide: {
    name: "池袋エリア全域",
    description: "池袋駅周辺の複数会場や豊島区内各所で同時開催されるイベント。",
  },
} as const

export type AreaId = keyof typeof AREAS

export const CATEGORIES = {
  anime: { name: "アニメ・マンガ", color: "#22b8d4" },
  collab: { name: "コラボカフェ・POPUP", color: "#ffb400" },
  gourmet: { name: "グルメ", color: "#ff5c8f" },
  art: { name: "展示・アート", color: "#8b6fe0" },
  festival: { name: "フェス・祭り", color: "#e6432f" },
  music: { name: "音楽・ライブ", color: "#4f8ff7" },
  family: { name: "親子・ファミリー", color: "#3cbf7a" },
  seasonal: { name: "季節・ライトアップ", color: "#f08a24" },
} as const

export type CategoryId = keyof typeof CATEGORIES

export type ArticleEvent = {
  name: string
  venue: string
  address?: string
  startDate: string
  /** 終了日未定（ロングラン）の場合は省略する。 */
  endDate?: string
  hours?: string
  price: string
  free: boolean
  reservation: boolean
}

export type Article = {
  id: number
  slug: string
  title: string
  summary: string
  /** Markdown 本文。 */
  content: string
  publishedAt: string
  area: AreaId
  categories: CategoryId[]
  tags: string[]
  sources: { label: string; url: string }[]
  event?: ArticleEvent
}

export type EventArticle = Article & { event: ArticleEvent }

const FAR_FUTURE = "9999-12-31"

const byPublishedDesc = (a: Article, b: Article) =>
  b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id

const byStartAsc = (a: EventArticle, b: EventArticle) =>
  a.event.startDate.localeCompare(b.event.startDate) || a.id - b.id

const byEndAsc = (a: EventArticle, b: EventArticle) =>
  (a.event.endDate ?? FAR_FUTURE).localeCompare(
    b.event.endDate ?? FAR_FUTURE
  ) || a.id - b.id

export const getAllArticles = (): Article[] =>
  [...(articlesData as Article[])].sort(byPublishedDesc)

export const getArticleBySlug = (slug: string): Article | undefined =>
  (articlesData as Article[]).find((a) => a.slug === slug)

export const isEventArticle = (a: Article): a is EventArticle => a.event != null

export const getEventArticles = (): EventArticle[] =>
  getAllArticles().filter(isEventArticle)

/** Whether the event overlaps the inclusive range [from, to]. */
export const overlaps = (event: ArticleEvent, from: string, to: string) =>
  event.startDate <= to && (event.endDate ?? FAR_FUTURE) >= from

export const getEventStatus = (
  event: ArticleEvent,
  today: string
): "upcoming" | "ongoing" | "ended" => {
  if (today < event.startDate) return "upcoming"
  if (today > (event.endDate ?? FAR_FUTURE)) return "ended"
  return "ongoing"
}

/** Events running on `today`, ending soonest first. */
export const getOngoingEvents = (today: string): EventArticle[] =>
  getEventArticles()
    .filter((a) => overlaps(a.event, today, today))
    .sort(byEndAsc)

/** Events starting after `today`, soonest first. */
export const getUpcomingEvents = (today: string): EventArticle[] =>
  getEventArticles()
    .filter((a) => a.event.startDate > today)
    .sort(byStartAsc)

/** Events running at any point in the next `days` days (today included). */
export const getEventsWithin = (today: string, days: number): EventArticle[] =>
  getEventArticles()
    .filter((a) => overlaps(a.event, today, addDays(today, days - 1)))
    .sort(byStartAsc)

export const getWeekendEvents = (today: string): EventArticle[] => {
  const { start, end } = weekendRange(today)
  const events = getEventArticles().filter(
    (a) =>
      overlaps(a.event, start, end) && (a.event.endDate ?? FAR_FUTURE) >= today
  )
  // Events that begin this weekend are the news; long runs follow, ending soonest first.
  const starting = events
    .filter((a) => a.event.startDate >= start)
    .sort(byStartAsc)
  const running = events.filter((a) => a.event.startDate < start).sort(byEndAsc)
  return [...starting, ...running]
}

/** Ongoing events whose last day is within `days` days. */
export const getEndingSoonEvents = (today: string, days = 7): EventArticle[] =>
  getOngoingEvents(today).filter(
    (a) => a.event.endDate != null && a.event.endDate <= addDays(today, days)
  )

export const getFreeEvents = (today: string): EventArticle[] =>
  getEventArticles()
    .filter((a) => a.event.free && (a.event.endDate ?? FAR_FUTURE) >= today)
    .sort(byStartAsc)

export const getArticlesByArea = (area: AreaId): Article[] =>
  getAllArticles().filter((a) => a.area === area)

export const getArticlesByCategory = (category: CategoryId): Article[] =>
  getAllArticles().filter((a) => a.categories.includes(category))

/** Articles sharing area or categories with `article`, best match first. */
export const getRelatedArticles = (article: Article, limit = 4): Article[] =>
  getAllArticles()
    .filter((c) => c.slug !== article.slug)
    .map((c) => ({
      article: c,
      score:
        c.categories.filter((id) => article.categories.includes(id)).length *
          2 +
        (c.area === article.area ? 1 : 0),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || byPublishedDesc(a.article, b.article))
    .slice(0, limit)
    .map((c) => c.article)

export const getAreaIds = (): AreaId[] => Object.keys(AREAS) as AreaId[]

export const getCategoryIds = (): CategoryId[] =>
  Object.keys(CATEGORIES) as CategoryId[]

export const isAreaId = (id: string): id is AreaId => id in AREAS

export const isCategoryId = (id: string): id is CategoryId => id in CATEGORIES

export const getPublishedIso = (article: Article) =>
  `${article.publishedAt}T09:00:00+09:00`

export const getLatestPublishedAt = (): string =>
  getAllArticles()[0]?.publishedAt ?? "1970-01-01"
