import { AREAS, CATEGORIES, type Article } from "@/lib/articles"

/**
 * Typographic thumbnail. The site does not redistribute third-party photos,
 * so each card gets a colour block derived from its main category.
 */
export const Thumb = ({
  article,
  large = false,
}: {
  article: Article
  large?: boolean
}) => {
  const category = CATEGORIES[article.categories[0]]
  return (
    <div
      className={large ? "thumb thumb--large" : "thumb"}
      style={{ "--thumb-color": category.color } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="thumb__area">{AREAS[article.area].name}</span>
      <span className="thumb__name">
        {article.event?.name ?? article.title}
      </span>
      <span className="thumb__category">{category.name}</span>
    </div>
  )
}
