import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { EventTimeline } from "@/components/event-timeline"
import { EVENT_NAV } from "@/components/nav"
import { PageHeader, Section } from "@/components/page-header"
import { getOngoingEvents, getUpcomingEvents } from "@/lib/articles"
import { formatLongDate, todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "池袋のイベント一覧（開催中・開催予定）",
  description:
    "池袋・サンシャインシティ・池袋西口公園などで開催中、開催予定のイベントを日付順にまとめています。",
  path: "/events/",
})

const Page = () => {
  const today = todayJst()
  return (
    <>
      <Breadcrumb items={[{ name: "イベント", href: "/events/" }]} />
      <PageHeader
        kicker="Events"
        title="池袋のイベント一覧"
        lead={`${formatLongDate(today)}時点で開催中・開催予定のイベントです。`}
      />
      <nav aria-label="期間で絞り込む" className="chips">
        {EVENT_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="chip">
            {item.label}
          </Link>
        ))}
      </nav>
      <Section
        id="ongoing"
        kicker="Now"
        title="開催中のイベント（終了が近い順）"
      >
        <EventTimeline
          events={getOngoingEvents(today)}
          today={today}
          empty="開催中のイベント情報はありません。"
        />
      </Section>
      <Section
        id="upcoming"
        kicker="Upcoming"
        title="開催予定のイベント（開始が近い順）"
      >
        <EventTimeline
          events={getUpcomingEvents(today)}
          today={today}
          empty="開催予定のイベント情報はまだありません。"
        />
      </Section>
    </>
  )
}

export default Page
