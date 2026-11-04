import Link from "next/link"
import { ArticleGrid } from "@/components/article-card"
import { EventCalendar } from "@/components/event-calendar"
import { EventTimeline } from "@/components/event-timeline"
import { LinkPanel, Section } from "@/components/page-header"
import { PickupCarousel } from "@/components/pickup-carousel"
import {
  AREAS,
  getAllArticles,
  getAreaIds,
  getArticlesByArea,
  getEndingSoonEvents,
  getEventArticles,
  getEventsWithin,
  getOngoingEvents,
  getUpcomingEvents,
  getWeekendEvents,
} from "@/lib/articles"
import { formatPeriod, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site"

export const metadata = {
  alternates: { canonical: "/" },
}

const KEYWORD_LIMIT = 14

const Page = () => {
  const today = todayJst()
  const articles = getAllArticles()
  const ongoing = getOngoingEvents(today)
  const upcoming = getUpcomingEvents(today)
  const weekend = getWeekendEvents(today)
  const endingSoon = getEndingSoonEvents(today)

  // Pickup: events starting within a week first, then what is on now.
  const pickup = [
    ...getEventsWithin(today, 7).filter((a) => a.event.startDate > today),
    ...ongoing,
  ]
    .filter((a, i, list) => list.findIndex((b) => b.id === a.id) === i)
    .slice(0, 8)

  const thisWeek = getEventsWithin(today, 7)
    .slice()
    .sort(
      (a, b) =>
        Number(b.event.startDate > today) - Number(a.event.startDate > today)
    )
    .slice(0, 4)

  const keywordCounts = new Map<string, number>()
  for (const a of articles)
    for (const t of a.tags)
      keywordCounts.set(t, (keywordCounts.get(t) ?? 0) + 1)
  const keywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, KEYWORD_LIMIT)
    .map(([t]) => t)

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
      <h1 className="visually-hidden">
        イケブクロLive｜池袋の最新イベント・コラボ・ニュース
      </h1>

      <PickupCarousel events={pickup} today={today} />

      <div className="home-layout">
        <div className="home-layout__main">
          <Section
            id="this-week"
            kicker="This Week"
            title="今週のイベント"
            action={
              <Link href="/events/this-week/" className="more">
                もっと見る
              </Link>
            }
          >
            <ArticleGrid
              articles={thisWeek}
              today={today}
              columns={2}
              empty="今週開催予定のイベントはまだありません。"
            />
          </Section>
        </div>

        <aside className="home-layout__aside" aria-label="サイドコンテンツ">
          <section className="widget" aria-labelledby="widget-today">
            <div className="widget__header">
              <h2 id="widget-today" className="widget__title">
                本日の注目イベント
              </h2>
              <Link href="/events/today/" className="widget__more">
                もっと見る
              </Link>
            </div>
            {ongoing.length === 0 ? (
              <p className="widget__empty">
                本日開催中のイベントはありません。
              </p>
            ) : (
              <ul className="widget-events">
                {ongoing.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/articles/${a.slug}/`}
                      className="widget-events__link"
                    >
                      <span className="widget-events__range">
                        {formatPeriod(a.event.startDate, a.event.endDate)}
                      </span>
                      <span className="widget-events__title">{a.title}</span>
                      <span className="widget-events__venue">
                        {a.event.venue}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="widget" aria-labelledby="widget-keywords">
            <h2 id="widget-keywords" className="widget__title">
              人気のキーワード
            </h2>
            <div className="keyword-list">
              {keywords.map((k) => (
                <Link
                  key={k}
                  href={`/articles/?q=${encodeURIComponent(k)}`}
                  className="keyword-list__item"
                >
                  {k}
                </Link>
              ))}
            </div>
          </section>

          <section className="widget" aria-labelledby="widget-areas">
            <h2 id="widget-areas" className="widget__title">
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
        </aside>
      </div>

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

      <LinkPanel
        title="詳細を見る"
        links={[
          { href: "/events/today/", label: "今日開催中の池袋イベント" },
          { href: "/events/free/", label: "入場無料で楽しめるイベント" },
          { href: "/categories/collab/", label: "コラボカフェ・POPUPストア" },
          { href: "/areas/sunshine/", label: "サンシャインシティのイベント" },
        ]}
      />

      <Section id="ending-soon" kicker="Last Chance" title="まもなく終了">
        <EventTimeline
          events={endingSoon}
          today={today}
          empty="1週間以内に終了するイベントはありません。"
        />
      </Section>

      <div className="section">
        <EventCalendar events={getEventArticles()} today={today} />
      </div>

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
          events={upcoming}
          today={today}
          empty="開催予定のイベント情報はまだありません。"
        />
      </Section>
    </>
  )
}

export default Page
