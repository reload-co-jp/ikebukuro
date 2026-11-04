/**
 * Serialise a value for embedding in a <script type="application/ld+json"> tag.
 * "<" is escaped so a string containing "</script>" cannot close the tag early.
 */
export const jsonLdScript = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c")
