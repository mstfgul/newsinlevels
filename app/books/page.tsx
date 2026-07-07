import type { Metadata } from "next";
import { getBookIndex } from "@/lib/data";
import { BookList } from "@/components/BookList";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Book Club — Any Text in Levels",
  description:
    "One great book a day — literature and philosophy introduced spoiler-free at CEFR levels A1–C2 in English, German, French and Spanish.",
};

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
