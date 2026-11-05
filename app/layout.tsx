import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { SiteFooter, SiteHeader, SiteSidebar } from "@/components/layout"
import { jsonLdScript } from "@/lib/json-ld"
import {
  absoluteUrl,
  siteDescription,
  siteName,
  siteNameEn,
  siteUrl,
} from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName}｜池袋のイベント・コラボ・最新情報`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: siteName,
    alternateName: siteNameEn,
    inLanguage: "ja",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteName,
    url: absoluteUrl("/"),
  },
]

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd) }}
      />
    </head>
    <body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-85V2GGSHTE"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-85V2GGSHTE');
        `}
      </Script>
      <Script
        async
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6542845006087970"
        strategy="afterInteractive"
      />
      <SiteHeader />
      <div className="site-shell">
        <SiteSidebar />
        <div className="site-content">
          <main className="main">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </body>
  </html>
)

export default RootLayout
