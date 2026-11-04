import Link from "next/link"
import type { ReactNode } from "react"

export const PageHeader = ({
  kicker,
  title,
  lead,
}: {
  kicker?: string
  title: string
  lead?: ReactNode
}) => (
  <header className="page-header">
    {kicker && <p className="kicker">{kicker}</p>}
    <h1 className="page-header__title">{title}</h1>
    {lead && <p className="page-header__lead">{lead}</p>}
  </header>
)

export const Section = ({
  id,
  kicker,
  title,
  action,
  children,
}: {
  id: string
  kicker?: string
  title: string
  action?: ReactNode
  children: ReactNode
}) => (
  <section className="section" aria-labelledby={id}>
    <div className="section__head">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id} className="section__title">
          {title}
        </h2>
      </div>
      {action}
    </div>
    {children}
  </section>
)

/** Akiba-style "詳細を見る" link panel. */
export const LinkPanel = ({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) => (
  <nav className="link-panel" aria-label={title}>
    <p className="link-panel__title">{title}</p>
    <ul>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)
