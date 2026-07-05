"use client";

import Link from "next/link";
import type { IndexEntry } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { usePreferences } from "./Preferences";

export function StoryList({ entries }: { entries: IndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="ruled">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/article/${entry.id}/`}
          className="group flex items-baseline gap-4 py-4"
        >
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {entry.date.slice(5)}
          </span>
          <span
            className="flex-1 text-lg font-medium leading-snug group-hover:underline group-hover:underline-offset-4"
            style={{ fontFamily: "var(--font-literata)" }}
          >
            {entry.titles[language]}
          </span>
          <span aria-hidden className="hidden shrink-0 gap-1 sm:flex">
            {LEVELS.map((level) => (
              <span
                key={level}
                className="size-1.5 rounded-full"
                style={{
                  backgroundColor: `var(--level-${level.toLowerCase()})`,
                }}
              />
            ))}
          </span>
        </Link>
      ))}
    </div>
  );
}
