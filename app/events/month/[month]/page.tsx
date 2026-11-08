import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleGrid } from "@/components/article-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { getEventMonths, getEventsInMonth } from "@/lib/articles"
import { formatMonth, isMonthKey, todayJst } from "@/lib/date"
import { jsonLdScript } from "@/lib/json-ld"
import { eventItemListJsonLd, pageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ month: string }> }

export const dynamicParams = false

export const generateStaticParams = () =>
  getEventMonths(todayJst()).map((month) => ({ month }))

const titleOf = (month: string) =>
  `池袋イベント ${formatMonth(month)}の開催情報`

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { month } = await params
  if (!isMonthKey(month)) return {}
  const events = getEventsInMonth(month)
  const names = events
    .slice(0, 3)
    .map((a) => a.event.name)
    .join("、")
  return pageMetadata({
    title: titleOf(month),
    description: `${formatMonth(month)}に池袋で開催されるイベント${events.length}件を開催日順にまとめました。${names ? `${names}など、` : ""}サンシャインシティや池袋駅周辺のイベント・コラボカフェ・展示情報を掲載。`,
    path: `/events/month/${month}/`,
  })
}

const Page = async ({ params }: Props) => {
  const { month } = await params
  if (!isMonthKey(month)) notFound()
  const today = todayJst()
  const events = getEventsInMonth(month)
  const months = getEventMonths(today)
  const index = months.indexOf(month)
  const prev = months[index - 1]
  const next = months[index + 1]
  const title = titleOf(month)
  const path = `/events/month/${month}/`
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            eventItemListJsonLd({
              name: `池袋イベント ${formatMonth(month)}`,
              path,
              events,
            })
          ),
        }}
      />
      <Breadcrumb
        items={[
          { name: "イベント", href: "/events/" },
          { name: `${formatMonth(month)}のイベント`, href: path },
        ]}
      />
      <PageHeader
        kicker="Monthly"
        title={title}
        lead={`${formatMonth(month)}に池袋エリアで開催される（または期間中の）イベント${events.length}件を、開始日が早い順に掲載しています。`}
      />
      <nav
        aria-label="月を切り替える"
        className="chips"
        style={{ marginBottom: "1.5rem" }}
      >
        {prev && (
          <Link href={`/events/month/${prev}/`} className="chip" rel="prev">
            ← {formatMonth(prev)}
          </Link>
        )}
        <Link href="/events/" className="chip">
          開催中・開催予定のイベント
        </Link>
        {next && (
          <Link href={`/events/month/${next}/`} className="chip" rel="next">
            {formatMonth(next)} →
          </Link>
        )}
      </nav>
      <ArticleGrid
        articles={events}
        today={today}
        empty={`${formatMonth(month)}のイベント情報はまだありません。`}
        headingLevel={2}
      />
    </>
  )
}

export default Page
