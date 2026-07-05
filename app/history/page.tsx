import type { Metadata } from "next";
import { getHistoryIndex } from "@/lib/data";
import { HistoryList } from "@/components/HistoryList";

export const metadata: Metadata = {
  title: "On This Day — News in Levels",
  description:
    "One historical event a day, told at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function HistoryPage() {
  const entries = getHistoryIndex();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">On This Day</h1>
        <p className="mt-1 text-muted-foreground">
          Every day, one thing that really happened on this date — told at
          your level, in your language.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No events yet — the first capsule arrives with the next daily run.
        </p>
      ) : (
        <HistoryList entries={entries} />
      )}
    </div>
  );
}
