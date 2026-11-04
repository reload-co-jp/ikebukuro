import Link from "next/link"
import type { EventArticle } from "@/lib/articles"
import { ArticleGrid } from "./article-card"
import { Breadcrumb } from "./breadcrumb"
import { EVENT_NAV } from "./nav"
import { PageHeader } from "./page-header"

/** Shared body for the date-based event list pages under /events/. */
export const EventListing = ({
  href,
  kicker,
  title,
  lead,
  events,
  today,
  empty,
}: {
  href: string
  kicker: string
  title: string
  lead: string
  events: EventArticle[]
  today: string
  empty: string
}) => (
  <>
    <Breadcrumb
      items={[
        { name: "イベント", href: "/events/" },
        ...(href === "/events/" ? [] : [{ name: title, href }]),
      ]}
    />
    <PageHeader kicker={kicker} title={title} lead={lead} />
    <nav
      aria-label="期間で絞り込む"
      className="chips"
      style={{ marginBottom: "1.5rem" }}
    >
      {EVENT_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="chip"
          aria-current={item.href === href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
    <ArticleGrid
      articles={events}
      today={today}
      empty={empty}
      headingLevel={2}
    />
  </>
)
