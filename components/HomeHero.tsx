"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";
import { usePreferences } from "./Preferences";
import { LevelLadder } from "./LevelLadder";
import { LEVEL_DESCRIPTIONS } from "@/lib/levels";

function firstSentences(text: string, count: number): string {
  const sentences = text.split(/(?<=[.!?»])\s+/);
  return sentences.slice(0, count).join(" ");
}

export function HomeHero({ article }: { article: Article }) {
  const { language, level, setLevel } = usePreferences();
  const version = article.languages[language][level];

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-l-2 border-margin-red p-6 pl-7 sm:p-8 sm:pl-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Today&apos;s lead · pick your level
        </p>
        <LevelLadder level={level} onSelect={setLevel} />

        <div key={`${language}-${level}`} className="level-swap mt-6">
          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-[2rem]">
            {version.title}
          </h2>
          <p
            className="mt-3 text-lg leading-relaxed text-muted-foreground"
            style={{ fontFamily: "var(--font-literata)" }}
          >
            {firstSentences(version.text, 2)}
          </p>
        </div>

        <Link
          href={`/article/${article.id}/`}
          className="mt-5 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          Read at {level} · {LEVEL_DESCRIPTIONS[level]} →
        </Link>
      </div>
    </section>
  );
}
