import type { MetadataRoute } from "next";
import {
  getIndex,
  getArtIndex,
  getBookIndex,
  getFilmIndex,
  getHistoryIndex,
  getQuoteIndex,
} from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

// Every entry ever published stays reachable (older pages just render
// on-demand instead of being pre-built — see recentWindow() in lib/data.ts),
// so the sitemap lists all of them, not just the recently pre-rendered ones.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "news",
    "art",
    "films",
    "books",
    "quotes",
    "history",
  ].map((path) => ({
    url: `${SITE_URL}/${path}${path ? "/" : ""}`,
    changeFrequency: "daily",
  }));

  const contentPages: MetadataRoute.Sitemap = [
    ...getIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "article" })),
    ...getArtIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "art" })),
    ...getBookIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "books" })),
    ...getFilmIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "films" })),
    ...getHistoryIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "history" })),
    ...getQuoteIndex().map((entry) => ({ id: entry.id, date: entry.date, section: "quotes" })),
  ].map(({ id, date, section }) => ({
    url: `${SITE_URL}/${section}/${id}/`,
    lastModified: date,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...contentPages];
}
