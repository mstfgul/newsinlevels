import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Highlight } from "@/components/PageIntro";
import { Clipping } from "@/components/Clipping";
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

export default function Home() {
  return (
    <div>
      <JsonLd data={webSiteJsonLd()} />

      <PageIntro title="AnyText" size="display">
        real news, art, film, books &amp; history — rewritten{" "}
        <Highlight>at your level</Highlight>, every day
      </PageIntro>

      {/* A clipping of what the app actually delivers each day — art, history,
       * film — taped to the desk. The web is the desk (design-language.md
       * § 1); several tilted clippings together is the intended look here,
       * unlike the app's own one-tilt-per-screen budget on a phone screen. */}
      <div className="mb-10 flex flex-wrap items-start justify-center gap-x-5 gap-y-6 py-3 sm:gap-x-8">
        <Clipping
          src="/story/hokusai-great-wave.webp"
          alt="Hokusai, Under the Wave off Kanagawa (c. 1831)"
          width={800}
          height={538}
          rotate={-2}
          aspect="4/3"
          captionStyle="label"
          caption="art"
          className="w-[8.5rem] sm:w-[12.5rem]"
        />
        <Clipping
          src="/story/proust-portrait.webp"
          alt="Jacques-Émile Blanche, Portrait de Marcel Proust (1892)"
          width={657}
          height={800}
          rotate={1.5}
          aspect="4/3"
          captionStyle="label"
          caption="literature"
          className="w-[8.5rem] sm:w-[12.5rem]"
        />
        <Clipping
          src="/story/great-train-robbery.webp"
          alt="The Great Train Robbery (1903)"
          width={489}
          height={405}
          rotate={-1}
          aspect="4/3"
          captionStyle="label"
          caption="cinema"
          className="w-[8.5rem] sm:w-[12.5rem]"
        />
      </div>

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

      <p
        className="hand-note mt-8 rotate-[-0.4deg] text-center"
        style={{ fontSize: "1.35rem" }}
      >
        Coming soon to the App Store.
      </p>
    </div>
  );
}
