"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  ArtIndexEntry,
  BookIndexEntry,
  FilmIndexEntry,
  HistoryIndexEntry,
  IndexEntry,
  QuoteIndexEntry,
} from "@/lib/types";
import { usePreferences } from "./Preferences";

/** A strip of highlighter tape naming the section, stuck over the top edge. */
function DeskLabel({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="absolute -top-2.5 left-4 z-[5] inline-block rotate-[-1.5deg] rounded-sm px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest shadow-sm transition-transform hover:rotate-0"
      style={{ background: "var(--postit)", color: "var(--postit-ink)" }}
    >
      {children}
    </Link>
  );
}

/** The two resting places of a pile: on top, and peeking out from under. */
const SLOTS = [
  "relative z-[2] rotate-[-1deg]",
  "absolute left-0 top-0 z-[1] w-full translate-x-3 translate-y-10 rotate-[4deg] lg:translate-x-7",
];

interface PileItem {
  id: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  content: React.ReactNode;
}

/**
 * Two days of one section lying on the desk, the older card peeking out from
 * under the newer one. Clicking the card behind slides it to the top (the
 * swap animates); clicking the card on top opens it.
 */
function Pile({ items }: { items: PileItem[] }) {
  const [frontId, setFrontId] = useState(items[0]?.id);

  return (
    <>
      {items.map((item) => {
        const isFront = item.id === frontId;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={(event) => {
              if (!isFront) {
                event.preventDefault();
                setFrontId(item.id);
              }
            }}
            className={`group block transition-transform duration-200 ${
              SLOTS[isFront ? 0 : 1]
            } ${isFront ? "hover:rotate-0" : ""} ${item.className ?? ""}`}
            style={item.style}
          >
            {item.content}
          </Link>
        );
      })}
    </>
  );
}

/**
 * The homepage as one desk seen from above: five little piles — news
 * clippings, cinema posters, museum postcards, quote cards and index cards —
 * two days deep each. Click the peeking card to bring yesterday on top;
 * the taped label opens the section.
 *
 * On large screens the piles are hand-placed on a fixed board so the whole
 * desk fits in one view; below that they stack, keeping their tilt.
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

  return (
    <div className="relative mx-auto flex max-w-md flex-col gap-14 lg:block lg:h-[37rem] lg:w-full lg:max-w-none">
      {/* Lead stories, torn off the last two front pages. */}
      {news.length > 0 && (
        <div className="relative lg:absolute lg:left-0 lg:top-0 lg:w-[34%]">
          <DeskLabel href="/news/">news</DeskLabel>
          <Pile
            items={news.map((entry) => ({
              id: entry.id,
              href: `/article/${entry.id}/`,
              className:
                "rounded-lg border border-border bg-card p-4 shadow-sm lg:p-5",
              content: (
                <>
                  <h2 className="line-clamp-2 pt-1 text-lg font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4 lg:line-clamp-3 lg:text-xl">
                    {entry.titles[language] ?? entry.titles.en}
                  </h2>
                  {entry.image && (
                    <figure className="clipping-mini mt-2.5 aspect-[21/9] w-full overflow-hidden lg:mt-4 lg:aspect-[16/9]">
                      <img src={entry.image} alt="" loading="eager" />
                    </figure>
                  )}
                  <p className="hand-note mt-2 px-0.5">
                    {entry.source} · read the story →
                  </p>
                </>
              ),
            }))}
          />
        </div>
      )}

      {/* On phones the posters and postcards share one row of the desk,
          staggered like they were dropped there; on lg the wrapper dissolves
          (display: contents) and each pile takes its hand-placed spot. */}
      <div className="flex items-start justify-between gap-4 lg:contents">
        {/* The film posters, one pinned over the other like at the cinema door. */}
        {film.length > 0 && (
          <div className="relative z-10 mt-6 w-[36%] lg:absolute lg:left-[38%] lg:top-0 lg:mt-0 lg:w-[19%]">
            <DeskLabel href="/films/">film club</DeskLabel>
            <Pile
              items={film.map((entry) => ({
                id: entry.id,
                href: `/films/${entry.id}/`,
                content: (
                  <figure className="clipping">
                    <div className="clipping-fill aspect-[2/3] overflow-hidden">
                      <img
                        src={entry.image}
                        alt={entry.director}
                        loading="eager"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="hand-note truncate px-1 pt-1.5 pb-0.5">
                      {entry.titles[language] ?? entry.titles.en} —{" "}
                      {entry.director}
                    </figcaption>
                  </figure>
                ),
              }))}
            />
          </div>
        )}

        {/* Museum postcards from the last two days. */}
        {art.length > 0 && (
          <div className="relative w-[54%] lg:absolute lg:right-0 lg:top-[4%] lg:w-[27%]">
            <DeskLabel href="/art/">daily art</DeskLabel>
            <Pile
              items={art.map((entry) => ({
                id: entry.id,
                href: `/art/${entry.id}/`,
                content: (
                  <figure className="clipping">
                    <div className="clipping-fill aspect-[4/5] overflow-hidden">
                      <img
                        src={entry.image}
                        alt={entry.artist}
                        loading="eager"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="hand-note truncate px-1 pt-1.5 pb-0.5">
                      {entry.titles[language] ?? entry.titles.en} — {entry.artist}
                    </figcaption>
                  </figure>
                ),
              }))}
            />
          </div>
        )}
      </div>

      {/* Book covers from the reading pile, between the posters and postcards. */}
      {book.length > 0 && (
        <div className="relative z-10 w-[44%] self-start lg:absolute lg:left-[58%] lg:top-[2%] lg:w-[12%]">
          <DeskLabel href="/books/">book club</DeskLabel>
          <Pile
            items={book.map((entry) => ({
              id: entry.id,
              href: `/books/${entry.id}/`,
              content: (
                <figure className="clipping">
                  <div className="clipping-fill aspect-[2/3] overflow-hidden">
                    <img
                      src={entry.image}
                      alt={entry.author}
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="hand-note truncate px-1 pt-1.5 pb-0.5">
                    {entry.titles[language] ?? entry.titles.en} —{" "}
                    {entry.author}
                  </figcaption>
                </figure>
              ),
            }))}
          />
        </div>
      )}

      {/* On-this-day facts on ruled index cards. */}
      {history.length > 0 && (
        <div className="relative w-[88%] lg:absolute lg:bottom-0 lg:left-[2%] lg:w-[28%]">
          <DeskLabel href="/history/">on this day</DeskLabel>
          <Pile
            items={history.map((entry) => ({
              id: entry.id,
              href: `/history/${entry.id}/`,
              className: "border border-border shadow-sm",
              style: { background: "var(--print-paper)" },
              content: (
                <div className="p-4 pt-5 lg:p-5 lg:pt-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-margin-red">
                    {entry.year}
                  </p>
                  <div className="mt-1.5 flex items-start gap-4 border-t-2 border-margin-red/70 pt-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-[#212e3e] group-hover:underline group-hover:underline-offset-4">
                        {entry.titles[language] ?? entry.titles.en}
                      </h2>
                      <p
                        className="hand-note mt-2"
                        style={{ color: "#5c6b7a" }}
                      >
                        what happened? →
                      </p>
                    </div>
                    {entry.image && (
                      <figure className="clipping-mini w-20 shrink-0 rotate-[2deg]">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={entry.image}
                            alt=""
                            loading="eager"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </figure>
                    )}
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      )}

      {/* Quote cards: the author's portrait pasted beside their words. */}
      {quote.length > 0 && (
        <div className="relative z-20 w-full max-w-sm self-end lg:absolute lg:bottom-[3%] lg:left-[33%] lg:w-[24%] lg:max-w-none">
          <DeskLabel href="/quotes/">quote of the day</DeskLabel>
          <Pile
            items={quote.map((entry) => ({
              id: entry.id,
              href: `/quotes/${entry.id}/`,
              className:
                "rounded-lg border border-border bg-card p-4 shadow-sm lg:p-5",
              content: (
                <div className="flex items-start gap-3 pt-1">
                  {entry.image && (
                    <figure className="clipping-mini w-16 shrink-0 rotate-[-2deg] lg:w-14">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={entry.image}
                          alt={entry.author}
                          loading="eager"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </figure>
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className="line-clamp-3 text-base italic leading-snug lg:text-lg"
                      style={{ fontFamily: "var(--font-literata)" }}
                    >
                      &ldquo;{entry.titles[language] ?? entry.titles.en}&rdquo;
                    </p>
                    <p
                      className="mt-1.5 text-right"
                      style={{
                        fontFamily: "var(--font-caveat)",
                        fontSize: "1.2rem",
                      }}
                    >
                      — {entry.author}
                    </p>
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      )}

      {/* The date, jotted in the corner of the page. */}
      {dateline && (
        <p
          className="hand-note pr-1 text-right lg:absolute lg:bottom-0 lg:right-[1%] lg:pr-0"
          style={{ fontSize: "1.3rem" }}
        >
          {dateline}
        </p>
      )}
    </div>
  );
}
