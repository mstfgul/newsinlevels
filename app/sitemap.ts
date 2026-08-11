import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly" },
    { url: `${SITE_URL}/privacy/`, changeFrequency: "yearly" },
    { url: `${SITE_URL}/support/`, changeFrequency: "yearly" },
  ];
}
