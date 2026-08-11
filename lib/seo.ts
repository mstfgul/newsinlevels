import type { Metadata } from "next";

export const SITE_URL = "https://www.anytext.art";
export const SITE_NAME = "AnyText";
export const SITE_DESCRIPTION =
  "AnyText is an iPhone app that rewrites real news, art, film, books, quotes and history at CEFR levels A1–C2, in Turkish, English, French, Italian, Spanish, German and Dutch. Tap any word for an instant translation.";

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
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
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
