/** Dates are handled as "YYYY-MM-DD" strings in Japan Standard Time. */

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

/** Today's date in JST as YYYY-MM-DD. */
export const todayJst = (now: Date = new Date()): string =>
  now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" })

const parse = (date: string) => new Date(`${date}T00:00:00Z`)

const format = (d: Date) => d.toISOString().slice(0, 10)

export const addDays = (date: string, days: number): string => {
  const d = parse(date)
  d.setUTCDate(d.getUTCDate() + days)
  return format(d)
}

export const weekdayOf = (date: string): string =>
  WEEKDAYS[parse(date).getUTCDay()]

/** "2026-11-07" -> "11/7（土）" */
export const formatShortDate = (date: string): string => {
  const d = parse(date)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${weekdayOf(date)}）`
}

/** "2026-11-07" -> "2026年11月7日（土）" */
export const formatLongDate = (date: string): string => {
  const d = parse(date)
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${weekdayOf(date)}）`
}

/** "2026-11-04" -> "2026.11.04" */
export const formatDotDate = (date: string): string => date.replace(/-/g, ".")

/** Human readable period. Omits the end when it is the same day or unknown. */
export const formatPeriod = (start: string, end?: string): string => {
  if (!end) return `${formatShortDate(start)}〜`
  if (start === end) return formatShortDate(start)
  const crossesYear = start.slice(0, 4) !== end.slice(0, 4)
  const endLabel = crossesYear
    ? `${end.slice(0, 4)}/${formatShortDate(end)}`
    : formatShortDate(end)
  return `${formatShortDate(start)}〜${endLabel}`
}

/** Saturday and Sunday of the weekend that contains or follows `today`. */
export const weekendRange = (today: string): { start: string; end: string } => {
  const day = parse(today).getUTCDay() // 0=Sun, 6=Sat
  const satOffset = day === 0 ? -1 : 6 - day
  const start = addDays(today, satOffset)
  return { start, end: addDays(start, 1) }
}

/** Number of days between two dates (b - a). */
export const daysBetween = (a: string, b: string): number =>
  Math.round((parse(b).getTime() - parse(a).getTime()) / 86_400_000)
