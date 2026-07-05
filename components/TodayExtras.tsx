"use client";

import Link from "next/link";
import type { HistoryIndexEntry, StoryIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Compact homepage cards for the story serial and the on-this-day capsule. */
export function TodayExtras({
  story,
  history,
}: {
  story?: StoryIndexEntry;
  history?: HistoryIndexEntry;
}) {
  const { language } = usePreferences();
  if (!story && !history) return null;

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {story && (
        <Link
          href={`/stories/${story.id}/`}
          className="group rounded-lg border border-border bg-card p-6"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Story of the week · Part {story.part}/{story.totalParts}
          </p>
          <h2 className="mt-2 text-lg font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
            {story.titles[language] ?? story.titles.en}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {story.story} — {story.author}
          </p>
          <p className="mt-3 text-sm font-semibold">Continue the story →</p>
        </Link>
      )}

      {history && (
        <Link
          href={`/history/${history.id}/`}
          className="group rounded-lg border border-border bg-card p-6"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            On this day · {history.year}
          </p>
          <h2 className="mt-2 text-lg font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
            {history.titles[language] ?? history.titles.en}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One thing that really happened on this date.
          </p>
          <p className="mt-3 text-sm font-semibold">Read what happened →</p>
        </Link>
      )}
    </div>
  );
}
