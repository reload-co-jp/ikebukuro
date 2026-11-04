import { Breadcrumb } from "@/components/breadcrumb"
import { PageHeader } from "@/components/page-header"
import { siteDescription, siteName } from "@/lib/site"

export const metadata = {
  title: "このサイトについて",
  description: siteDescription,
  alternates: { canonical: "/about/" },
}

const Page = () => (
  <>
    <Breadcrumb items={[{ name: "このサイトについて", href: "/about/" }]} />
    <article className="article">
      <PageHeader kicker="About" title="このサイトについて" />
      <div className="prose">
        <p>
          {siteName}
          は、池袋で開催されるイベントや最新情報を紹介するニュースメディアです。サンシャインシティ、池袋西口公園、東武・西武百貨店、乙女ロード周辺のアニメショップ、トキワ荘ゆかりの南長崎、目白まで、豊島区の「今日行ける」情報をお届けします。
        </p>
        <h2>編集方針</h2>
        <ul>
          <li>
            主催者の公式サイト・プレスリリース・施設の公式ページなど、一次情報を確認して記事を作成しています。
          </li>
          <li>各記事の末尾に出典・公式情報へのリンクを掲載しています。</li>
          <li>
            日程・料金・内容は変更されることがあります。お出かけ前に必ず公式情報をご確認ください。
          </li>
          <li>
            サイトは毎日再生成され、「今日」「今週末」などの一覧は自動で更新されます。
          </li>
        </ul>
        <h2>掲載情報の修正について</h2>
        <p>
          掲載内容に誤りがある場合や、イベント情報の掲載をご希望の場合は、運営会社までお問い合わせください。
        </p>
        <h2>運営</h2>
        <p>
          <a
            href="https://reload.co.jp"
            target="_blank"
            rel="noopener noreferrer"
          >
            株式会社リロード
          </a>
        </p>
      </div>
    </article>
  </>
)

export default Page
