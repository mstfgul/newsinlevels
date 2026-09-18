import type { Metadata } from "next";

export const SITE_URL = "https://www.anytext.art";
export const SITE_NAME = "AnyText";
export const SITE_DESCRIPTION =
  "Any Text is an iPhone app for learning a language through art: a daily page built from a curated selection of paintings, films, books, stories, quotes and essays — rewritten at CEFR levels A1–C2 in Turkish, English, French, Italian, Spanish, German and Dutch, with any word or sentence a tap away in fifteen languages.";

/** Metadata for a static page (privacy, support, home). */
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

const PUBLISHER = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
};

export function webSiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: PUBLISHER,
  };
}
