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
      ...(article.image && {
        images: [
          {
            url: article.image.src,
            width: article.image.width,
            height: article.image.height,
            alt: article.image.alt,
          },
        ],
      }),
    },
    twitter: {
      card: article.image ? "summary_large_image" : "summary",
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
    ...(article.image && { image: absoluteUrl(article.image.src) }),
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
        <div className="article__tags">
          <StatusBadge article={article} today={today} />
          {article.categories.map((id) => (
            <Link
              key={id}
              href={`/categories/${id}/`}
              className="pill"
              style={{ background: CATEGORIES[id].color }}
            >
              {CATEGORIES[id].name}
            </Link>
          ))}
          <Link href={`/areas/${article.area}/`} className="pill pill--area">
            {AREAS[article.area].name}
          </Link>
        </div>
        <h1 className="article__title">{article.title}</h1>
        <time className="article__date" dateTime={getPublishedIso(article)}>
          {formatDotDate(article.publishedAt)} 公開
        </time>
        <Thumb article={article} large />
        {article.image && (
          <p className="thumb-credit">
            画像出典：
            <a
              href={article.image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.image.sourceLabel}
            </a>
          </p>
        )}
        <p className="article__summary">{article.summary}</p>

        {e && (
          <aside className="event-box" aria-labelledby="event-box-title">
            <h2 id="event-box-title" className="event-box__title">
              イベント情報
            </h2>
            <dl>
              <dt>会場</dt>
              <dd>
                <Link href={`/areas/${article.area}/`}>{e.venue}</Link>
              </dd>
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
              {e.address && (
                <>
                  <dt>住所</dt>
                  <dd>{e.address}</dd>
                </>
              )}
              <dt>料金</dt>
              <dd>{e.price}</dd>
              <dt>予約</dt>
              <dd>{e.reservation ? "チケット・予約が必要" : "不要"}</dd>
            </dl>
            <p className="event-box__links">
              <Link href="/events/today/">
                → 今日開催の池袋イベント一覧を見る
              </Link>
              <Link href={`/areas/${article.area}/`}>
                → {AREAS[article.area].name}のイベント特集を見る
              </Link>
            </p>
          </aside>
        )}

        <Markdown source={article.content} />

        <nav className="next-action" aria-labelledby="next-action-title">
          <p className="kicker">Next Action</p>
          <h2 id="next-action-title" className="next-action__title">
            次に行く場所を探す
          </h2>
          <ul>
            <li>
              <Link href="/events/today/">今日行ける池袋イベント</Link>
            </li>
            <li>
              <Link href="/events/this-weekend/">今週末の池袋イベント</Link>
            </li>
            <li>
              <Link href={`/categories/${article.categories[0]}/`}>
                {CATEGORIES[article.categories[0]].name}の記事をもっと見る
              </Link>
            </li>
          </ul>
        </nav>

        <section className="sources" aria-labelledby="sources-title">
          <h2 id="sources-title">公式URL・参考URL</h2>
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

        <p className="article__author">執筆: {siteName}編集部</p>

        {article.tags.length > 0 && (
          <section
            className="article__keywords"
            aria-labelledby="keywords-title"
          >
            <p id="keywords-title" className="kicker">
              Tag
            </p>
            <div className="keyword-list">
              {article.tags.map((t) => (
                <Link
                  key={t}
                  href={`/articles/?q=${encodeURIComponent(t)}`}
                  className="keyword-list__item"
                >
                  {t}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Section id="related" kicker="Related" title="類似記事">
        <ArticleGrid articles={getRelatedArticles(article, 6)} today={today} />
      </Section>
    </>
  )
}

export default Page
