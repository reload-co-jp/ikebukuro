import { AREAS, CATEGORIES, type Article } from "@/lib/articles"

/**
 * Article thumbnail. Uses the saved photo when the article has one, otherwise
 * a typographic pastel block in the colour of its main category.
 */
export const Thumb = ({
  article,
  large = false,
}: {
  article: Article
  large?: boolean
}) => {
  const category = CATEGORIES[article.categories[0]]
  const className = large ? "thumb thumb--large" : "thumb"
  const style = { "--thumb-color": category.color } as React.CSSProperties
  const { image } = article

  if (image) {
    return (
      <div className={`${className} thumb--photo`} style={style}>
        <img
          className="thumb__img"
          src={image.src}
          // Cards repeat the title right below, so the photo is decorative there.
          alt={large ? image.alt : ""}
          width={image.width}
          height={image.height}
          loading={large ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="thumb__label">{category.name}</span>
      </div>
    )
  }

  return (
    <div className={className} style={style} aria-hidden="true">
      <span className="thumb__label">{category.name}</span>
      <span className="thumb__name">
        {article.event?.name ?? article.title}
      </span>
      <span className="thumb__area">📍{AREAS[article.area].name}</span>
    </div>
  )
}
