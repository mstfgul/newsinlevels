"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Language, VocabularyItem } from "@/lib/types";
import {
  cleanWord,
  lookupWord,
  LOOKUP_LANGUAGES,
  type DictResult,
} from "@/lib/dictionary";
import {
  useEdgeShift,
  WordDetailSheet,
  WordPopover,
  type LookupState,
} from "./WordLookup";

/** The sticky note for a curated vocabulary word, kept inside the screen. */
function VocabPostit({ item }: { item: VocabularyItem }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shift = useEdgeShift(ref, []);
  return (
    <span
      ref={ref}
      role="tooltip"
      className="postit absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rotate-[-1.5deg] p-3 pb-4 font-sans text-sm leading-snug"
      style={{ fontFamily: "var(--font-bricolage)", marginLeft: shift }}
    >
      <span className="mb-1 block font-bold">{item.word}</span>
      <span className="block opacity-80">{item.definition}</span>
    </span>
  );
}

/** Words like "die Koralle", "le corail" or "to squander" — try the full
 * phrase first, then without the leading article/particle. */
function matchCandidates(word: string): string[] {
  const stripped = word
    .replace(/^(the|a|an|to|der|die|das|ein|eine|le|la|les|l'|un|une|se|s')\s+/i, "")
    .trim();
  return stripped && stripped !== word ? [word, stripped] : [word];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Segment {
  text: string;
  item?: VocabularyItem;
}

function segmentParagraph(
  paragraph: string,
  vocabulary: VocabularyItem[],
  used: Set<string>,
): Segment[] {
  let segments: Segment[] = [{ text: paragraph }];

  for (const item of vocabulary) {
    if (used.has(item.word)) continue;
    for (const candidate of matchCandidates(item.word)) {
      const pattern = new RegExp(`(?<![\\p{L}])${escapeRegExp(candidate)}(?![\\p{L}])`, "iu");
      let done = false;
      segments = segments.flatMap((segment) => {
        if (done || segment.item) return [segment];
        const match = pattern.exec(segment.text);
        if (!match) return [segment];
        done = true;
        used.add(item.word);
        return [
          { text: segment.text.slice(0, match.index) },
          { text: match[0], item },
          { text: segment.text.slice(match.index + match[0].length) },
        ].filter((s) => s.text.length > 0);
      });
      if (done) break;
    }
  }
  return segments;
}

/** Alternates plain/word tokens; words (odd indexes) keep apostrophes and hyphens. */
const WORD_TOKEN = /([\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*)/u;

export function HighlightedText({
  text,
  vocabulary,
  lang,
}: {
  text: string;
  vocabulary: VocabularyItem[];
  lang: Language;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [lookup, setLookup] = useState<{ key: string; word: string } | null>(null);
  const [lookupState, setLookupState] = useState<LookupState>("loading");
  const [detail, setDetail] = useState<DictResult | null>(null);
  const lookupKeyRef = useRef<string | null>(null);

  const canLookUp = LOOKUP_LANGUAGES.includes(lang);

  useEffect(() => {
    setActive(null);
    setLookup(null);
    setDetail(null);
    lookupKeyRef.current = null;
  }, [text]);

  // A tap anywhere outside a word or its post-it dismisses the open one.
  useEffect(() => {
    if (!lookup && !active) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-lookup]")) {
        setLookup(null);
        setActive(null);
        lookupKeyRef.current = null;
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lookup, active]);

  const tapWord = (key: string, word: string) => {
    setActive(null);
    if (lookupKeyRef.current === key) {
      setLookup(null);
      lookupKeyRef.current = null;
      return;
    }
    lookupKeyRef.current = key;
    setLookup({ key, word });
    setLookupState("loading");
    lookupWord(word, lang).then(
      (result) => {
        if (lookupKeyRef.current === key) setLookupState(result);
      },
      () => {
        if (lookupKeyRef.current === key) setLookupState("error");
      },
    );
  };

  const renderPlain = (plain: string, keyPrefix: string): ReactNode => {
    if (!canLookUp) return plain;
    const tokens = plain.split(WORD_TOKEN);
    return tokens.map((token, ti) => {
      if (ti % 2 === 0 || !cleanWord(token)) return token;
      const key = `${keyPrefix}:${ti}`;
      const isOpen = lookup?.key === key;
      return (
        <span key={key} data-lookup className="relative">
          <span
            onClick={() => tapWord(key, token)}
            className={`cursor-pointer rounded-sm transition-colors ${
              isOpen ? "bg-foreground/10" : "hover:bg-foreground/5"
            }`}
          >
            {token}
          </span>
          {isOpen && (
            <WordPopover
              word={cleanWord(token)}
              state={lookupState}
              onExpand={() => {
                if (typeof lookupState === "object" && lookupState !== null) {
                  setDetail(lookupState);
                  setLookup(null);
                  lookupKeyRef.current = null;
                }
              }}
            />
          )}
        </span>
      );
    });
  };

  const used = new Set<string>();
  const paragraphs = text.split(/\n+/);

  return (
    <>
      {paragraphs.map((paragraph, pi) => (
        <p key={pi}>
          {segmentParagraph(paragraph, vocabulary, used).map((segment, si): ReactNode => {
            if (!segment.item) return renderPlain(segment.text, `${pi}:${si}`);
            const item = segment.item;
            const isOpen = active === item.word;
            return (
              <span key={si} data-lookup className="relative">
                <mark
                  className="vocab"
                  onClick={() => {
                    setLookup(null);
                    lookupKeyRef.current = null;
                    setActive(isOpen ? null : item.word);
                  }}
                >
                  {segment.text}
                </mark>
                {isOpen && <VocabPostit item={item} />}
              </span>
            );
          })}
        </p>
      ))}
      {detail && (
        <WordDetailSheet
          result={detail}
          lang={lang}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
