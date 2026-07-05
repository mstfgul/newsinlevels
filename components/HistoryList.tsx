"use client";

import Link from "next/link";
import type { HistoryIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** One historical event per day, newest first. */
export function HistoryList({ entries }: { entries: HistoryIndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="ruled">
      {entries.map((entry, i) => (
        <Link
          key={entry.id}
          href={`/history/${entry.id}/`}
          className="group flex items-center gap-4 py-4"
        >
          {entry.image ? (
            <span
              className={`clipping-mini block size-14 shrink-0 sm:size-16 ${
                i % 2 === 0 ? "rotate-[1.6deg]" : "rotate-[-1.6deg]"
              }`}
            >
              <img src={entry.image} alt="" loading="lazy" />
            </span>
          ) : (
            <span
              className="grid size-14 shrink-0 place-items-center rounded-sm border border-border bg-muted font-mono text-xs text-muted-foreground sm:size-16"
              aria-hidden
            >
              {entry.year}
            </span>
          )}
          <span className="flex-1">
            <span className="block font-mono text-xs text-muted-foreground">
              {entry.date.slice(5)} · {entry.year}
            </span>
            <span
              className="block text-lg font-medium leading-snug group-hover:underline group-hover:underline-offset-4"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              {entry.titles[language] ?? entry.titles.en}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
