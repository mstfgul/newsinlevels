"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { VocabularyItem } from "@/lib/types";

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

export function HighlightedText({
  text,
  vocabulary,
}: {
  text: string;
  vocabulary: VocabularyItem[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => setActive(null), [text]);

  const used = new Set<string>();
  const paragraphs = text.split(/\n+/);

  return (
    <>
      {paragraphs.map((paragraph, pi) => (
        <p key={pi}>
          {segmentParagraph(paragraph, vocabulary, used).map((segment, si): ReactNode => {
            if (!segment.item) return segment.text;
            const item = segment.item;
            const isOpen = active === item.word;
            return (
              <span key={si} className="relative">
                <mark
                  className="vocab"
                  onClick={() => setActive(isOpen ? null : item.word)}
                >
                  {segment.text}
                </mark>
                {isOpen && (
                  <span
                    role="tooltip"
                    className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-3 font-sans text-sm leading-snug shadow-xl"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    <span className="mb-1 block font-bold">{item.word}</span>
                    <span className="block text-muted-foreground">
                      {item.definition}
                    </span>
                  </span>
                )}
              </span>
            );
          })}
        </p>
      ))}
    </>
  );
}
