import { EventListing } from "@/components/event-listing"
import { getFreeEvents } from "@/lib/articles"
import { todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "池袋の無料イベント",
  description:
    "入場無料で楽しめる池袋のイベント・展示・POPUPをまとめています。",
  path: "/events/free/",
})

const Page = () => {
  const today = todayJst()
  return (
    <EventListing
      href="/events/free/"
      kicker="Free"
      title="池袋の無料イベント"
      lead="入場無料で楽しめるイベントです（飲食・物販は有料の場合があります）。"
      events={getFreeEvents(today)}
      today={today}
      empty="開催中・開催予定の無料イベント情報はまだありません。"
    />
  )
}

export default Page
