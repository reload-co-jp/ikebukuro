import Link from "next/link"
import { CATEGORIES, getCategoryIds } from "@/lib/articles"
import { siteName, siteTagline } from "@/lib/site"
import { EVENT_NAV, MAIN_NAV } from "./nav"

export const Logo = () => (
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    aria-hidden="true"
    className="logo-mark"
  >
    <circle cx="16" cy="16" r="15" fill="var(--color-accent)" />
    <circle cx="11" cy="14" r="5" fill="#fff" />
    <circle cx="21" cy="14" r="5" fill="#fff" />
    <circle cx="11" cy="14" r="2.2" fill="var(--color-ink)" />
    <circle cx="21" cy="14" r="2.2" fill="var(--color-ink)" />
    <path d="M14 20 L16 23 L18 20 Z" fill="#fcd34d" />
  </svg>
)

export const SiteHeader = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <Link href="/" className="brand">
        <Logo />
        <span>
          <span className="brand__name">{siteName}</span>
          <span className="brand__tagline">{siteTagline}</span>
        </span>
      </Link>
      <nav aria-label="メインナビゲーション" className="site-nav">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
    <nav aria-label="イベントの日付で探す" className="quick-nav">
      <div className="quick-nav__inner">
        {EVENT_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="quick-nav__item">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  </header>
)

export const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <p className="site-footer__brand">{siteName}</p>
        <p>
          {siteTagline}
          。池袋・東池袋・西池袋・目白・南長崎のイベントと最新情報を紹介しています。
        </p>
      </div>
      <nav aria-label="カテゴリ" className="site-footer__links">
        {getCategoryIds().map((id) => (
          <Link key={id} href={`/categories/${id}/`}>
            {CATEGORIES[id].name}
          </Link>
        ))}
      </nav>
      <nav aria-label="サイト情報" className="site-footer__links">
        <Link href="/about/">このサイトについて</Link>
        <Link href="/rss.xml">RSS</Link>
        <a
          href="https://reload.co.jp"
          rel="noopener noreferrer"
          target="_blank"
        >
          運営会社
        </a>
      </nav>
    </div>
    <p className="site-footer__copy">&copy; {siteName}</p>
  </footer>
)
