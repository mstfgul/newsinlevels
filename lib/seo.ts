import type { Metadata } from "next";
import type { Article } from "./types";

export const SITE_URL = "https://www.anytext.art";
export const SITE_NAME = "Any Text in Levels";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/**
 * Per-page metadata for a single article/artwork/book/film/history/quote
 * page. Always described from the English B1 version — the same default a
 * first-time visitor (or a crawler, which never runs the client-side
 * language/level picker) actually sees on first paint.
 */
export function articleMetadata(article: Article, path: string): Metadata {
  const version = article.languages.en.B1;
  const title = `${version.title} — ${SITE_NAME}`;
  const description = truncate(version.text, 160);
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: version.title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: `${article.date}T00:00:00.000Z`,
      images: article.image ? [{ url: article.image }] : undefined,
    },
    twitter: {
      card: article.image ? "summary_large_image" : "summary",
      title: version.title,
      description,
      images: article.image ? [article.image] : undefined,
    },
  };
}
