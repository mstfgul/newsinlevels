"use client";

import Link from "next/link";
import type {
  ArtIndexEntry,
  BookIndexEntry,
  FilmIndexEntry,
  HistoryIndexEntry,
  IndexEntry,
  Language,
  QuoteIndexEntry,
} from "@/lib/types";
import { usePreferences } from "./Preferences";

// Gentle, alternating tilts so the cards look stuck on by hand — small enough
// to stay tidy in the grid rather than scattered.
const TILTS = [-2, 1.5, -1.5, 2, -1, 1];

/** One section card: where it links, its title, image and a small credit
 * (source, artist, author, year). */
interface Item {
  key: string;
  label: string;
  href: string;
  title: string;
  image?: string;
  sub?: string;
}

/** A taped clipping for one section's freshest page. */
function SectionCard({
  item,
  tilt,
  lang,
}: {
  item: Item;
  tilt: number;
  lang: Language;
}) {
  return (
    <Link
      href={item.href}
      lang={lang}
      style={{ rotate: `${tilt}deg` }}
      className="clipping group block transition-transform duration-200 hover:-translate-y-1"
    >
      {/* A filing tab over the top edge naming the section, so each card reads
          at a glance whatever language the titles are in. Centred to clear the
          two corner tapes. */}
      <span
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-1 whitespace-nowrap rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest shadow-sm"
        style={{ background: "var(--postit)", color: "var(--postit-ink)" }}
      >
        {item.label}
      </span>
      {item.image && (
        <span className="clipping-fill block aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </span>
      )}
      <span className="block px-1.5 pt-2">
        {item.sub && (
          <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {item.sub}
          </span>
        )}
        <span className="hand-note mt-0.5 block leading-tight line-clamp-2">
          {item.title}
        </span>
      </span>
    </Link>
  );
}

/**
 * The homepage as today's edition: a grid of taped section cards, each the
 * freshest page in its section. Daily Art leads, News closes; the section tab
 * names each so it reads at a glance in any of the four languages.
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

  const items: Item[] = [
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
  ].filter(Boolean) as Item[];

  if (items.length === 0) return null;

  return (
    <section aria-label="Today's edition">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-margin-red/70 pb-2">
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

      <ol className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.key} className="index-row">
            <SectionCard item={item} tilt={TILTS[i % TILTS.length]} lang={language} />
          </li>
        ))}
      </ol>
    </section>
  );
}
