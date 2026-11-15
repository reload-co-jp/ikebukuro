import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"
import { getSpotCurrentEvents, getSpots } from "@/lib/spots"

export const metadata = pageMetadata({
  title: "スポットから探す 池袋の施設別イベント情報",
  description:
    "サンシャインシティ、東武百貨店、池袋PARCO、東京芸術劇場、池袋西口公園など、池袋の主要スポットごとに開催中・開催予定のイベントをまとめています。",
  path: "/spots/",
})

const Page = () => {
  const today = todayJst()
  return (
    <>
      <Breadcrumb items={[{ name: "スポット", href: "/spots/" }]} />
      <PageHeader
        kicker="Spots"
        title="スポットから探す"
        lead="池袋の主要な施設・会場ごとに、開催中・開催予定のイベントをまとめています。"
      />
      <ul className="area-cards">
        {getSpots().map((s) => (
          <li key={s.id}>
            <Link href={`/spots/${s.id}/`}>
              <h2>
                {s.name}
                <span className="area-list__count">
                  （開催中・予定 {getSpotCurrentEvents(s, today).length}件）
                </span>
              </h2>
              <p>{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Page
