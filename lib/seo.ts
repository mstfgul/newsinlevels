import type { Metadata } from "next";
import type { Article, Language } from "./types";
import { LANGUAGES } from "./types";

export const SITE_URL = "https://www.anytext.art";
export const SITE_NAME = "Any Text in Levels";
export const SITE_DESCRIPTION =
  "Real news, art, films, books, quotes and history rewritten at CEFR levels A1–C2 in English, German, French and Spanish. Free graded reading for language learners, new texts every day.";

/**
 * The six content sections. `key` is the URL segment the detail pages live
 * under (news articles historically live at /article/, not /news/).
 */
export const SECTIONS = {
  article: { label: "News", listPath: "/news/" },
  art: { label: "Daily Art", listPath: "/art/" },
  history: { label: "On This Day", listPath: "/history/" },
  quotes: { label: "Quotes", listPath: "/quotes/" },
  films: { label: "Film Club", listPath: "/films/" },
  books: { label: "Book Club", listPath: "/books/" },
} as const;

export type Section = keyof typeof SECTIONS;

/** Non-English editions get their own crawlable URL under the article. */
export const VARIANT_LANGS = ["de", "fr", "es"] as const;
export type VariantLang = (typeof VARIANT_LANGS)[number];

export function isVariantLang(value: string): value is VariantLang {
  return (VARIANT_LANGS as readonly string[]).includes(value);
}

export function articlePath(section: Section, id: string, lang: Language = "en"): string {
  const base = `/${section}/${id}/`;
  return lang === "en" ? base : `${base}${lang}/`;
}

export function availableLanguages(article: Article): Language[] {
  return LANGUAGES.filter((lang) => article.languages[lang]);
}

const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/** hreflang map linking every language edition of an article. */
function languageAlternates(article: Article, section: Section) {
  const languages: Partial<Record<Language | "x-default", string>> = {};
  for (const lang of availableLanguages(article)) {
    languages[lang] = `${SITE_URL}${articlePath(section, article.id, lang)}`;
  }
  languages["x-default"] = `${SITE_URL}${articlePath(section, article.id, "en")}`;
  return languages;
}

/**
 * Per-page metadata for a single article/artwork/book/film/history/quote
 * page. Described from the B1 version of the page's language — the same
 * default a first-time visitor (or a crawler, which never runs the
 * client-side level picker) actually sees on first paint.
 */
export function articleMetadata(
  article: Article,
  section: Section,
  lang: Language = "en",
): Metadata {
  const version = article.languages[lang]!.B1;
  const description = truncate(version.text, 160);
  const url = `${SITE_URL}${articlePath(section, article.id, lang)}`;

  return {
    title: version.title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(article, section),
    },
    openGraph: {
      title: version.title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: OG_LOCALES[lang],
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

/** Metadata for a static page (section lists, about, home). */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: title ?? SITE_NAME,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title: title ?? SITE_NAME, description },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
};

/** What the article is about, typed per section for richer results. */
function aboutEntity(article: Article): object | undefined {
  if (article.art) {
    return {
      "@type": "VisualArtwork",
      name: article.art.title,
      creator: { "@type": "Person", name: article.art.artist },
      dateCreated: article.art.year,
      artMedium: article.art.medium,
    };
  }
  if (article.film) {
    return {
      "@type": "Movie",
      name: article.film.title,
      director: { "@type": "Person", name: article.film.director },
      dateCreated: article.film.year,
    };
  }
  if (article.book) {
    return {
      "@type": "Book",
      name: article.book.title,
      author: { "@type": "Person", name: article.book.author },
      datePublished: article.book.year,
    };
  }
  if (article.quote) {
    return {
      "@type": "Quotation",
      text: article.quote.text,
      creator: { "@type": "Person", name: article.quote.author },
    };
  }
  return undefined;
}

export function articleJsonLd(
  article: Article,
  section: Section,
  lang: Language = "en",
): object {
  const version = article.languages[lang]!.B1;
  const url = `${SITE_URL}${articlePath(section, article.id, lang)}`;
  const about = aboutEntity(article);

  return {
    "@context": "https://schema.org",
    "@type": section === "article" ? "NewsArticle" : "Article",
    headline: version.title,
    description: truncate(version.text, 160),
    image: article.image ? [article.image] : undefined,
    datePublished: `${article.date}T00:00:00.000Z`,
    inLanguage: lang,
    isAccessibleForFree: true,
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: url,
    articleSection: SECTIONS[section].label,
    // The same story exists at six CEFR levels — mark it as learning material.
    learningResourceType: "Graded reading",
    educationalLevel: "CEFR A1–C2",
    audience: { "@type": "EducationalAudience", educationalRole: "language learner" },
    about,
  };
}

export function breadcrumbJsonLd(
  article: Article,
  section: Section,
  lang: Language = "en",
): object {
  const version = article.languages[lang]!.B1;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: SECTIONS[section].label,
        item: `${SITE_URL}${SECTIONS[section].listPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: version.title,
        item: `${SITE_URL}${articlePath(section, article.id, lang)}`,
      },
    ],
  };
}

export function webSiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "de", "fr", "es"],
    publisher: PUBLISHER,
  };
}
