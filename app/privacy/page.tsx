import type { Metadata } from "next";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PrivacyView } from "./PrivacyView";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Any Text collects, uses, and protects your data.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Privacy Policy — ${SITE_NAME}`,
          url: `${SITE_URL}/privacy/`,
        }}
      />
      <PrivacyView />
    </div>
  );
}
