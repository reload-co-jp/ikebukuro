import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { EventTimeline } from "@/components/event-timeline"
import { EVENT_NAV } from "@/components/nav"
import { PageHeader, Section } from "@/components/page-header"
import {
  getEventMonths,
  getOngoingEvents,
  getUpcomingEvents,
} from "@/lib/articles"
import { formatLongDate, formatMonth, monthOf, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { eventItemListJsonLd, pageMetadata } from "@/lib/seo"

// Evaluated at build time; the site is rebuilt daily so the month stays fresh.
export const generateMetadata = () => {
  const today = todayJst()
  const count = getOngoingEvents(today).length + getUpcomingEvents(today).length
  return pageMetadata({
    title: `池袋イベント一覧【${formatMonth(monthOf(today))}最新】開催中・開催予定`,
    description: `池袋で開催中・開催予定のイベント${count}件を日付順にまとめた一覧。サンシャインシティ、池袋西口公園、池袋駅周辺のイベント・コラボカフェ・POPUP・グルメフェス・展示情報を毎日更新しています。`,
    path: "/events/",
  })
}

const Page = () => {
  const today = todayJst()
  const ongoing = getOngoingEvents(today)
  const upcoming = getUpcomingEvents(today)
  const months = getEventMonths(today)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            eventItemListJsonLd({
              name: "池袋イベント一覧（開催中・開催予定）",
              path: "/events/",
              events: [...ongoing, ...upcoming],
            })
          ),
        }}
      />
      <Breadcrumb items={[{ name: "イベント", href: "/events/" }]} />
      <PageHeader
        kicker="Events"
        title="池袋イベント一覧（開催中・開催予定）"
        lead={`${formatLongDate(today)}時点で池袋エリアで開催中のイベント${ongoing.length}件、開催予定のイベント${upcoming.length}件を掲載しています。`}
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
          events={ongoing}
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
          events={upcoming}
          today={today}
          empty="開催予定のイベント情報はまだありません。"
        />
      </Section>
      {months.length > 0 && (
        <Section id="monthly" kicker="Monthly" title="月別の池袋イベント">
          <nav aria-label="月別のイベント一覧" className="chips">
            {months.map((m) => (
              <Link key={m} href={`/events/month/${m}/`} className="chip">
                {formatMonth(m)}
              </Link>
            ))}
          </nav>
        </Section>
      )}
    </>
  )
}

export default Page
