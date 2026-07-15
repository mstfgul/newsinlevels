import {
  getArticle,
  getArtIndex,
  getArtwork,
  getBook,
  getBookIndex,
  getFilm,
  getFilmIndex,
  getHistoryEvent,
  getHistoryIndex,
  getIndex,
  getQuote,
  getQuoteIndex,
} from "@/lib/data";
import {
  articlePath,
  SECTIONS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  type Section,
} from "@/lib/seo";
import type { Article } from "@/lib/types";

// The feed only changes when the daily pipelines commit new data, which
// triggers a redeploy anyway — so it can be fully static.
export const dynamic = "force-static";

const FEED_SIZE = 40;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export async function GET() {
  const sources: { section: Section; entries: { id: string; date: string }[]; load: (id: string) => Article }[] = [
    { section: "article", entries: getIndex(), load: getArticle },
    { section: "art", entries: getArtIndex(), load: getArtwork },
    { section: "books", entries: getBookIndex(), load: getBook },
    { section: "films", entries: getFilmIndex(), load: getFilm },
    { section: "history", entries: getHistoryIndex(), load: getHistoryEvent },
    { section: "quotes", entries: getQuoteIndex(), load: getQuote },
  ];

  const latest = sources
    .flatMap(({ section, entries, load }) =>
      entries.map((entry) => ({ section, id: entry.id, date: entry.date, load })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, FEED_SIZE);

  const items = latest
    .map(({ section, id, date, load }) => {
      const article = load(id);
      const version = article.languages.en.B1;
      const url = `${SITE_URL}${articlePath(section, id)}`;
      return `    <item>
      <title>${escapeXml(version.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${date}T06:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(SECTIONS[section].label)}</category>
      <description>${escapeXml(truncate(version.text, 300))}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
