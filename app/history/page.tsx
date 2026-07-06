import type { Metadata } from "next";
import { getHistoryIndex } from "@/lib/data";
import { HistoryList } from "@/components/HistoryList";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "On This Day — Any Text in Levels",
  description:
    "One historical event a day, told at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function HistoryPage() {
  const entries = getHistoryIndex();

  return (
    <div>
      <PageIntro title="On This Day">
        one thing that really happened on this date — told{" "}
        <Highlight>at your level</Highlight>, in your language
      </PageIntro>

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
