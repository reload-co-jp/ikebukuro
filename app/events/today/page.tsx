import { EventListing } from "@/components/event-listing"
import { getOngoingEvents } from "@/lib/articles"
import { formatLongDate, todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "今日の池袋イベント",
  description:
    "今日、池袋で開催中のイベント・展示・コラボカフェ・POPUPをまとめています。",
  path: "/events/today/",
})

const Page = () => {
  const today = todayJst()
  return (
    <EventListing
      href="/events/today/"
      kicker="Today"
      title="今日の池袋イベント"
      lead={`${formatLongDate(today)}に池袋エリアで開催中のイベントです。終了が近い順に並べています。`}
      events={getOngoingEvents(today)}
      today={today}
      empty="本日開催中のイベント情報はありません。"
    />
  )
}

export default Page
