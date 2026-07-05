import type { Metadata } from "next";
import { getQuoteIndex } from "@/lib/data";
import { QuotesList } from "@/components/QuotesList";

export const metadata: Metadata = {
  title: "Quotes — Any Text in Levels",
  description:
    "A line from a great author or poet each day, translated and explained at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function QuotesPage() {
  const entries = getQuoteIndex();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Quotes</h1>
        <p className="mt-1 text-muted-foreground">
          A line worth keeping, from a great author or poet — translated into
          your language and explained at your level.
        </p>
      </div>

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
