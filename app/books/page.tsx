import type { Metadata } from "next";
import { getBookIndex } from "@/lib/data";
import { BookList } from "@/components/BookList";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book Club — great books introduced at your level (A1–C2)",
  description:
    "One great book a day — literature and philosophy introduced spoiler-free in simple English, German, French and Spanish at CEFR levels A1–C2, with vocabulary and exercises.",
  path: "/books/",
});

export default function BooksPage() {
  const entries = getBookIndex();

  return (
    <div>
      <PageIntro title="Book Club">
        one great book a day, literature &amp; philosophy introduced{" "}
        <Highlight>at your level</Highlight> — the ideas and the voice, never
        the ending
      </PageIntro>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No books yet — the daily book pipeline will shelve the first cover
          soon.
        </p>
      ) : (
        <BookList entries={entries} />
      )}
    </div>
  );
}
