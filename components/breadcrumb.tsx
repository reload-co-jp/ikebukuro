import Link from "next/link"
import { jsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/site"

export type Crumb = { name: string; href: string }

export const Breadcrumb = ({ items }: { items: Crumb[] }) => {
  const all = [{ name: "ホーム", href: "/" }, ...items]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  }
  return (
    <nav aria-label="パンくずリスト" className="breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <ol>
        {all.map((c, i) => (
          <li key={c.href}>
            {i === all.length - 1 ? (
              <span aria-current="page">{c.name}</span>
            ) : (
              <Link href={c.href}>{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
