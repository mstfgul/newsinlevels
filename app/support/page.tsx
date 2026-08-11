import type { Metadata } from "next";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SupportView } from "./SupportView";

export const metadata: Metadata = pageMetadata({
  title: "Support",
  description: "Get help with Any Text — subscriptions, your account, bugs, and suggestions.",
  path: "/support/",
});

export default function SupportPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Support — ${SITE_NAME}`,
          url: `${SITE_URL}/support/`,
        }}
      />
      <SupportView />
    </div>
  );
}
