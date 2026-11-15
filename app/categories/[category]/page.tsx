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
import { getEventStatus, isEventArticle } from "@/lib/articles"
import { formatMonth, monthOf, todayJst } from "@/lib/date"
import { pageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getCategoryIds().map((category) => ({ category }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { category } = await params
  if (!isCategoryId(category)) return {}
  const today = todayJst()
  const { seoTitle, lead } = CATEGORIES[category]
  const current = countCurrent(category, today)
  return pageMetadata({
    title: `${seoTitle}【${formatMonth(monthOf(today))}最新】開催中・開催予定`,
    description: `${lead}開催中・開催予定は${current}件。`,
    path: `/categories/${category}/`,
  })
}

const countCurrent = (
  category: Parameters<typeof getArticlesByCategory>[0],
  today: string
) =>
  getArticlesByCategory(category)
    .filter(isEventArticle)
    .filter((a) => getEventStatus(a.event, today) !== "ended").length

const Page = async ({ params }: Props) => {
  const { category } = await params
  if (!isCategoryId(category)) notFound()
  const { name, seoTitle, lead } = CATEGORIES[category]
  const today = todayJst()
  return (
    <>
      <Breadcrumb items={[{ name, href: `/categories/${category}/` }]} />
      <PageHeader
        kicker="Category"
        title={`${seoTitle}【${formatMonth(monthOf(today))}最新】`}
        lead={`${lead}開催中・開催予定は${countCurrent(category, today)}件です。`}
      />
      <ArticleGrid
        articles={getArticlesByCategory(category)}
        today={today}
        headingLevel={2}
      />
    </>
  )
}

export default Page
