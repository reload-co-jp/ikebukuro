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
    <span className={`status status--${status}`}>{STATUS_LABEL[status]}</span>
  )
}

/** Colourful pill tags: categories, then the area. */
export const ArticleTags = ({ article }: { article: Article }) => (
  <>
    {article.categories.map((id) => (
      <span
        key={id}
        className="pill"
        style={{ background: CATEGORIES[id].color }}
      >
        {CATEGORIES[id].name}
      </span>
    ))}
    <span className="pill pill--area">{AREAS[article.area].name}</span>
  </>
)

export const ArticleCard = ({
  article,
  today,
  headingLevel = 3,
  showSummary = true,
}: {
  article: Article
  today: string
  headingLevel?: 2 | 3
  showSummary?: boolean
}) => {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  return (
    <li>
      <Link href={`/articles/${article.slug}/`} className="card-link">
        <article className="card">
          <Thumb article={article} />
          <div className="card__tags">
            <StatusBadge article={article} today={today} />
            <ArticleTags article={article} />
          </div>
          <Heading className="card__title">{article.title}</Heading>
          {article.event ? (
            <dl className="card__meta">
              <dt>会場</dt>
              <dd>{article.event.venue}</dd>
              <dt>期間</dt>
              <dd>
                {formatPeriod(article.event.startDate, article.event.endDate)}
              </dd>
            </dl>
          ) : (
            showSummary && <p className="card__summary">{article.summary}</p>
          )}
          <time className="card__date" dateTime={article.publishedAt}>
            {formatDotDate(article.publishedAt)}
          </time>
        </article>
      </Link>
    </li>
  )
}

export const ArticleGrid = ({
  articles,
  today,
  empty = "該当する記事はまだありません。",
  headingLevel,
  columns = 3,
}: {
  articles: Article[]
  today: string
  empty?: string
  headingLevel?: 2 | 3
  columns?: 2 | 3
}) =>
  articles.length === 0 ? (
    <p className="empty">{empty}</p>
  ) : (
    <ul className={`card-grid card-grid--${columns}`}>
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
