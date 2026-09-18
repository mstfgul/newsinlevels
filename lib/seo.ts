import type { Metadata } from "next";

export const SITE_URL = "https://www.anytext.art";
export const SITE_NAME = "AnyText";
export const SITE_DESCRIPTION =
  "Any Text is an iPhone app that gives you a page a day — a painting, a film, a book, a quote, an essay, a story, a word, history and the news — rewritten at CEFR levels A1–C2 in Turkish, English, French, Italian, Spanish, German and Dutch. Tap any word or sentence for its meaning in one of fifteen languages.";

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
