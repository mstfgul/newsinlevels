import type { Metadata } from "next";
import { getFilmIndex } from "@/lib/data";
import { FilmList } from "@/components/FilmList";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Film Club — great cinema explained at your level (A1–C2)",
  description:
    "One great film a day, discussed spoiler-free in simple English, German, French and Spanish at CEFR levels A1–C2. Learn a language through cinema, with vocabulary and exercises.",
  path: "/films/",
});

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
