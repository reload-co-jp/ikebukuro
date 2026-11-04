import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleGrid } from "@/components/article-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import {
  CATEGORIES,
  getArticlesByCategory,
  getCategoryIds,
  isCategoryId,
} from "@/lib/articles"
import { todayJst } from "@/lib/date"

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getCategoryIds().map((category) => ({ category }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { category } = await params
  if (!isCategoryId(category)) return {}
  const name = CATEGORIES[category].name
  return {
    title: `池袋の${name}イベント・ニュース`,
    description: `池袋で開催される${name}関連のイベント・最新情報をまとめています。`,
    alternates: { canonical: `/categories/${category}/` },
  }
}

const Page = async ({ params }: Props) => {
  const { category } = await params
  if (!isCategoryId(category)) notFound()
  const name = CATEGORIES[category].name
  return (
    <>
      <Breadcrumb items={[{ name, href: `/categories/${category}/` }]} />
      <PageHeader
        kicker="Category"
        title={`池袋の${name}イベント・ニュース`}
        lead={`池袋エリアで開催される${name}関連のイベントや最新情報です。`}
      />
      <ArticleGrid
        articles={getArticlesByCategory(category)}
        today={todayJst()}
        headingLevel={2}
      />
    </>
  )
}

export default Page
