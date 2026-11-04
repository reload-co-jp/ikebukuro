import Link from "next/link"
import { AREAS, CATEGORIES, getEventStatus, type Article } from "@/lib/articles"
import { formatDotDate, formatPeriod } from "@/lib/date"
import { Thumb } from "./thumb"

const STATUS_LABEL = {
  upcoming: "開催予定",
  ongoing: "開催中",
  ended: "終了",
} as const

export const StatusBadge = ({
  article,
  today,
}: {
  article: Article
  today: string
}) => {
  if (!article.event) return null
  const status = getEventStatus(article.event, today)
  return (
    <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>
  )
}

export const ArticleCard = ({
  article,
  today,
  headingLevel = 3,
}: {
  article: Article
  today: string
  headingLevel?: 2 | 3
}) => {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  return (
    <li className="card">
      <Link href={`/articles/${article.slug}/`} className="card__link">
        <Thumb article={article} />
        <div className="card__body">
          <div className="card__meta">
            <StatusBadge article={article} today={today} />
            <span className="chip">
              {CATEGORIES[article.categories[0]].name}
            </span>
            <span className="chip chip--area">{AREAS[article.area].name}</span>
          </div>
          <Heading className="card__title">{article.title}</Heading>
          {article.event ? (
            <p className="card__event">
              <span>
                {formatPeriod(article.event.startDate, article.event.endDate)}
              </span>
              <span>{article.event.venue}</span>
            </p>
          ) : (
            <p className="card__event">
              <time dateTime={article.publishedAt}>
                {formatDotDate(article.publishedAt)}
              </time>
            </p>
          )}
        </div>
      </Link>
    </li>
  )
}

export const ArticleGrid = ({
  articles,
  today,
  empty = "該当する記事はまだありません。",
  headingLevel,
}: {
  articles: Article[]
  today: string
  empty?: string
  headingLevel?: 2 | 3
}) =>
  articles.length === 0 ? (
    <p className="empty">{empty}</p>
  ) : (
    <ul className="grid">
      {articles.map((a) => (
        <ArticleCard
          key={a.id}
          article={a}
          today={today}
          headingLevel={headingLevel}
        />
      ))}
    </ul>
  )
