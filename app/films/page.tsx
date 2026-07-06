import type { Metadata } from "next";
import { getFilmIndex } from "@/lib/data";
import { FilmList } from "@/components/FilmList";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Film Club — Any Text in Levels",
  description:
    "One art-house film a day, discussed spoiler-free at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function FilmsPage() {
  const entries = getFilmIndex();

  return (
    <div>
      <PageIntro title="Film Club">
        one great film a day, discussed spoiler-free{" "}
        <Highlight>at your level</Highlight> — themes and craft, never the
        ending
      </PageIntro>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No films yet — the daily film pipeline will pin the first poster
          soon.
        </p>
      ) : (
        <FilmList entries={entries} />
      )}
    </div>
  );
}
