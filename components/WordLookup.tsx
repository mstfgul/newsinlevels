"use client";

import { useEffect } from "react";
import type { Language } from "@/lib/types";
import type { DictEntry, DictResult } from "@/lib/dictionary";

export type LookupState = "loading" | "error" | DictResult | null;

/** Post-it under a tapped word: first meaning + a magnifier to expand. */
export function WordPopover({
  word,
  state,
  onExpand,
}: {
  word: string;
  state: LookupState;
  onExpand: () => void;
}) {
  const result = typeof state === "object" && state !== null ? state : null;
  const first = result?.entries[0];

  return (
    <span
      role="tooltip"
      className="postit absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rotate-[-1.5deg] p-3 pb-4 font-sans text-sm leading-snug"
      style={{ fontFamily: "var(--font-bricolage)" }}
    >
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-bold">{result?.term ?? word}</span>
        {first && (
          <span className="font-mono text-[10px] uppercase tracking-wide opacity-60">
            {first.partOfSpeech}
          </span>
        )}
      </span>
      {state === "loading" && (
        <span className="block opacity-60">looking it up…</span>
      )}
      {state === "error" && (
        <span className="block opacity-60">dictionary unreachable — try again</span>
      )}
      {state === null && <span className="block opacity-60">no entry found</span>}
      {first && (
        <>
          <span className="block opacity-80">
            {first.senses[0].definition}
          </span>
          {result?.lemma && (
            <span className="mt-1 block opacity-80">
              <span className="font-bold">{result.lemma.term}</span>{" "}
              {result.lemma.entries[0].senses[0].definition}
            </span>
          )}
          <button
            type="button"
            onClick={onExpand}
            aria-label={`All meanings of ${result!.term}`}
            className="absolute bottom-0.5 right-1 cursor-pointer p-1.5 text-lg leading-none opacity-60 transition-opacity hover:opacity-100"
          >
            ⤢
          </button>
        </>
      )}
    </span>
  );
}

function EntrySections({
  entries,
  mainLanguage,
}: {
  entries: DictEntry[];
  mainLanguage?: string;
}) {
  return (
    <>
      {entries.map((entry, ei) => (
        <section key={ei} className="mt-5">
          <h3 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {entry.partOfSpeech}
            {entry.language !== mainLanguage && ` · ${entry.language}`}
          </h3>
          <ol className="ruled list-decimal pl-5">
            {entry.senses.map((sense, si) => (
              <li key={si} className="py-2 text-[15px] leading-relaxed">
                {sense.definition}
                {sense.examples.map((example, xi) => (
                  <span
                    key={xi}
                    className="mt-1 block border-l border-margin-red/50 pl-3 text-sm text-muted-foreground"
                  >
                    <em>{example.example}</em>
                    {example.translation && <> — {example.translation}</>}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

/** Full dictionary page: every part of speech, sense and example. */
export function WordDetailSheet({
  result,
  lang,
  onClose,
}: {
  result: DictResult;
  lang: Language;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const articleLanguage = result.entries.find(
    (e) => e.language,
  )?.language;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Dictionary entry for ${result.term}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-border bg-card shadow-xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Same red margin rule as the article page. */}
        <div className="border-l-2 border-margin-red p-5 pl-6 sm:p-7 sm:pl-8">
          <div className="flex items-start justify-between gap-4">
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-literata)" }}
            >
              {result.term}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer rounded-md border border-border px-2 py-0.5 font-mono text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <EntrySections
            entries={result.entries}
            mainLanguage={articleLanguage}
          />

          {result.lemma && (
            <div className="mt-7 border-t-2 border-dashed border-border pt-5">
              <h2
                className="text-xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-literata)" }}
              >
                {result.lemma.term}
              </h2>
              <EntrySections
                entries={result.lemma.entries}
                mainLanguage={articleLanguage}
              />
            </div>
          )}

          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <a
              href={`https://en.wiktionary.org/wiki/${encodeURIComponent(result.term)}#${lang === "en" ? "English" : lang === "de" ? "German" : "French"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Wiktionary ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
