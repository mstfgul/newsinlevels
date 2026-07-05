"use client";

import Link from "next/link";
import type {
  ArtIndexEntry,
  FilmIndexEntry,
  HistoryIndexEntry,
  IndexEntry,
  QuoteIndexEntry,
} from "@/lib/types";
import { usePreferences } from "./Preferences";

/** A strip of highlighter tape naming the section, stuck over the top edge. */
function DeskLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="absolute -top-2.5 left-4 z-10 inline-block rotate-[-1.5deg] rounded-sm px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest shadow-sm"
      style={{ background: "var(--postit)", color: "var(--postit-ink)" }}
    >
      {children}
    </span>
  );
}

/**
 * The homepage as one desk seen from above: today's five artifacts — news
 * clipping, cinema poster, museum postcard, post-it and index card — pieced
 * together like a puzzle. Each one is the door into its section.
 *
 * On large screens the artifacts are hand-placed on a fixed board so the
 * whole desk fits in one view; below that they stack, keeping their tilt.
 */
export function TodayDesk({
  news,
  art,
  film,
  quote,
  history,
  dateline,
}: {
  news?: IndexEntry;
  art?: ArtIndexEntry;
  film?: FilmIndexEntry;
  quote?: QuoteIndexEntry;
  history?: HistoryIndexEntry;
  dateline?: string;
}) {
  const { language } = usePreferences();

  return (
    <div className="relative mx-auto flex max-w-md flex-col gap-9 lg:block lg:h-[34rem] lg:w-full lg:max-w-none">
      {/* The lead story, torn off the front page. */}
      {news && (
        <Link
          href="/news/"
          className="group relative block rotate-[-1deg] rounded-lg border border-border bg-card p-5 shadow-sm transition-transform hover:z-30 hover:rotate-0 lg:absolute lg:left-0 lg:top-0 lg:w-[35%]"
        >
          <DeskLabel>news</DeskLabel>
          <h2 className="line-clamp-3 pt-1 text-xl font-bold leading-tight tracking-tight group-hover:underline group-hover:underline-offset-4">
            {news.titles[language] ?? news.titles.en}
          </h2>
          {news.image && (
            <figure className="clipping-mini mt-4 aspect-[16/9] w-full overflow-hidden">
              <img src={news.image} alt="" loading="eager" />
            </figure>
          )}
          <p className="hand-note mt-2 px-0.5">
            {news.source} · today&apos;s stories →
          </p>
        </Link>
      )}

      {/* Today's film poster. */}
      {film && (
        <Link
          href="/films/"
          className="group relative z-10 block self-center rotate-[1.8deg] transition-transform hover:z-30 hover:rotate-0 lg:absolute lg:left-[38%] lg:top-0 lg:w-[20%]"
        >
          <DeskLabel>film club</DeskLabel>
          <figure className="clipping">
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={film.image}
                alt={film.director}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="hand-note truncate px-1 pt-1.5 pb-0.5">
              {film.titles[language] ?? film.titles.en} — {film.director}
            </figcaption>
          </figure>
        </Link>
      )}

      {/* Today's painting, sent as a museum postcard. */}
      {art && (
        <Link
          href="/art/"
          className="group relative block rotate-[1.1deg] transition-transform hover:z-30 hover:rotate-0 lg:absolute lg:right-0 lg:top-[4%] lg:w-[28%]"
        >
          <DeskLabel>daily art</DeskLabel>
          <figure className="clipping">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={art.image}
                alt={art.artist}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="hand-note truncate px-1 pt-1.5 pb-0.5">
              {art.titles[language] ?? art.titles.en} — {art.artist}
            </figcaption>
          </figure>
        </Link>
      )}

      {/* The on-this-day fact on a ruled index card. */}
      {history && (
        <Link
          href="/history/"
          className="group relative block rotate-[-1.5deg] border border-border shadow-sm transition-transform hover:z-30 hover:rotate-0 lg:absolute lg:bottom-0 lg:left-[2%] lg:w-[28%]"
          style={{ background: "var(--print-paper)" }}
        >
          <DeskLabel>on this day</DeskLabel>
          <div className="p-5 pt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-margin-red">
              {history.year}
            </p>
            <div className="mt-1.5 flex items-start gap-4 border-t-2 border-margin-red/70 pt-3">
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-[#212e3e] group-hover:underline group-hover:underline-offset-4">
                  {history.titles[language] ?? history.titles.en}
                </h2>
                <p className="hand-note mt-2" style={{ color: "#5c6b7a" }}>
                  what happened? →
                </p>
              </div>
              {history.image && (
                <figure className="clipping-mini w-20 shrink-0 rotate-[2deg]">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={history.image}
                      alt=""
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </figure>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Today's quote on a post-it, slapped over the seam. */}
      {quote && (
        <Link
          href="/quotes/"
          className="postit relative z-20 block w-full max-w-xs self-center rotate-[-2.5deg] p-5 pb-6 transition-transform hover:z-30 hover:rotate-0 lg:absolute lg:bottom-[2%] lg:left-[33%] lg:w-[25%]"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest opacity-60">
            quote of the day
          </span>
          <p
            className="mt-2 line-clamp-4 text-lg italic leading-snug"
            style={{ fontFamily: "var(--font-literata)" }}
          >
            &ldquo;{quote.titles[language] ?? quote.titles.en}&rdquo;
          </p>
          <p
            className="mt-2 text-right"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
          >
            — {quote.author}
          </p>
        </Link>
      )}

      {/* The date, jotted in the corner of the page. */}
      {dateline && (
        <p
          className="hand-note text-center lg:absolute lg:bottom-0 lg:right-[1%] lg:text-right"
          style={{ fontSize: "1.3rem" }}
        >
          {dateline}
        </p>
      )}
    </div>
  );
}
