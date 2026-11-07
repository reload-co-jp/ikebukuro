import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleGrid } from "@/components/article-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { AREAS, getAreaIds, getArticlesByArea, isAreaId } from "@/lib/articles"
import { todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ area: string }> }

export const dynamicParams = false

export const generateStaticParams = () => getAreaIds().map((area) => ({ area }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { area } = await params
  if (!isAreaId(area)) return {}
  return pageMetadata({
    title: `${AREAS[area].name}のイベント・最新情報`,
    description: AREAS[area].description,
    path: `/areas/${area}/`,
  })
}

const Page = async ({ params }: Props) => {
  const { area } = await params
  if (!isAreaId(area)) notFound()
  return (
    <>
      <Breadcrumb
        items={[
          { name: "エリア", href: "/areas/" },
          { name: AREAS[area].name, href: `/areas/${area}/` },
        ]}
      />
      <PageHeader
        kicker="Area"
        title={`${AREAS[area].name}のイベント・最新情報`}
        lead={AREAS[area].description}
      />
      <ArticleGrid
        articles={getArticlesByArea(area)}
        today={todayJst()}
        headingLevel={2}
      />
    </>
  )
}

export default Page
