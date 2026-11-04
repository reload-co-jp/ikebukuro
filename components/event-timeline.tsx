import Link from "next/link"
import { AREAS, type EventArticle } from "@/lib/articles"
import { daysBetween, formatPeriod } from "@/lib/date"
import { StatusBadge } from "./article-card"

/** Compact list of events: period, name, venue and days remaining. */
export const EventTimeline = ({
  events,
  today,
  empty = "該当するイベントはありません。",
}: {
  events: EventArticle[]
  today: string
  empty?: string
}) =>
  events.length === 0 ? (
    <p className="empty">{empty}</p>
  ) : (
    <ul className="timeline">
      {events.map((a) => {
        const daysLeft = a.event.endDate
          ? daysBetween(today, a.event.endDate)
          : undefined
        return (
          <li key={a.id}>
            <Link href={`/articles/${a.slug}/`} className="timeline__link">
              <span className="timeline__period">
                {formatPeriod(a.event.startDate, a.event.endDate)}
              </span>
              <span className="timeline__main">
                <span className="timeline__badges">
                  <StatusBadge article={a} today={today} />
                  {a.event.free && (
                    <span className="chip chip--free">無料</span>
                  )}
                  {daysLeft !== undefined && daysLeft >= 0 && daysLeft <= 7 && (
                    <span className="chip chip--alert">
                      {daysLeft === 0 ? "本日最終日" : `終了まで${daysLeft}日`}
                    </span>
                  )}
                </span>
                <span className="timeline__name">{a.event.name}</span>
                <span className="timeline__venue">
                  {AREAS[a.area].name}｜{a.event.venue}
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
