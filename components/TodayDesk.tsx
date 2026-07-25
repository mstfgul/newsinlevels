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

// Gentle, alternating tilts so the notes look stuck on by hand — small enough
// to stay tidy in the grid rather than scattered.
const TILTS = [-2, 1.5, -1.5, 2, -1, 1];

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

  if (rows.length === 0) return null;

  return (
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

      <ol className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3">
        {rows.map((row, i) => (
          <li key={row.key} className="index-row">
            <Link
              href={row.href}
              lang={language}
              style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
              className="clipping group block transition-transform duration-200 hover:-translate-y-1"
            >
              {row.image && (
                <span className="clipping-fill block aspect-[4/3] overflow-hidden">
                  <img
                    src={row.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </span>
              )}
              <span className="block px-1 pt-1.5">
                <span className="block truncate font-mono text-[9px] uppercase tracking-widest text-margin-red">
                  {row.label}
                  {row.sub && ` · ${row.sub}`}
                </span>
                <span className="hand-note mt-0.5 block leading-tight line-clamp-2">
                  {row.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
