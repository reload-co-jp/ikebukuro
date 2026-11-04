import Link from "next/link"
import { ArticleGrid } from "@/components/article-card"
import { EventTimeline } from "@/components/event-timeline"
import { Section } from "@/components/page-header"
import {
  AREAS,
  CATEGORIES,
  getAllArticles,
  getAreaIds,
  getArticlesByArea,
  getCategoryIds,
  getEndingSoonEvents,
  getEventsWithin,
  getOngoingEvents,
  getUpcomingEvents,
  getWeekendEvents,
} from "@/lib/articles"
import { formatLongDate, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  alternates: { canonical: "/" },
}

const Page = () => {
  const today = todayJst()
  const articles = getAllArticles()
  const ongoing = getOngoingEvents(today)
  const weekend = getWeekendEvents(today)
  const week = getEventsWithin(today, 7)
  const upcoming = getUpcomingEvents(today)
  const endingSoon = getEndingSoonEvents(today)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "池袋の最新イベント・ニュース",
    url: absoluteUrl("/"),
    itemListElement: articles.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: absoluteUrl(`/articles/${a.slug}/`),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero__date">{formatLongDate(today)}更新</p>
        <h1 id="hero-title" className="hero__title">
          池袋で今日なにやってる？
          <br />
          イベント・コラボ・最新情報
        </h1>
        <ul className="hero__stats">
          <li>
            <Link href="/events/today/">
              <span className="hero__stat-value">{ongoing.length}</span>
              <span className="hero__stat-label">今日開催中</span>
            </Link>
          </li>
          <li>
            <Link href="/events/this-weekend/">
              <span className="hero__stat-value">{weekend.length}</span>
              <span className="hero__stat-label">今週末のイベント</span>
            </Link>
          </li>
          <li>
            <Link href="/events/this-week/">
              <span className="hero__stat-value">{week.length}</span>
              <span className="hero__stat-label">7日以内に開催</span>
            </Link>
          </li>
        </ul>
      </section>

      <div className="home-columns">
        <div>
          <Section
            id="weekend"
            kicker="This Weekend"
            title="今週末の池袋イベント"
            action={
              <Link href="/events/this-weekend/" className="more">
                もっと見る
              </Link>
            }
          >
            <ArticleGrid
              articles={weekend.slice(0, 6)}
              today={today}
              empty="今週末に開催されるイベント情報はまだありません。"
            />
          </Section>

          <Section
            id="upcoming"
            kicker="Coming Soon"
            title="これから始まるイベント"
            action={
              <Link href="/events/" className="more">
                すべてのイベント
              </Link>
            }
          >
            <EventTimeline
              events={upcoming.slice(0, 8)}
              today={today}
              empty="開催予定のイベント情報はまだありません。"
            />
          </Section>

          <Section
            id="latest"
            kicker="Latest News"
            title="新着記事"
            action={
              <Link href="/articles/" className="more">
                記事一覧
              </Link>
            }
          >
            <ArticleGrid articles={articles.slice(0, 9)} today={today} />
          </Section>
        </div>

        <aside aria-label="サイドコンテンツ" className="section">
          <section className="panel" aria-labelledby="ending-soon">
            <h2 id="ending-soon" className="panel__title">
              まもなく終了
            </h2>
            <EventTimeline
              events={endingSoon.slice(0, 5)}
              today={today}
              empty="1週間以内に終了するイベントはありません。"
            />
          </section>
          <section className="panel" aria-labelledby="areas">
            <h2 id="areas" className="panel__title">
              エリアから探す
            </h2>
            <ul className="area-list">
              {getAreaIds().map((id) => (
                <li key={id}>
                  <Link href={`/areas/${id}/`}>
                    <span>{AREAS[id].name}</span>
                    <span className="area-list__count">
                      {getArticlesByArea(id).length}件
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel" aria-labelledby="categories">
            <h2 id="categories" className="panel__title">
              ジャンルから探す
            </h2>
            <div className="chips">
              {getCategoryIds().map((id) => (
                <Link key={id} href={`/categories/${id}/`} className="chip">
                  {CATEGORIES[id].name}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}

export default Page
