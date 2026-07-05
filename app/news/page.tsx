import type { Metadata } from "next";
import { getArticle, getIndex } from "@/lib/data";
import { HomeView } from "@/components/HomeView";

export const metadata: Metadata = {
  title: "News — Any Text in Levels",
  description:
    "Real news rewritten at CEFR levels A1–C2 in English, German, French and Turkish.",
};

function formatDateline(date: string): string {
  return new Date(`${date}T12:00:00Z`)
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

export default function NewsPage() {
  const entries = getIndex();

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        No articles yet — the daily pipeline will add them soon.
      </p>
    );
  }

  const [lead] = entries;
  const leadArticle = getArticle(lead.id);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {formatDateline(lead.date)}
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {entries.length} {entries.length === 1 ? "story" : "stories"}
        </p>
      </div>

      <HomeView leadArticle={leadArticle} entries={entries} />
    </div>
  );
}
