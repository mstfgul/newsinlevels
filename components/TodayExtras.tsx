"use client";

import Link from "next/link";
import type { HistoryIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Homepage card for today's on-this-day capsule. */
export function TodayExtras({ history }: { history?: HistoryIndexEntry }) {
  const { language } = usePreferences();
  if (!history) return null;

  return (
    <Link
      href={`/history/${history.id}/`}
      className="group mt-6 flex flex-col gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:p-8"
    >
      {history.image && (
        <span className="clipping-mini block h-28 w-40 shrink-0 rotate-[-1.5deg]">
          <img src={history.image} alt="" loading="lazy" />
        </span>
      )}
      <span>
        <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          On this day · {history.year}
        </span>
        <span className="mt-2 block text-lg font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
          {history.titles[language] ?? history.titles.en}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          One thing that really happened on this date — read at your level.
        </span>
        <span className="mt-3 block text-sm font-semibold">
          Read what happened →
        </span>
      </span>
    </Link>
  );
}
