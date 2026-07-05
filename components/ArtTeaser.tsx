"use client";

import Link from "next/link";
import type { ArtIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Homepage invitation to the Daily Art section: today's painting as a
 * postcard, for readers who aren't in the mood for news. */
export function ArtTeaser({ entry }: { entry: ArtIndexEntry }) {
  const { language } = usePreferences();

  return (
    <section className="mt-12 rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:p-8">
        <Link
          href={`/art/${entry.id}/`}
          className="clipping mx-auto block w-48 shrink-0 rotate-[-2deg] transition-transform hover:rotate-0 sm:mx-0"
        >
          <img src={entry.image} alt={entry.artist} loading="lazy" />
          <span className="hand-note block px-1 pt-1.5 pb-0.5">
            {entry.artist}
          </span>
        </Link>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Daily art · today&apos;s painting
          </p>
          <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight">
            {entry.titles[language] ?? entry.titles.en}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Not in the mood for news? Every day we hang one painting from the
            museum and read it at your level, in your language.
          </p>
          <Link
            href={`/art/${entry.id}/`}
            className="mt-4 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            Open today&apos;s painting →
          </Link>
        </div>
      </div>
    </section>
  );
}
