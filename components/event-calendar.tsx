import Link from "next/link"
import { overlaps, type EventArticle } from "@/lib/articles"
import { addDays, weekdayOf } from "@/lib/date"

const WEEK = ["日", "月", "火", "水", "木", "金", "土"]
const MAX_PER_DAY = 3

const monthDays = (month: string): string[] => {
  const days: string[] = []
  for (let d = `${month}-01`; d.startsWith(month); d = addDays(d, 1))
    days.push(d)
  return days
}

/** Month grid showing which events run on each day. */
export const EventCalendar = ({
  events,
  today,
}: {
  events: EventArticle[]
  today: string
}) => {
  const month = today.slice(0, 7)
  const days = monthDays(month)
  const leading = WEEK.indexOf(weekdayOf(days[0]))
  const [y, m] = month.split("-")

  return (
    <section className="calendar" aria-labelledby="calendar-title">
      <p className="kicker">Event Calendar</p>
      <h2 id="calendar-title" className="section__title">
        {y}年{Number(m)}月のイベントカレンダー
      </h2>
      <div
        className="calendar__grid"
        role="table"
        aria-label={`${y}年${Number(m)}月`}
      >
        <div role="row" className="calendar__row calendar__row--head">
          {WEEK.map((w) => (
            <span role="columnheader" key={w} className="calendar__weekday">
              {w}
            </span>
          ))}
        </div>
        <div role="row" className="calendar__row">
          {Array.from({ length: leading }, (_, i) => (
            <span
              role="cell"
              key={`blank-${i}`}
              className="calendar__cell calendar__cell--blank"
            />
          ))}
          {days.map((day) => {
            const todays = events.filter((a) => overlaps(a.event, day, day))
            const weekday = weekdayOf(day)
            return (
              <div
                role="cell"
                key={day}
                className={[
                  "calendar__cell",
                  day === today ? "calendar__cell--today" : "",
                  weekday === "日" ? "calendar__cell--sun" : "",
                  weekday === "土" ? "calendar__cell--sat" : "",
                ].join(" ")}
              >
                <span className="calendar__day">{Number(day.slice(8))}</span>
                <ul>
                  {todays.slice(0, MAX_PER_DAY).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/articles/${a.slug}/`}
                        className={
                          a.event.startDate === day
                            ? "calendar__event calendar__event--start"
                            : "calendar__event"
                        }
                        title={a.event.name}
                      >
                        {a.event.name}
                      </Link>
                    </li>
                  ))}
                  {todays.length > MAX_PER_DAY && (
                    <li className="calendar__more">
                      +{todays.length - MAX_PER_DAY}件
                    </li>
                  )}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
