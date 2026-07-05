"use client";

import Link from "next/link";
import type { HistoryIndexEntry, QuoteIndexEntry } from "@/lib/types";
import { usePreferences } from "./Preferences";

/** Homepage cards for today's quote and the on-this-day capsule. */
export function TodayExtras({
  quote,
  history,
}: {
  quote?: QuoteIndexEntry;
  history?: HistoryIndexEntry;
}) {
  const { language } = usePreferences();
  if (!quote && !history) return null;

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {quote && (
        <Link
          href={`/quotes/${quote.id}/`}
          className="group flex flex-col rounded-lg border border-border bg-card p-6"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Quote of the day
          </p>
          <p
            className="mt-3 flex-1 text-lg italic leading-snug group-hover:underline group-hover:underline-offset-4"
            style={{ fontFamily: "var(--font-literata)" }}
          >
            &ldquo;{quote.titles[language] ?? quote.titles.en}&rdquo;
          </p>
          <p
            className="mt-3 text-right"
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "1.25rem",
              color: "var(--muted-foreground)",
            }}
          >
            — {quote.author}
          </p>
        </Link>
      )}

      {history && (
        <Link
          href={`/history/${history.id}/`}
          className="group flex flex-col rounded-lg border border-border bg-card p-6"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            On this day · {history.year}
          </p>
          <h2 className="mt-3 flex-1 text-lg font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
            {history.titles[language] ?? history.titles.en}
          </h2>
          <p className="mt-3 text-sm font-semibold">Read what happened →</p>
        </Link>
      )}
    </div>
  );
}
