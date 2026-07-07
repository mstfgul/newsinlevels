import type { Metadata } from "next";
import { getQuote, getQuoteIndex } from "@/lib/data";
import { QuotesList } from "@/components/QuotesList";
import { HomeHero } from "@/components/HomeHero";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Quotes — Any Text in Levels",
  description:
    "A line from a great author or poet each day, translated and explained at CEFR levels A1–C2 in English, German, French and Spanish.",
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
        <>
          <HomeHero
            article={getQuote(entries[0].id)}
            href={`/quotes/${entries[0].id}/`}
          />
          {entries.length > 1 && (
            <section className="mt-10">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Earlier quotes
              </h2>
              <QuotesList entries={entries.slice(1)} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
