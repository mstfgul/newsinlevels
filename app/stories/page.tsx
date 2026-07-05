import type { Metadata } from "next";
import { getStoryIndex } from "@/lib/data";
import { StoriesList } from "@/components/StoriesList";

export const metadata: Metadata = {
  title: "Stories — News in Levels",
  description:
    "Classic public-domain stories retold as a daily serial at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function StoriesPage() {
  const entries = getStoryIndex();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Stories</h1>
        <p className="mt-1 text-muted-foreground">
          A classic tale retold as a serial — one part a day, at your level,
          in your language.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No story parts yet — the first chapter arrives with the next daily
          run.
        </p>
      ) : (
        <StoriesList entries={entries} />
      )}
    </div>
  );
}
