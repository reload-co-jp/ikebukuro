import Link from "next/link"
import type { EventArticle } from "@/lib/articles"
import { formatPeriod } from "@/lib/date"
import { StatusBadge } from "./article-card"
import { Thumb } from "./thumb"

/** Horizontally scrolling pickup slider (CSS scroll-snap, no JavaScript). */
export const PickupCarousel = ({
  events,
  today,
}: {
  events: EventArticle[]
  today: string
}) => (
  <section className="pickup" aria-labelledby="pickup-title">
    <h2 id="pickup-title" className="visually-hidden">
      ピックアップ
    </h2>
    <ul className="pickup__track">
      {events.map((a) => (
        <li key={a.id} className="pickup__slide">
          <Link href={`/articles/${a.slug}/`} className="pickup__link">
            <Thumb article={a} large />
            <span className="pickup__caption">
              <span className="pickup__badges">
                <StatusBadge article={a} today={today} />
                <span className="pickup__period">
                  {formatPeriod(a.event.startDate, a.event.endDate)}
                </span>
              </span>
              <span className="pickup__title">{a.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
)
