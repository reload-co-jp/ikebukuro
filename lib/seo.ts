import type { Metadata } from "next"
import { absoluteUrl, siteName } from "@/lib/site"

/** Site-wide share image, used when a page has no image of its own. */
export const defaultOgImage = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: `${siteName}｜池袋のイベント・コラボ・最新情報`,
}

/** Raster logo for structured data (Google does not accept SVG logos). */
export const logoPath = "/logo.png"

type PageMetaInput = {
  title: string
  description: string
  /** Canonical path with a trailing slash, e.g. "/events/". */
  path: string
}

/**
 * Metadata for list/index pages. Next.js does not derive og:title,
 * og:description or og:url from title/description, so set them explicitly;
 * otherwise shares of these pages fall back to the bare site name.
 */
export const pageMetadata = ({
  title,
  description,
  path,
}: PageMetaInput): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    siteName,
    locale: "ja_JP",
    url: path,
    title: `${title} | ${siteName}`,
    description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteName}`,
    description,
  },
})

/**
 * ItemList structured data for a page that lists event articles, so search
 * engines can tie the list page to each event's detail page.
 */
export const eventItemListJsonLd = ({
  name,
  path,
  events,
}: {
  name: string
  path: string
  events: { title: string; slug: string }[]
}) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  url: absoluteUrl(path),
  numberOfItems: events.length,
  itemListElement: events.map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: a.title,
    url: absoluteUrl(`/articles/${a.slug}/`),
  })),
})
