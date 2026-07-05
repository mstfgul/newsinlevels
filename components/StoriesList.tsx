"use client";

import Link from "next/link";
import type { StoryIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Serialized classics: newest part first, like bookmarks in the notebook. */
export function StoriesList({ entries }: { entries: StoryIndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="ruled">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/stories/${entry.id}/`}
          className="group flex items-center gap-4 py-4"
        >
          <span
            className="grid size-14 shrink-0 place-items-center rounded-sm border border-border bg-muted font-mono text-xs text-muted-foreground sm:size-16"
            aria-hidden
          >
            {entry.part}/{entry.totalParts}
          </span>
          <span className="flex-1">
            <span className="block font-mono text-xs text-muted-foreground">
              {entry.story} · {entry.author}
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
