"use client";

import Link from "next/link";
import type { QuoteIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Quotes of the day: author portrait + the line, newest first. */
export function QuotesList({ entries }: { entries: QuoteIndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="ruled">
      {entries.map((entry, i) => (
        <Link
          key={entry.id}
          href={`/quotes/${entry.id}/`}
          className="group flex items-center gap-4 py-4"
        >
          {entry.image && (
            <span
              className={`clipping-mini block size-14 shrink-0 sm:size-16 ${
                i % 2 === 0 ? "rotate-[1.6deg]" : "rotate-[-1.6deg]"
              }`}
            >
              <img src={entry.image} alt={entry.author} loading="lazy" />
            </span>
          )}
          <span className="flex-1">
            <span className="block font-mono text-xs text-muted-foreground">
              {entry.date.slice(5)} · {entry.author}
            </span>
            <span
              className="block text-lg font-medium italic leading-snug group-hover:underline group-hover:underline-offset-4"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              &ldquo;{entry.titles[language] ?? entry.titles.en}&rdquo;
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
