"use client"

import { useSearchParams } from "next/navigation"
import { ArticleGrid } from "./article-card"
import type { Article } from "@/lib/articles"

const normalize = (s: string) => s.normalize("NFKC").toLowerCase()

export const matchesQuery = (article: Article, query: string): boolean => {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = normalize(
    [
      article.title,
      article.summary,
      article.tags.join(" "),
      article.event?.name ?? "",
      article.event?.venue ?? "",
    ].join(" ")
  )
  return words.every((w) => haystack.includes(w))
}

/** Article list filtered by the `q` search parameter from the header form. */
export const ArticleSearch = ({
  articles,
  today,
}: {
  articles: Article[]
  today: string
}) => {
  const query = useSearchParams().get("q")?.trim() ?? ""
  const results = articles.filter((a) => matchesQuery(a, query))
  return (
    <>
      {query && (
        <p className="search-status" role="status">
          「{query}」の検索結果：{results.length}件
          <a href="/articles/" className="search-status__reset">
            検索をクリア
          </a>
        </p>
      )}
      <ArticleGrid
        articles={results}
        today={today}
        headingLevel={2}
        empty="条件に一致する記事は見つかりませんでした。"
      />
    </>
  )
}
