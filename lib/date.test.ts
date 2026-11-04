import { describe, expect, it } from "vitest"
import {
  addDays,
  daysBetween,
  formatLongDate,
  formatPeriod,
  formatShortDate,
  todayJst,
  weekendRange,
} from "./date"

describe("todayJst", () => {
  it("uses Japan time, not UTC", () => {
    // 2026-11-04 16:00 UTC is already 11/5 01:00 in Tokyo.
    expect(todayJst(new Date("2026-11-04T16:00:00Z"))).toBe("2026-11-05")
  })
})

describe("addDays / daysBetween", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01")
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01")
    expect(daysBetween("2026-11-04", "2026-11-10")).toBe(6)
  })
})

describe("formatting", () => {
  it("adds Japanese weekdays", () => {
    expect(formatShortDate("2026-11-07")).toBe("11/7（土）")
    expect(formatLongDate("2026-11-01")).toBe("2026年11月1日（日）")
  })

  it("formats periods", () => {
    expect(formatPeriod("2026-11-14", "2026-11-14")).toBe("11/14（土）")
    expect(formatPeriod("2026-11-07", "2026-11-08")).toBe(
      "11/7（土）〜11/8（日）"
    )
    expect(formatPeriod("2026-11-13")).toBe("11/13（金）〜")
    expect(formatPeriod("2026-11-14", "2027-01-31")).toBe(
      "11/14（土）〜2027/1/31（日）"
    )
  })
})

describe("weekendRange", () => {
  it("returns the coming weekend on a weekday", () => {
    expect(weekendRange("2026-11-04")).toEqual({
      start: "2026-11-07",
      end: "2026-11-08",
    })
  })

  it("returns the current weekend on Saturday and Sunday", () => {
    expect(weekendRange("2026-11-07")).toEqual({
      start: "2026-11-07",
      end: "2026-11-08",
    })
    expect(weekendRange("2026-11-08")).toEqual({
      start: "2026-11-07",
      end: "2026-11-08",
    })
  })
})
