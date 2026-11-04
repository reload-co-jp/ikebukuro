import { EventListing } from "@/components/event-listing"
import { getWeekendEvents } from "@/lib/articles"
import { formatShortDate, todayJst, weekendRange } from "@/lib/date"

export const metadata = {
  title: "今週末の池袋イベント",
  description:
    "今週の土日に池袋で開催されるイベント・グルメフェス・展示をまとめています。",
  alternates: { canonical: "/events/this-weekend/" },
}

const Page = () => {
  const today = todayJst()
  const { start, end } = weekendRange(today)
  return (
    <EventListing
      href="/events/this-weekend/"
      kicker="This Weekend"
      title="今週末の池袋イベント"
      lead={`${formatShortDate(start)}・${formatShortDate(end)}に池袋エリアで開催されるイベントです。`}
      events={getWeekendEvents(today)}
      today={today}
      empty="今週末に開催されるイベント情報はまだありません。"
    />
  )
}

export default Page
