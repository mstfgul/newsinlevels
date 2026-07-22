import type { MetadataRoute } from "next";
import {
  getIndex,
  getArtIndex,
  getBookIndex,
  getFilmIndex,
  getHistoryIndex,
  getQuoteIndex,
} from "@/lib/data";
import { articlePath, SITE_URL, type Section } from "@/lib/seo";
import { LEVELS, type Language } from "@/lib/types";

interface SitemapSource {
  id: string;
  date: string;
  titles: Partial<Record<Language, string>>;
}

// Every language edition of every entry gets its own URL, and each URL
// carries the full hreflang set linking its sibling editions (mirroring the
// <link rel="alternate"> tags in the page head).
function contentEntries(section: Section, entries: SitemapSource[]): MetadataRoute.Sitemap {
  return entries.flatMap((entry) => {
    const langs = Object.keys(entry.titles) as Language[];
    const languages: Record<string, string> = {
      "x-default": `${SITE_URL}${articlePath(section, entry.id, "en")}`,
    };
    for (const lang of langs) {
      languages[lang] = `${SITE_URL}${articlePath(section, entry.id, lang)}`;
    }
    const alternates = langs.length > 1 ? { languages } : undefined;

    return langs.map((lang) => ({
      url: `${SITE_URL}${articlePath(section, entry.id, lang)}`,
      lastModified: entry.date,
      changeFrequency: "monthly" as const,
      alternates,
    }));
  });
}

// Every entry ever published stays reachable (older pages just render
// on-demand instead of being pre-built — see recentWindow() in lib/data.ts),
// so the sitemap lists all of them, not just the recently pre-rendered ones.
export default function sitemap(): MetadataRoute.Sitemap {
  // Each section's own freshest entry date stands in for the list page's
  // lastModified — accurate enough since the list re-renders whenever its
  // newest entry does, and cheaper than tracking a separate "last built" date.
  const sectionDates: Record<string, string | undefined> = {
    news: getIndex()[0]?.date,
    art: getArtIndex()[0]?.date,
    films: getFilmIndex()[0]?.date,
    books: getBookIndex()[0]?.date,
    quotes: getQuoteIndex()[0]?.date,
    history: getHistoryIndex()[0]?.date,
  };
  const latestOverall = Object.values(sectionDates).sort().at(-1);

  const staticPages: MetadataRoute.Sitemap = [
    ...["", "news", "art", "films", "books", "quotes", "history"].map((path) => ({
      url: `${SITE_URL}/${path}${path ? "/" : ""}`,
      lastModified: path ? sectionDates[path] : latestOverall,
      changeFrequency: "daily" as const,
    })),
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "monthly" as const,
    },
    // The 24 language × level reading-practice landing pages.
    ...["english", "german", "french", "spanish"].flatMap((lang) =>
      LEVELS.map((level) => ({
        url: `${SITE_URL}/read/${lang}/${level.toLowerCase()}/`,
        lastModified: latestOverall,
        changeFrequency: "daily" as const,
      })),
    ),
  ];

  return [
    ...staticPages,
    ...contentEntries("article", getIndex()),
    ...contentEntries("art", getArtIndex()),
    ...contentEntries("books", getBookIndex()),
    ...contentEntries("films", getFilmIndex()),
    ...contentEntries("history", getHistoryIndex()),
    ...contentEntries("quotes", getQuoteIndex()),
  ];
}
