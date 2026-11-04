import { marked } from "marked"

/**
 * Renders Markdown from data/articles.json. The content is authored in this
 * repository (not user input), so the generated HTML is trusted.
 */
export const Markdown = ({ source }: { source: string }) => (
  <div
    className="prose"
    dangerouslySetInnerHTML={{ __html: marked.parse(source, { async: false }) }}
  />
)
