import { describe, expect, it } from "vitest"
import {
  AREAS,
  CATEGORIES,
  getAllArticles,
  getEndingSoonEvents,
  getEventStatus,
  getEventsWithin,
  getOngoingEvents,
  getRelatedArticles,
  getUpcomingEvents,
  getWeekendEvents,
} from "./articles"

const TODAY = "2026-11-04"
const slugs = (list: { slug: string }[]) => list.map((a) => a.slug)

describe("articles.json", () => {
  const articles = getAllArticles()

  it("has unique ids and slugs", () => {
    expect(new Set(articles.map((a) => a.id)).size).toBe(articles.length)
    expect(new Set(slugs(articles)).size).toBe(articles.length)
  })

  it("uses known areas and categories", () => {
    for (const a of articles) {
      expect(AREAS).toHaveProperty(a.area)
      expect(a.categories.length).toBeGreaterThan(0)
      for (const c of a.categories) expect(CATEGORIES).toHaveProperty(c)
    }
  })

  it("has valid dates, sources and URL-safe slugs", () => {
    const iso = /^\d{4}-\d{2}-\d{2}$/
    for (const a of articles) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/)
      expect(a.publishedAt).toMatch(iso)
      expect(a.sources.length).toBeGreaterThan(0)
      for (const s of a.sources) expect(s.url).toMatch(/^https?:\/\//)
      if (a.event) {
        expect(a.event.startDate).toMatch(iso)
        if (a.event.endDate) {
          expect(a.event.endDate).toMatch(iso)
          expect(a.event.endDate >= a.event.startDate).toBe(true)
        }
      }
    }
  })

  it("is sorted newest first", () => {
    const dates = articles.map((a) => a.publishedAt)
    expect(dates).toEqual([...dates].sort().reverse())
  })
})

describe("event queries", () => {
  it("classifies event status", () => {
    const e = { startDate: "2026-11-07", endDate: "2026-11-08" } as never
    expect(getEventStatus(e, "2026-11-06")).toBe("upcoming")
    expect(getEventStatus(e, "2026-11-08")).toBe("ongoing")
    expect(getEventStatus(e, "2026-11-09")).toBe("ended")
  })

  it("treats a missing end date as open-ended", () => {
    const e = { startDate: "2026-11-13" } as never
    expect(getEventStatus(e, "2027-06-01")).toBe("ongoing")
  })

  it("finds ongoing events, ending soonest first", () => {
    const ongoing = getOngoingEvents(TODAY)
    expect(slugs(ongoing)).toContain("daizo-cafe-raku-cafe-ikebukuro")
    expect(slugs(ongoing)).not.toContain("animate-girls-festival-2026")
    const ends = ongoing.map((a) => a.event.endDate ?? "9999")
    expect(ends).toEqual([...ends].sort())
  })

  it("finds upcoming events, starting soonest first", () => {
    const upcoming = getUpcomingEvents(TODAY)
    expect(upcoming[0].event.startDate > TODAY).toBe(true)
    const starts = upcoming.map((a) => a.event.startDate)
    expect(starts).toEqual([...starts].sort())
  })

  it("finds weekend events", () => {
    const weekend = slugs(getWeekendEvents(TODAY))
    expect(weekend).toContain("animate-girls-festival-2026")
    expect(weekend).toContain("ikebukuro-west-gourmet-park-2026")
    expect(weekend).not.toContain("tamago-fes-tokyo-2026")
  })

  it("finds events within a window", () => {
    const week = slugs(getEventsWithin(TODAY, 7))
    expect(week).toContain("tobu-ikebukuro-dai-nagasaki-ten-2026")
    expect(week).not.toContain("trpg-summit-2026")
  })

  it("finds events ending within a week", () => {
    expect(slugs(getEndingSoonEvents(TODAY))).toEqual([
      "daizo-cafe-raku-cafe-ikebukuro",
    ])
  })
})

describe("getRelatedArticles", () => {
  it("excludes the article itself", () => {
    const [first] = getAllArticles()
    expect(slugs(getRelatedArticles(first))).not.toContain(first.slug)
  })
})

describe("getWeekendEvents ordering", () => {
  it("lists events starting this weekend before long-running ones", () => {
    const weekend = getWeekendEvents(TODAY)
    const firstRunning = weekend.findIndex(
      (a) => a.event.startDate < "2026-11-07"
    )
    const lastStarting = weekend
      .map((a) => a.event.startDate >= "2026-11-07")
      .lastIndexOf(true)
    expect(lastStarting).toBeLessThan(firstRunning)
  })
})
