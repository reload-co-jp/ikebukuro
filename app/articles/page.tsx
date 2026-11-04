import { Suspense } from "react"
import { ArticleGrid } from "@/components/article-card"
import { ArticleSearch } from "@/components/article-search"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { getAllArticles } from "@/lib/articles"
import { todayJst } from "@/lib/date"

export const metadata = {
  title: "新着記事一覧",
  description:
    "池袋のイベント・コラボカフェ・グルメフェス・展示などの最新記事一覧。",
  alternates: { canonical: "/articles/" },
}

const Page = () => {
  const articles = getAllArticles()
  const today = todayJst()
  return (
    <>
      <Breadcrumb items={[{ name: "新着記事", href: "/articles/" }]} />
      <PageHeader
        kicker="Latest News"
        title="新着記事一覧"
        lead="池袋エリアのイベントや最新情報を、公開日の新しい順に掲載しています。"
      />
      <Suspense
        fallback={
          <ArticleGrid articles={articles} today={today} headingLevel={2} />
        }
      >
        <ArticleSearch articles={articles} today={today} />
      </Suspense>
    </>
  )
}

export default Page
