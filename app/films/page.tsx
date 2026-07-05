import type { Metadata } from "next";
import { getFilmIndex } from "@/lib/data";
import { FilmList } from "@/components/FilmList";

export const metadata: Metadata = {
  title: "Film Club — Any Text in Levels",
  description:
    "One art-house film a week, discussed spoiler-free at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function FilmsPage() {
  const entries = getFilmIndex();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Film Club</h1>
        <p className="mt-1 text-muted-foreground">
          One great film a week, discussed spoiler-free at your level — themes
          and craft, never the ending. Posters and film data from TMDB.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No films yet — the weekly film pipeline will pin the first poster
          soon.
        </p>
      ) : (
        <FilmList entries={entries} />
      )}
    </div>
  );
}
