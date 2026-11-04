import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteFooter, SiteHeader, SiteSidebar } from "./layout"

describe("SiteHeader", () => {
  it("links the brand to the home page", () => {
    render(<SiteHeader />)
    expect(
      screen.getByRole("link", { name: "イケブクロLive" })
    ).toHaveAttribute("href", "/")
  })

  it("has a search form that targets the article list", () => {
    render(<SiteHeader />)
    const input = screen.getByRole("searchbox", { name: "記事を検索" })
    expect(input).toHaveAttribute("name", "q")
    expect(input.closest("form")).toHaveAttribute("action", "/articles/")
  })
})

describe("SiteSidebar", () => {
  it("offers date-based event lists", () => {
    render(<SiteSidebar />)
    expect(
      screen.getByRole("link", { name: "今日のイベント" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "今週末のイベント" })
    ).toBeInTheDocument()
  })
})

describe("SiteFooter", () => {
  it("lists every category", () => {
    render(<SiteFooter />)
    // next/link drops the trailing slash outside a Next.js build.
    expect(
      screen.getByRole("link", { name: "グルメ" }).getAttribute("href")
    ).toMatch(/^\/categories\/gourmet\/?$/)
  })
})
