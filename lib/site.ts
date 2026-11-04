export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ikebukuro.reload.co.jp"
).replace(/\/$/, "")

export const siteName = "イケブクロLive"
export const siteNameEn = "Ikebukuro Live"

export const siteTagline = "池袋の「今日行ける」を毎日お届け"

export const siteDescription =
  "池袋で開催中・開催予定のイベント、コラボカフェ、POPUP、グルメフェス、展示などの最新情報を、ニュース記事としてわかりやすく届けるメディア"

export const absoluteUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${siteUrl}${normalizedPath}`
}
