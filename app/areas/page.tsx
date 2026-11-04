import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { AREAS, getAreaIds, getArticlesByArea } from "@/lib/articles"

export const metadata = {
  title: "エリアから探す",
  description:
    "池袋東口・西口・サンシャインシティ・池袋駅・南長崎・目白など、エリア別に池袋のイベントを探せます。",
  alternates: { canonical: "/areas/" },
}

const Page = () => (
  <>
    <Breadcrumb items={[{ name: "エリア", href: "/areas/" }]} />
    <PageHeader
      kicker="Areas"
      title="エリアから探す"
      lead="池袋駅を中心に、エリアごとのイベント・最新情報をまとめています。"
    />
    <ul className="area-cards">
      {getAreaIds().map((id) => (
        <li key={id}>
          <Link href={`/areas/${id}/`}>
            <h2>
              {AREAS[id].name}
              <span className="area-list__count">
                （{getArticlesByArea(id).length}件）
              </span>
            </h2>
            <p>{AREAS[id].description}</p>
          </Link>
        </li>
      ))}
    </ul>
  </>
)

export default Page
