export const EVENT_NAV = [
  { href: "/events/today/", label: "今日" },
  { href: "/events/this-weekend/", label: "今週末" },
  { href: "/events/this-week/", label: "1週間" },
  { href: "/events/free/", label: "無料" },
  { href: "/events/", label: "すべて" },
] as const

/** Pill buttons in the header (pink / cyan / yellow, as on the Akiba site). */
export const HEADER_NAV = [
  { href: "/events/", label: "イベント" },
  { href: "/areas/", label: "エリア" },
  { href: "/articles/", label: "新着" },
] as const

export const SIDEBAR_NAV = [
  { href: "/", label: "ホーム" },
  { href: "/events/today/", label: "今日のイベント" },
  { href: "/events/this-weekend/", label: "今週末のイベント" },
  { href: "/events/this-week/", label: "1週間以内のイベント" },
  { href: "/events/free/", label: "無料イベント" },
  { href: "/events/", label: "イベント一覧" },
  { href: "/categories/anime/", label: "アニメ・マンガ" },
  { href: "/categories/collab/", label: "コラボカフェ・POPUP" },
  { href: "/categories/gourmet/", label: "池袋グルメイベント" },
  { href: "/categories/art/", label: "展示・アート" },
  { href: "/categories/family/", label: "親子で楽しむ" },
  { href: "/areas/sunshine/", label: "サンシャインシティ" },
  { href: "/areas/east/", label: "池袋東口" },
  { href: "/areas/west/", label: "池袋西口" },
  { href: "/areas/", label: "エリアから探す" },
  { href: "/articles/", label: "新着記事" },
  { href: "/about/", label: "このサイトについて" },
] as const
