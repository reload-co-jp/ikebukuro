import { getAllArticles, getPublishedIso } from "./articles"
import { absoluteUrl, siteDescription, siteName } from "./site"

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

export const buildRssFeedXml = (limit = 50): string => {
  const articles = getAllArticles().slice(0, limit)
  const items = articles
    .map((a) => {
      const url = absoluteUrl(`/articles/${a.slug}/`)
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.summary)}</description>
      <pubDate>${new Date(getPublishedIso(a)).toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")
  const lastBuild = articles[0]
    ? new Date(getPublishedIso(articles[0])).toUTCString()
    : new Date(0).toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>ja</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
