import Link from "next/link"
import { CATEGORIES, getCategoryIds } from "@/lib/articles"
import { siteName, siteTagline } from "@/lib/site"
import { getSisterSites, SISTER_SITES_HEADING } from "@/lib/sister-sites"
import { HEADER_NAV, SIDEBAR_NAV } from "./nav"

/** Wordmark: owl mark + "イケブクロLive" in the pop colours of the Akiba site. */
export const Logo = () => (
  <span className="logo">
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <rect
        x="2"
        y="4"
        width="36"
        height="34"
        rx="12"
        fill="var(--color-pink)"
      />
      <path
        d="M8 6 L14 13 L6 13 Z M32 6 L34 13 L26 13 Z"
        fill="var(--color-pink)"
      />
      <circle cx="14" cy="20" r="7" fill="#fff" />
      <circle cx="26" cy="20" r="7" fill="#fff" />
      <circle cx="14.5" cy="20.5" r="3" fill="#22252b" />
      <circle cx="25.5" cy="20.5" r="3" fill="#22252b" />
      <path d="M17.5 27 L20 31 L22.5 27 Z" fill="var(--color-yellow)" />
    </svg>
    <span className="logo__text">
      <span className="logo__main">
        イケブクロ<span className="logo__live">Live</span>
      </span>
      <span className="logo__sub">IKEBUKURO LIVE</span>
    </span>
  </span>
)

export const SiteHeader = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <Link href="/" className="site-header__brand" aria-label={siteName}>
        <Logo />
      </Link>
      <nav className="site-header__nav" aria-label="主要ナビゲーション">
        {HEADER_NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="site-header__tagline">
        <span className="site-header__kicker">Ikebukuro journal</span>
        {siteTagline}！
      </div>
      <form action="/articles/" className="site-header__search" role="search">
        <input
          type="search"
          name="q"
          className="site-header__search-input"
          placeholder="キーワードで検索（例：コラボカフェ、サンシャイン）"
          aria-label="記事を検索"
        />
        <button type="submit" className="site-header__search-button">
          検索
        </button>
      </form>
    </div>
  </header>
)

export const SiteSidebar = () => (
  <nav className="site-sidebar" aria-label="カテゴリナビゲーション">
    <div className="site-sidebar__brand" aria-hidden="true">
      <span>池袋の</span>
      <span>イベント・コラボ</span>
      <span>最新情報</span>
    </div>
    {SIDEBAR_NAV.map((item) => (
      <Link key={item.href} href={item.href} className="site-sidebar__link">
        {item.label}
      </Link>
    ))}
  </nav>
)

export const SiteFooter = () => (
  <footer className="site-footer">
    <p>
      &copy; {siteName} /{" "}
      <a href="https://reload.co.jp" rel="noopener noreferrer" target="_blank">
        運営会社
      </a>
      {" / "}
      <Link href="/events/today/">今日のイベント</Link>
      {" / "}
      <Link href="/events/this-weekend/">今週末のイベント</Link>
      {" / "}
      <Link href="/areas/">エリア</Link>
      {getCategoryIds().map((id) => (
        <span key={id}>
          {" / "}
          <Link href={`/categories/${id}/`}>{CATEGORIES[id].name}</Link>
        </span>
      ))}
      {" / "}
      <Link href="/rss.xml">RSS</Link>
      {" / "}
      <Link href="/about/">このサイトについて</Link>
    </p>
    <nav aria-label={SISTER_SITES_HEADING.ja} className="site-footer__sister">
      {SISTER_SITES_HEADING.ja}：
      {getSisterSites("ikebukuro").map((site, i) => (
        <span key={site.id}>
          {i > 0 && " / "}
          <a href={site.url} title={site.name}>
            {site.label.ja}
          </a>
        </span>
      ))}
    </nav>
  </footer>
)
