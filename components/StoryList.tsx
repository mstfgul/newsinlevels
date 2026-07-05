"use client";

import Link from "next/link";
import type { IndexEntry } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { usePreferences } from "./Preferences";

export function StoryList({ entries }: { entries: IndexEntry[] }) {
  const { language } = usePreferences();

  return (
    <div className="ruled">
      {entries.map((entry, i) => (
        <Link
          key={entry.id}
          href={`/article/${entry.id}/`}
          className="group flex items-center gap-4 py-4"
        >
          {entry.image && (
            <span
              className={`clipping-mini block size-14 shrink-0 sm:size-16 ${
                i % 2 === 0 ? "rotate-[1.6deg]" : "rotate-[-1.6deg]"
              }`}
            >
              <img src={entry.image} alt="" loading="lazy" />
            </span>
          )}
          <span className="flex-1">
            <span className="block font-mono text-xs text-muted-foreground">
              {entry.date.slice(5)}
              {entry.category && <> · {entry.category}</>}
            </span>
            <span
              className="block text-lg font-medium leading-snug group-hover:underline group-hover:underline-offset-4"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              {entry.titles[language] ?? entry.titles.en}
            </span>
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
