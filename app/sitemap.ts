import type { MetadataRoute } from "next"
import {
  getAllArticles,
  getAreaIds,
  getCategoryIds,
  getEventMonths,
  getLatestPublishedAt,
  getModifiedAt,
} from "@/lib/articles"
import { todayJst } from "@/lib/date"
import { absoluteUrl } from "@/lib/site"
import { getSpots } from "@/lib/spots"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => {
  const latest = new Date(`${getLatestPublishedAt()}T09:00:00+09:00`)
  const daily = (path: string, priority: number) => ({
    url: absoluteUrl(path),
    lastModified: latest,
    changeFrequency: "daily" as const,
    priority,
  })
  return [
    daily("/", 1),
    daily("/events/", 0.9),
    daily("/events/today/", 0.9),
    daily("/events/this-weekend/", 0.9),
    daily("/events/this-week/", 0.8),
    daily("/events/free/", 0.8),
    ...getEventMonths(todayJst()).map((m) => daily(`/events/month/${m}/`, 0.7)),
    daily("/articles/", 0.8),
    daily("/areas/", 0.6),
    ...getAreaIds().map((id) => daily(`/areas/${id}/`, 0.7)),
    ...getCategoryIds().map((id) => daily(`/categories/${id}/`, 0.7)),
    daily("/spots/", 0.6),
    ...getSpots().map((s) => daily(`/spots/${s.id}/`, 0.8)),
    { url: absoluteUrl("/about/"), changeFrequency: "monthly", priority: 0.3 },
    ...getAllArticles().map((a) => ({
      url: absoluteUrl(`/articles/${a.slug}/`),
      lastModified: new Date(`${getModifiedAt(a)}T09:00:00+09:00`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      ...(a.image && { images: [absoluteUrl(a.image.src)] }),
    })),
  ]
}

export default sitemap
