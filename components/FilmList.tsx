"use client";

import Link from "next/link";
import type { FilmIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Cinema posters taped into the notebook, one per week. */
export function FilmList({ entries }: { entries: FilmIndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      {entries.map((entry, i) => (
        <Link key={entry.id} href={`/films/${entry.id}/`} className="group">
          <figure
            className={`clipping ${
              i % 2 === 0 ? "rotate-[1.2deg]" : "rotate-[-1.2deg]"
            } transition-transform group-hover:rotate-0`}
          >
            <img src={entry.image} alt={entry.director} loading="lazy" />
            <figcaption className="hand-note px-1 pt-1.5 pb-0.5">
              {entry.director}
            </figcaption>
          </figure>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {entry.date.slice(5)}
            </span>
            <span
              className="text-lg font-medium leading-snug group-hover:underline group-hover:underline-offset-4"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              {entry.titles[language] ?? entry.titles.en}
            </span>
          </p>
        </Link>
      ))}
    </div>
  );
}
