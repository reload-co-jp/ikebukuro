# イケブクロLive

池袋で開催中・開催予定のイベント、コラボカフェ、POPUP、グルメフェス、展示などの最新情報を紹介するニュースメディアです。
姉妹サイト「アキバLive」（秋葉原）・浅草のサイトと同じく、Next.js の静的書き出し（`output: "export"`）で GitHub Pages に配信します。

## 技術スタック

- Next.js 16（App Router / Static Export）
- React 19 / TypeScript
- marked（記事本文の Markdown 変換）
- Vitest + Testing Library

## ページ構成

| パス | 内容 |
| --- | --- |
| `/` | トップ（今週末・開催予定・新着・まもなく終了・エリア/ジャンル） |
| `/events/` | 開催中・開催予定のイベント一覧 |
| `/events/today/` `/events/this-weekend/` `/events/this-week/` `/events/free/` | 日付・条件別のイベント一覧 |
| `/events/month/[YYYY-MM]/` | 月別のイベント一覧（「池袋イベント 11月」など月指定の検索向け） |
| `/articles/` | 新着記事一覧 |
| `/articles/[slug]/` | 記事詳細（NewsArticle / Event の JSON-LD 付き） |
| `/areas/` `/areas/[area]/` | エリア別一覧（東口・西口・サンシャインシティ・池袋駅・南長崎・目白・全域） |
| `/categories/[category]/` | ジャンル別一覧 |
| `/about/` | サイトについて・編集方針 |
| `/rss.xml` `/sitemap.xml` `/robots.txt` | フィード・SEO |

デザインはアキバLiveに合わせ、白いヘッダー（ピル型ナビ＋検索）、左サイドバー、クリーム色のカード、ピンク／シアン／イエロー／パープルのピルタグ、右カラムのウィジェット、イベントカレンダーで構成しています。ヘッダーの検索は `/articles/?q=` に送られ、記事一覧側でクライアントサイドに絞り込みます。

「今日」「今週末」などはビルド時の日付（JST）で計算します。`deploy.yml` で毎日 JST 0:05 に再ビルドします。

## 記事の追加

`data/articles.json` に記事を追加すると、一覧・詳細・サイトマップ・RSS に反映されます。

```jsonc
{
  "id": 20,                        // 一意の連番
  "slug": "example-event-2026",    // URL（半角英小文字・数字・ハイフン）
  "title": "記事タイトル",
  "summary": "概要文（description にも使用）",
  "content": "## 概要\n\n...\n\n## 内容\n\n...\n\n## 開催情報\n\n...\n\n## こんな人におすすめ\n\n...",
  "publishedAt": "2026-11-04",
  "area": "sunshine",              // lib/articles.ts の AREAS のキー
  "categories": ["anime"],         // lib/articles.ts の CATEGORIES のキー（先頭がメイン）
  "tags": ["サンシャインシティ"],
  "sources": [{ "label": "公式サイト", "url": "https://example.com" }],
  "image": {                       // 任意。public/images/articles/ に保存したサムネイル
    "src": "/images/articles/example-event-2026.jpg",
    "alt": "「イベント名」の告知画像",
    "sourceLabel": "公式サイト",     // 記事ページに「画像出典」として表示
    "sourceUrl": "https://example.com",
    "width": 1200,
    "height": 630
  },
  "event": {                       // イベント記事のみ
    "name": "イベント名",
    "venue": "会場",
    "address": "東京都豊島区…",     // 任意
    "latitude": 35.72929,           // 任意。pnpm geocode:events で address から付与
    "longitude": 139.719193,        // 緯度経度があると記事に会場の地図を表示
    "startDate": "2026-11-07",
    "endDate": "2026-11-08",        // 終了日未定なら省略
    "hours": "10:00〜18:00",         // 任意
    "price": "入場無料",
    "free": true,
    "reservation": false
  }
}
```

編集方針：主催者の公式サイト・プレスリリース・施設の公式ページで事実を確認し、`sources` に出典を必ず記載します。サムネイルは公式サイト・プレスリリースの告知画像（og:image）を `public/images/articles/` に保存し、記事ページに画像出典を表示します。画像がない記事はカテゴリ色のタイポグラフィで表示します。

`pnpm test` で記事データの整合性（ID・slug の重複、日付形式、エリア/カテゴリのキーなど）を検証できます。

記事の収集は `.claude/skills/ikebukuro-article-harvester` を参照してください（`pnpm harvest scan` で候補を一覧化、`pnpm harvest image "<画像URL>" "<slug>" "<出典URL>" "<出典名>" "<alt>"` で画像を保存）。

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm build` | 静的サイトをビルド（`/out` に出力） |
| `pnpm test` | Vitest を実行 |
| `pnpm lint` | ESLint を実行 |
| `pnpm typecheck` | TypeScript の型チェック |
| `pnpm format` | Prettier でフォーマット |

## 環境変数

- `NEXT_PUBLIC_SITE_URL`：canonical・サイトマップ等に使う公開 URL（既定値 `https://ikebukuro.reload.co.jp`）
