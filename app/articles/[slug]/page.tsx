import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleGrid, StatusBadge } from "@/components/article-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Markdown } from "@/components/markdown"
import { Section } from "@/components/page-header"
import { Thumb } from "@/components/thumb"
import {
  AREAS,
  CATEGORIES,
  getAllArticles,
  getArticleBySlug,
  getPublishedIso,
  getRelatedArticles,
  type Article,
} from "@/lib/articles"
import { formatDotDate, formatLongDate, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { absoluteUrl, siteName } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getAllArticles().map((a) => ({ slug: a.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const article = getArticleBySlug((await params).slug)
  if (!article) return {}
  const url = `/articles/${article.slug}/`
  return {
    title: `【池袋】${article.title}`,
    description: article.summary,
    keywords: [
      "池袋",
      "池袋 イベント",
      AREAS[article.area].name,
      ...article.tags,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.summary,
      publishedTime: getPublishedIso(article),
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.summary,
    },
  }
}

const buildJsonLd = (article: Article) => {
  const url = absoluteUrl(`/articles/${article.slug}/`)
  const news = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: getPublishedIso(article),
    dateModified: getPublishedIso(article),
    mainEntityOfPage: url,
    url,
    inLanguage: "ja",
    keywords: article.tags.join(","),
    author: {
      "@type": "Organization",
      name: `${siteName}編集部`,
      url: absoluteUrl("/about/"),
    },
    publisher: { "@id": absoluteUrl("/#organization") },
  }
  if (!article.event) return [news]
  const e = article.event
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description: article.summary,
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.venue,
      address: {
        "@type": "PostalAddress",
        ...(e.address ? { streetAddress: e.address } : {}),
        addressLocality: "豊島区",
        addressRegion: "東京都",
        addressCountry: "JP",
      },
    },
    ...(e.free ? { isAccessibleForFree: true } : {}),
    url: article.sources[article.sources.length - 1]?.url ?? url,
  }
  return [news, event]
}

const Page = async ({ params }: Props) => {
  const article = getArticleBySlug((await params).slug)
  if (!article) notFound()
  const today = todayJst()
  const e = article.event

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildJsonLd(article)) }}
      />
      <Breadcrumb
        items={[
          { name: AREAS[article.area].name, href: `/areas/${article.area}/` },
          {
            name: e?.name ?? article.title,
            href: `/articles/${article.slug}/`,
          },
        ]}
      />
      <article className="article">
        <div className="article__meta">
          <StatusBadge article={article} today={today} />
          {article.categories.map((id) => (
            <Link key={id} href={`/categories/${id}/`} className="chip">
              {CATEGORIES[id].name}
            </Link>
          ))}
          <time dateTime={getPublishedIso(article)}>
            {formatDotDate(article.publishedAt)} 公開
          </time>
        </div>
        <h1 className="article__title">{article.title}</h1>
        <p className="article__summary">{article.summary}</p>
        <Thumb article={article} large />

        {e && (
          <aside className="event-box" aria-labelledby="event-box-title">
            <h2 id="event-box-title" className="event-box__title">
              開催概要
            </h2>
            <dl>
              <dt>期間</dt>
              <dd>
                {formatLongDate(e.startDate)}
                {e.endDate &&
                  e.endDate !== e.startDate &&
                  `〜${formatLongDate(e.endDate)}`}
                {!e.endDate && "〜"}
              </dd>
              {e.hours && (
                <>
                  <dt>時間</dt>
                  <dd>{e.hours}</dd>
                </>
              )}
              <dt>会場</dt>
              <dd>
                <Link href={`/areas/${article.area}/`}>
                  {AREAS[article.area].name}
                </Link>
                ｜{e.venue}
              </dd>
              {e.address && (
                <>
                  <dt>住所</dt>
                  <dd>{e.address}</dd>
                </>
              )}
              <dt>料金</dt>
              <dd>{e.price}</dd>
              <dt>予約</dt>
              <dd>{e.reservation ? "チケット・予約が必要" : "予約不要"}</dd>
            </dl>
          </aside>
        )}

        <Markdown source={article.content} />

        <section className="sources" aria-labelledby="sources-title">
          <h2 id="sources-title">出典・公式情報</h2>
          <ul>
            {article.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="notice">
            ※掲載内容は記事公開時点の情報です。日程・内容・料金は変更になる場合があります。お出かけ前に必ず公式情報をご確認ください。
          </p>
        </section>

        {article.tags.length > 0 && (
          <ul
            className="chips"
            aria-label="キーワード"
            style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}
          >
            {article.tags.map((t) => (
              <li key={t} className="chip">
                #{t}
              </li>
            ))}
          </ul>
        )}
      </article>

      <Section id="related" kicker="Related" title="あわせて読みたい">
        <ArticleGrid articles={getRelatedArticles(article)} today={today} />
      </Section>
    </>
  )
}

export default Page
