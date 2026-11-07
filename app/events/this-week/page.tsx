import { EventListing } from "@/components/event-listing"
import { getEventsWithin } from "@/lib/articles"
import { addDays, formatShortDate, todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "1週間以内の池袋イベント",
  description: "今日から7日以内に池袋で開催されるイベントをまとめています。",
  path: "/events/this-week/",
})

const Page = () => {
  const today = todayJst()
  return (
    <EventListing
      href="/events/this-week/"
      kicker="This Week"
      title="1週間以内の池袋イベント"
      lead={`${formatShortDate(today)}〜${formatShortDate(addDays(today, 6))}に池袋エリアで開催されるイベントです。`}
      events={getEventsWithin(today, 7)}
      today={today}
      empty="1週間以内に開催されるイベント情報はまだありません。"
    />
  )
}

export default Page
