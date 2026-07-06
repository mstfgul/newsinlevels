import type { Metadata } from "next";
import { getQuoteIndex } from "@/lib/data";
import { QuotesList } from "@/components/QuotesList";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Quotes — Any Text in Levels",
  description:
    "A line from a great author or poet each day, translated and explained at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function QuotesPage() {
  const entries = getQuoteIndex();

  return (
    <div>
      <PageIntro title="Quotes">
        a line worth keeping, from a great author or poet — translated and
        explained <Highlight>at your level</Highlight>
      </PageIntro>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No quotes yet — the first one arrives with the next daily run.
        </p>
      ) : (
        <QuotesList entries={entries} />
      )}
    </div>
  );
}
