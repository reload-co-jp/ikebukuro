import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleGrid } from "@/components/article-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader, Section } from "@/components/page-header"
import { AREAS } from "@/lib/articles"
import { formatMonth, monthOf, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { eventItemListJsonLd, pageMetadata } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import {
  getSpotArticles,
  getSpotById,
  getSpotCurrentEvents,
  getSpots,
  type Spot,
} from "@/lib/spots"

type Props = { params: Promise<{ spot: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getSpots().map((s) => ({ spot: s.id }))

const titleOf = (spot: Spot, today: string) =>
  `${spot.name}の${spot.topic}情報【${formatMonth(monthOf(today))}最新】`

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const spot = getSpotById((await params).spot)
  if (!spot) return {}
  const today = todayJst()
  const current = getSpotCurrentEvents(spot, today)
  const names = current
    .slice(0, 3)
    .map((a) => a.event.name)
    .join("、")
  return pageMetadata({
    title: titleOf(spot, today),
    description: `${spot.name}で開催中・開催予定の${spot.topic}${current.length}件をまとめました。${names ? `${names}など。` : ""}会期・料金・予約の有無を公式情報をもとに掲載しています。`,
    path: `/spots/${spot.id}/`,
  })
}

const Page = async ({ params }: Props) => {
  const spot = getSpotById((await params).spot)
  if (!spot) notFound()
  const today = todayJst()
  const path = `/spots/${spot.id}/`
  const current = getSpotCurrentEvents(spot, today)
  const currentSlugs = new Set(current.map((a) => a.slug))
  const others = getSpotArticles(spot).filter((a) => !currentSlugs.has(a.slug))
  const nearby = getSpots().filter(
    (s) => s.id !== spot.id && s.area === spot.area
  )
  const place = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: spot.name,
    description: spot.description,
    url: absoluteUrl(path),
    address: {
      "@type": "PostalAddress",
      ...(spot.address ? { streetAddress: spot.address } : {}),
      addressLocality: "豊島区",
      addressRegion: "東京都",
      addressCountry: "JP",
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            place,
            eventItemListJsonLd({
              name: `${spot.name}の${spot.topic}`,
              path,
              events: current,
            }),
          ]),
        }}
      />
      <Breadcrumb
        items={[
          { name: "スポット", href: "/spots/" },
          { name: spot.name, href: path },
        ]}
      />
      <PageHeader
        kicker="Spot"
        title={titleOf(spot, today)}
        lead={`${spot.description}開催中・開催予定の${spot.topic}は${current.length}件です。`}
      />
      <dl className="spot-info">
        <dt>エリア</dt>
        <dd>
          <Link href={`/areas/${spot.area}/`}>{AREAS[spot.area].name}</Link>
        </dd>
        {spot.address && (
          <>
            <dt>所在地</dt>
            <dd>{spot.address}</dd>
          </>
        )}
      </dl>
      <Section
        id="spot-current"
        kicker="Now & Next"
        title={`${spot.shortName}で開催中・開催予定の${spot.topic}`}
      >
        <ArticleGrid
          articles={current}
          today={today}
          empty={`${spot.shortName}で開催中・開催予定のイベント情報は現在ありません。`}
          headingLevel={3}
        />
      </Section>
      {others.length > 0 && (
        <Section
          id="spot-archive"
          kicker="Archive"
          title={`${spot.shortName}の過去のイベント・ニュース`}
        >
          <ArticleGrid articles={others} today={today} headingLevel={3} />
        </Section>
      )}
      {nearby.length > 0 && (
        <nav className="chips" aria-label="同じエリアのスポット">
          {nearby.map((s) => (
            <Link key={s.id} href={`/spots/${s.id}/`} className="chip">
              {s.shortName}のイベント
            </Link>
          ))}
          <Link href="/spots/" className="chip">
            スポット一覧
          </Link>
        </nav>
      )}
    </>
  )
}

export default Page
