import { buildRssFeedXml } from "@/lib/feeds"

export const dynamic = "force-static"

export const GET = () =>
  new Response(buildRssFeedXml(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
