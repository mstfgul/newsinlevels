import type { Metadata } from "next";
import { PageIntro, Highlight } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, webSiteJsonLd } from "@/lib/seo";

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

export default function Home() {
  return (
    <div>
      <JsonLd data={webSiteJsonLd()} />

      <PageIntro title="AnyText">
        real news, art, film, books &amp; history — rewritten{" "}
        <Highlight>at your level</Highlight>, every day
      </PageIntro>

      <div className="space-y-6 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        <p>
          AnyText is an iPhone app for learning a language by reading things
          worth reading. Every day it takes real material — a news story, a
          painting, a film, a book, a quote, a moment from history — and
          rewrites it at six CEFR levels, from complete beginner (A1) to
          fluent (C2). Tap any word to see what it means in your own
          language.
        </p>
        <p>
          Alongside the daily pages: a growing library of classic novels
          reworked at every level, and a feed of short videos with synced,
          tappable subtitles. Save words as you go and review them with
          spaced repetition.
        </p>
        <p>
          Available in Turkish, English, French, Italian, Spanish, German
          and Dutch.
        </p>
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

      <p
        className="hand-note mt-8 rotate-[-0.4deg] text-center"
        style={{ fontSize: "1.35rem" }}
      >
        Coming soon to the App Store.
      </p>
    </div>
  );
}
