import { describe, expect, it } from "vitest"
import { getArticleBySlug } from "@/lib/articles"
import { matchesQuery } from "./article-search"

const agf = getArticleBySlug("animate-girls-festival-2026")!

describe("matchesQuery", () => {
  it("matches every word against title, tags and venue", () => {
    expect(matchesQuery(agf, "")).toBe(true)
    expect(matchesQuery(agf, "AGF")).toBe(true)
    expect(matchesQuery(agf, "乙女ゲーム 展示ホール")).toBe(true)
    expect(matchesQuery(agf, "乙女ゲーム ラーメン")).toBe(false)
  })

  it("ignores full-width / half-width and case differences", () => {
    expect(matchesQuery(agf, "ａｇｆ")).toBe(true)
  })
})
