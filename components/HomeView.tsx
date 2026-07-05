"use client";

import { useState } from "react";
import type { Article, IndexEntry } from "@/lib/types";
import { HomeHero } from "./HomeHero";
import { StoryList } from "./StoryList";

/** Homepage below the dateline: category chips, lead story, earlier stories.
 * With a category selected the hero steps aside and all matching stories are
 * listed. */
export function HomeView({
  leadArticle,
  entries,
}: {
  leadArticle: Article;
  entries: IndexEntry[];
}) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    ...new Set(entries.map((e) => e.category).filter(Boolean)),
  ] as string[];

  const filtered = category
    ? entries.filter((e) => e.category === category)
    : entries.slice(1);

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-1 font-mono text-xs uppercase tracking-wide">
          {[null, ...categories].map((option) => (
            <button
              key={option ?? "all"}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
              className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                category === option
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                category === option
                  ? { background: "var(--hl-strong)" }
                  : undefined
              }
            >
              {option ?? "all"}
            </button>
          ))}
        </div>
      )}

      {category === null && <HomeHero article={leadArticle} />}

      {filtered.length > 0 && (
        <section className={category === null ? "mt-10" : undefined}>
          {category === null && (
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Earlier stories
            </h2>
          )}
          <StoryList entries={filtered} />
        </section>
      )}

      {category !== null && filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No stories in this category yet.
        </p>
      )}
    </div>
  );
}
