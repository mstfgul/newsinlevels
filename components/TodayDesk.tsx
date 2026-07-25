"use client";

import Link from "next/link";
import type {
  ArtIndexEntry,
  BookIndexEntry,
  FilmIndexEntry,
  HistoryIndexEntry,
  IndexEntry,
  QuoteIndexEntry,
} from "@/lib/types";
import { usePreferences } from "./Preferences";

/** One line of today's contents: which section, where it goes, and the day's
 * freshest entry in it. `sub` is the small credit under a title (source,
 * artist, author, year). */
interface Row {
  key: string;
  label: string;
  href: string;
  title: string;
  image?: string;
  sub?: string;
}

/**
 * The homepage as the contents page of today's notebook: the day's lead story
 * pasted in on the left like a photo, and a ruled, red-margin index of every
 * section on the right — each pointing at that section's freshest page. A
 * table of contents has a real order and a real job, which is exactly what the
 * old scattered desk lacked.
 */
export function TodayDesk({
  news,
  art,
  film,
  book,
  quote,
  history,
  dateline,
}: {
  news: IndexEntry[];
  art: ArtIndexEntry[];
  film: FilmIndexEntry[];
  book: BookIndexEntry[];
  quote: QuoteIndexEntry[];
  history: HistoryIndexEntry[];
  dateline?: string;
}) {
  const { language } = usePreferences();
  const t = (titles: Partial<Record<string, string>> & { en: string }) =>
    titles[language] ?? titles.en;

  // Contents order: today's painting leads, news closes the list.
  const rows: Row[] = [
    art[0] && {
      key: "art",
      label: "Daily Art",
      href: `/art/${art[0].id}/`,
      title: t(art[0].titles),
      image: art[0].image,
      sub: art[0].artist,
    },
    film[0] && {
      key: "film",
      label: "Film Club",
      href: `/films/${film[0].id}/`,
      title: t(film[0].titles),
      image: film[0].image,
      sub: film[0].director,
    },
    book[0] && {
      key: "book",
      label: "Book Club",
      href: `/books/${book[0].id}/`,
      title: t(book[0].titles),
      image: book[0].image,
      sub: book[0].author,
    },
    history[0] && {
      key: "history",
      label: "On This Day",
      href: `/history/${history[0].id}/`,
      title: t(history[0].titles),
      image: history[0].image,
      sub: String(history[0].year),
    },
    quote[0] && {
      key: "quote",
      label: "Quotes",
      href: `/quotes/${quote[0].id}/`,
      title: t(quote[0].titles),
      image: quote[0].image,
      sub: quote[0].author,
    },
    news[0] && {
      key: "news",
      label: "News",
      href: `/article/${news[0].id}/`,
      title: t(news[0].titles),
      image: news[0].image,
      sub: news[0].source,
    },
  ].filter(Boolean) as Row[];

  // Left: a small wall of today's posters — the film, the book and the day's
  // painting, pinned overlapping. Right: the full contents index, every
  // section listed (posters and all). The two read as "the covers" and "the
  // table of contents" of the same daily edition.
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const posters = ["film", "book", "art"]
    .map((k) => byKey.get(k))
    .filter((p): p is Row => Boolean(p && p.image));

  if (rows.length === 0) return null;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,44%)_1fr] lg:gap-12">
      {/* Left: today's posters, pinned overlapping like a corkboard. The whole
          cluster settles in on load and then keeps a slow idle sway. */}
      {posters.length > 0 && (
        <div className="lead-card lead-photo flex items-start justify-center lg:justify-start">
          {posters.map((poster, i) => (
            <Link
              key={poster.key}
              href={poster.href}
              aria-label={`${poster.label}: ${poster.title}`}
              className="clipping-mini group relative block w-[38%] shrink-0 transition-shadow hover:shadow-xl"
              style={
                {
                  transform: `rotate(${[-5, 3, -2][i] ?? 0}deg)`,
                  marginLeft: i > 0 ? "-8%" : undefined,
                  zIndex: posters.length - i,
                } as React.CSSProperties
              }
            >
              <div className="clipping-fill aspect-[2/3] overflow-hidden">
                <img
                  src={poster.image}
                  alt={poster.sub ?? poster.label}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Right: the ruled contents index, red margin like the reader. */}
      <section aria-label="Today's contents">
        <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-margin-red/70 pb-2">
          <span
            className="hand-note rotate-[-1deg] text-foreground"
            style={{ fontSize: "1.5rem" }}
          >
            today&rsquo;s edition
          </span>
          {dateline && (
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {dateline}
            </span>
          )}
        </div>

        <ol className="border-l-2 border-margin-red pl-4 sm:pl-5">
          {rows.map((row) => (
            <li
              key={row.key}
              className="index-row border-b border-rule-blue last:border-b-0"
            >
              <Link
                href={row.href}
                lang={language}
                className="group flex items-center gap-4 py-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {row.label}
                    {row.sub && <span className="normal-case"> · {row.sub}</span>}
                  </span>
                  <span
                    className="mt-0.5 block truncate text-lg font-semibold leading-snug group-hover:underline group-hover:underline-offset-4"
                    style={{ fontFamily: "var(--font-literata)" }}
                  >
                    {row.title}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-margin-red transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
