import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { LevelDemo } from "@/components/home/LevelDemo";
import { WordDemo } from "@/components/home/WordDemo";
import { PhoneStory } from "@/components/home/PhoneStory";
import { Prose } from "@/components/Prose";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, webSiteJsonLd } from "@/lib/seo";
import { LEGAL_LANGUAGES } from "@/lib/legal";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

const LEVELS: { label: string; color: string }[] = [
  { label: "A1", color: "var(--level-a1)" },
  { label: "A2", color: "var(--level-a2)" },
  { label: "B1", color: "var(--level-b1)" },
  { label: "B2", color: "var(--level-b2)" },
  { label: "C1", color: "var(--level-c1)" },
  { label: "C2", color: "var(--level-c2)" },
];

const FEATURES: { label: string; body: string }[] = [
  {
    label: "library",
    body: "A growing library of classic novels, reworked at every level.",
  },
  {
    label: "video",
    body: "Short videos with synced, tappable subtitles.",
  },
  {
    label: "review",
    body: "Save words as you go, and review them with spaced repetition.",
  },
];

/**
 * The homepage is the desk: full-width sections (the hero and, in ST-103B/C,
 * the level demo, the tap-a-word demo, the phone, the kinds grid) rather than
 * the narrow notebook column the other pages read in. The notebook column
 * below the hero is the interim copy until those sections land.
 */
export default function Home() {
  return (
    <div>
      <JsonLd data={webSiteJsonLd()} />

      <Hero />
      <LevelDemo />
      <WordDemo />
      <PhoneStory />

      <Prose className="mt-10">
        <div className="space-y-5 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
          <p>
            AnyText is an iPhone app for learning a language by reading things
            worth reading. Every day it takes something real and rewrites it at
            six CEFR levels, from complete beginner (A1) to fluent (C2). Tap any
            word to see what it means in your own language.
          </p>
          <p>
            <Link
              href="/story/"
              className="editorial text-[1.35rem] underline decoration-2 decoration-[var(--margin-red)] underline-offset-[6px] transition-colors hover:text-primary"
            >
              Why I made this →
            </Link>
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ label, body }) => (
            <div key={label} className="border-l-2 border-margin-red pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {LEVELS.map(({ label, color }) => (
            <div
              key={label}
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full font-mono text-xs font-semibold"
              style={{ background: color, color: "var(--on-primary)" }}
            >
              {label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          every text, at six levels
        </p>

        <div
          aria-hidden
          className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-sm uppercase tracking-wide text-muted-foreground"
        >
          {LEGAL_LANGUAGES.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <p className="sr-only">
          Available in Turkish, English, French, Italian, Spanish, German and
          Dutch.
        </p>
      </Prose>
    </div>
  );
}
