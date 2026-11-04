import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteFooter, SiteHeader } from "./layout"

describe("SiteHeader", () => {
  it("links the brand to the home page", () => {
    render(<SiteHeader />)
    expect(
      screen.getByRole("link", { name: /イケブクロLive/ })
    ).toHaveAttribute("href", "/")
  })

  it("offers quick links to date-based event lists", () => {
    render(<SiteHeader />)
    const nav = screen.getByRole("navigation", { name: "イベントの日付で探す" })
    expect(nav).toHaveTextContent("今日")
    expect(nav).toHaveTextContent("今週末")
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
