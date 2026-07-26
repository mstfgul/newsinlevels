import type { Metadata } from "next";
import { getFilm, getFilmIndex } from "@/lib/data";
import { FilmList } from "@/components/FilmList";
import { HomeHero } from "@/components/HomeHero";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { collectionJsonLd, pageMetadata } from "@/lib/seo";

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
      {entries.length > 0 && (
        <JsonLd data={collectionJsonLd("films", entries)} />
      )}
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
        <>
          <HomeHero
            article={getFilm(entries[0].id)}
            href={`/films/${entries[0].id}/`}
          />
          {entries.length > 1 && (
            <section className="mt-10">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                More films
              </h2>
              <FilmList entries={entries.slice(1)} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
