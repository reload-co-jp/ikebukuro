import { describe, expect, it } from "vitest"
import { AREAS, getAllArticles, type Article } from "./articles"
import {
  getSpotArticles,
  getSpotCurrentEvents,
  getSpotForArticle,
  getSpotForTag,
  getSpots,
  MIN_SPOT_ARTICLES,
  SPOTS,
  spotMatches,
} from "./spots"

const article = (venue: string, tags: string[] = []): Article => ({
  id: 0,
  slug: "x",
  title: "テスト",
  summary: "",
  content: "",
  publishedAt: "2026-11-01",
  area: "sunshine",
  categories: ["anime"],
  tags,
  sources: [{ label: "公式", url: "https://example.com" }],
  event: {
    name: "テスト",
    venue,
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    price: "無料",
    free: true,
    reservation: false,
  },
})

describe("spots", () => {
  it("have unique URL-safe ids, known areas and match strings", () => {
    expect(new Set(SPOTS.map((s) => s.id)).size).toBe(SPOTS.length)
    for (const s of SPOTS) {
      expect(s.id).toMatch(/^[a-z0-9-]+$/)
      expect(AREAS).toHaveProperty(s.area)
      expect(s.match.length).toBeGreaterThan(0)
    }
  })

  it("publishes only spots with enough articles", () => {
    expect(getSpots().length).toBeGreaterThan(0)
    for (const s of getSpots())
      expect(getSpotArticles(s).length).toBeGreaterThanOrEqual(
        MIN_SPOT_ARTICLES
      )
  })

  it("matches venue, tags and title", () => {
    const tobu = SPOTS.find((s) => s.id === "tobu-ikebukuro")!
    expect(spotMatches(tobu, article("東武百貨店 池袋店 8階催事場"))).toBe(true)
    expect(spotMatches(tobu, article("会場", ["東武百貨店"]))).toBe(true)
    expect(spotMatches(tobu, article("西武池袋本店"))).toBe(false)
  })

  it("prefers the narrowest spot named in the venue", () => {
    expect(
      getSpotForArticle(article("サンシャインシティ 展示ホールD"))?.id
    ).toBe("sunshine-city-exhibition-hall")
    expect(getSpotForArticle(article("サンシャインシティ アルパ1階"))?.id).toBe(
      "sunshine-city"
    )
  })

  it("maps exact tags to spot pages", () => {
    expect(getSpotForTag("サンシャイン水族館")?.id).toBe("sunshine-aquarium")
    expect(getSpotForTag("サンシャイン")).toBeUndefined()
  })

  it("lists only events that have not ended, by start date", () => {
    const today = "2026-11-15"
    for (const s of getSpots()) {
      const events = getSpotCurrentEvents(s, today)
      for (const a of events)
        expect((a.event.endDate ?? "9999-12-31") >= today).toBe(true)
      const starts = events.map((a) => a.event.startDate)
      expect(starts).toEqual([...starts].sort())
    }
  })

  it("every article links to at most one spot that is published", () => {
    const published = new Set(getSpots().map((s) => s.id))
    for (const a of getAllArticles()) {
      const spot = getSpotForArticle(a)
      if (spot) expect(published.has(spot.id)).toBe(true)
    }
  })
})
