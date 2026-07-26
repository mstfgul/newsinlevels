"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { Language } from "@/lib/types";
import type { DictEntry, DictResult } from "@/lib/dictionary";

export type LookupState = "loading" | "error" | DictResult | null;

/** Post-its are centered under their word; near the screen edge that would
 * push them off-screen, so nudge them back inside the viewport. */
export function useEdgeShift(
  ref: RefObject<HTMLElement | null>,
  deps: unknown[],
): number {
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pad = 10;
    let delta = 0;
    if (rect.left < pad) delta = pad - rect.left;
    else if (rect.right > window.innerWidth - pad) {
      delta = window.innerWidth - pad - rect.right;
    }
    if (delta !== 0) setShift((prev) => prev + delta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return shift;
}

/** A small cloud above the tapped word showing its meaning: the pre-built
 * translation when we have one (instant, offline), otherwise the first sense
 * from the live dictionary. The ⤢ opens the full entry. */
export function WordPopover({
  word,
  gloss,
  state,
  onExpand,
}: {
  word: string;
  /** The pre-built translation for this word, if the article carries one. */
  gloss: string | null;
  state: LookupState;
  onExpand: () => void;
}) {
  const result = typeof state === "object" && state !== null ? state : null;
  const ref = useRef<HTMLSpanElement>(null);
  const shift = useEdgeShift(ref, [state, gloss]);

  // Prefer the pre-built translation (already short). When we fall back to the
  // dictionary, keep only a short snippet — the first clause of the first
  // sense — so the cloud reads like a quick translation, not a definition.
  const meaning = gloss ?? shorten(result?.entries[0]?.senses[0]?.definition);

  return (
    <span
      ref={ref}
      role="tooltip"
      className="speech absolute bottom-full left-1/2 z-20 mb-2.5 flex max-w-[14rem] -translate-x-1/2 items-center gap-2 rounded-xl bg-foreground px-3 py-1.5 text-background shadow-lg"
      style={{ fontFamily: "var(--font-bricolage)", marginLeft: shift }}
    >
      {meaning ? (
        <span className="min-w-0 text-sm font-medium leading-snug line-clamp-2">
          {meaning}
        </span>
      ) : (
        <span className="min-w-0 text-sm leading-snug opacity-70">
          {state === "loading"
            ? "…"
            : state === "error"
              ? "unreachable"
              : "no translation"}
        </span>
      )}
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Full entry for ${result?.term ?? word}`}
        className="shrink-0 cursor-pointer text-sm leading-none opacity-55 transition-opacity hover:opacity-100"
      >
        ⤢
      </button>
    </span>
  );
}

/** Trim a dictionary definition down to a short, translation-like snippet:
 * the first clause only, capped in length. */
function shorten(definition: string | undefined): string | null {
  if (!definition) return null;
  let text = definition.split(/[;(:]|,\s/)[0].trim();
  if (text.length > 46) text = text.slice(0, 46).trimEnd() + "…";
  return text || null;
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
              href={`https://en.wiktionary.org/wiki/${encodeURIComponent(result.term)}#${
                { en: "English", de: "German", fr: "French", es: "Spanish" }[lang]
              }`}
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
