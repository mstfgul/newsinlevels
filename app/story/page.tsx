import type { Metadata } from "next";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/Prose";
import { StoryView } from "./StoryView";

export const metadata: Metadata = pageMetadata({
  title: "Story",
  description:
    "Why I built Any Text — an app that rewrites real news, art, film, books and history at your level.",
  path: "/story/",
});

export default function StoryPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `The story — ${SITE_NAME}`,
          url: `${SITE_URL}/story/`,
          isPartOf: { "@type": "WebSite", url: SITE_URL },
        }}
      />
      <Prose>
        <StoryView />
      </Prose>
    </div>
  );
}
