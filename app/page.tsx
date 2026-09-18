import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { LevelDemo } from "@/components/home/LevelDemo";
import { WordDemo } from "@/components/home/WordDemo";
import { PhoneStory } from "@/components/home/PhoneStory";
import { KindsGrid } from "@/components/home/KindsGrid";
import { LibraryShelf } from "@/components/home/LibraryShelf";
import { LanguageMarquee } from "@/components/home/LanguageMarquee";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { ClosingCta } from "@/components/home/ClosingCta";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, webSiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

/**
 * The homepage is the desk (design-language.md § 1): full-width sections,
 * each its own beat, rather than the narrow notebook column the story,
 * privacy and support pages read in. Order: the hero and its wall of art →
 * the app's one bold move (six levels) → tap a word → the phone → what a
 * day holds → the library shelf → the languages → the story → the last word.
 */
export default function Home() {
  return (
    <div>
      <JsonLd data={webSiteJsonLd()} />
      <Hero />
      <LevelDemo />
      <WordDemo />
      <PhoneStory />
      <KindsGrid />
      <LibraryShelf />
      <LanguageMarquee />
      <StoryTeaser />
      <ClosingCta />
    </div>
  );
}
