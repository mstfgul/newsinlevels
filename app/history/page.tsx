import type { Metadata } from "next";
import { getHistoryEvent, getHistoryIndex } from "@/lib/data";
import { HistoryList } from "@/components/HistoryList";
import { HomeHero } from "@/components/HomeHero";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "On This Day — history told at your level (A1–C2)",
  description:
    "What happened on this day in history, told in simple English, German, French and Spanish at CEFR levels A1–C2. Learn a language through history, with vocabulary and exercises.",
  path: "/history/",
});

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
        <>
          <HomeHero
            article={getHistoryEvent(entries[0].id)}
            href={`/history/${entries[0].id}/`}
          />
          {entries.length > 1 && (
            <section className="mt-10">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Earlier days
              </h2>
              <HistoryList entries={entries.slice(1)} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
