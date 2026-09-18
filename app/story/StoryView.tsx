"use client";

import { useCallback, useState } from "react";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { BrandMark } from "@/components/BrandMark";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { ArtViewer } from "@/components/home/ArtViewer";
import { StoryClipping } from "@/components/story/StoryClipping";
import { StoryBackdrop } from "@/components/story/StoryBackdrop";
import { ReadingProgress } from "@/components/story/ReadingProgress";
import { StoryFinale, StoryLines, StoryParagraph, StoryQuote } from "@/components/story/StoryBlocks";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { artworkById, type Artwork } from "@/lib/gallery";
import { STORY_CONTENT, STORY_CLIPPINGS } from "./content";

/**
 * The letter (ST-105 rewrite): the reader's language up top, an opening in
 * Instrument Serif over the faint collage, then the blocks in order —
 * paragraphs that rise, the phrasebook card, three epigraphs spoken word by
 * word, six clippings fanning in beside the prose (parallax, click to open),
 * the closing lines, the signature with the mark as a stamp, and the door
 * to today's page. A red pen line across the top keeps the reader's place.
 */
const CLIP_CLASS: Record<"left" | "right", string> = {
  right: "mx-auto my-6 w-[12rem] sm:float-right sm:my-1 sm:ml-7 sm:w-[14.5rem]",
  left: "mx-auto my-6 w-[11rem] sm:float-left sm:my-1 sm:mr-7 sm:w-[13rem]",
};

export function StoryView() {
  const [lang, setLang] = useState<LegalLang>("en");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const copy = STORY_CONTENT[lang];

  return (
    <div>
      <ReadingProgress />
      <StoryBackdrop />

      <div className="mb-8 flex justify-end">
        <LegalLanguagePicker languages={LEGAL_LANGUAGES} active={lang} onSelect={setLang} />
      </div>

      <header className="mb-12 text-center" key={`head-${lang}`}>
        <div className="rise mx-auto mb-4 flex justify-center">
          <BrandMark size={52} className="rotate-[-6deg]" />
        </div>
        <h1 className="rise editorial text-[3rem] italic sm:text-[4.25rem]" style={{ animationDelay: "80ms" }}>
          {copy.title}
        </h1>
        <p className="rise hand-note mt-2 rotate-[-0.6deg]" style={{ fontSize: "1.5rem", animationDelay: "160ms" }}>
          {copy.intro}
        </p>
      </header>

      <div key={lang} className="story-body space-y-6 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        {copy.blocks.map((block, i) => {
          switch (block.type) {
            case "p":
              return <StoryParagraph key={i} text={block.text} />;
            case "lines":
              return <StoryLines key={i} lines={block.lines} />;
            case "quote":
              return <StoryQuote key={i} text={block.text} cite={block.cite} />;
            case "finale":
              return <StoryFinale key={i} lines={block.lines} />;
            case "art": {
              const c = STORY_CLIPPINGS[block.slot];
              return (
                <StoryClipping
                  key={i}
                  artwork={artworkById(c.id)}
                  caption={block.caption}
                  rotate={c.rotate}
                  side={c.side}
                  depth={c.depth}
                  className={CLIP_CLASS[c.side]}
                  onOpen={setSelected}
                />
              );
            }
          }
        })}
        <div className="clear-both" />
      </div>

      <div className="mt-10 flex items-center justify-end gap-4">
        <BrandMark size={44} className="rotate-[9deg] opacity-90" />
        <p className="hand-note rotate-[-1deg]" style={{ fontSize: "1.6rem" }}>
          {copy.signoff}
        </p>
      </div>

      <div className="mt-14 flex flex-col items-center gap-4 border-t border-border pt-10 text-center">
        <p className="editorial text-[1.35rem] italic text-muted-foreground">{copy.outro}</p>
        <AppStoreBadge height={48} />
      </div>

      <p className="mt-12 font-mono text-[10px] leading-relaxed uppercase tracking-[0.12em] text-muted-foreground">
        Jacques-Émile Blanche, Portrait de Marcel Proust (1892) · Van Gogh, The Starry Night (1889), MoMA · Vermeer, Woman Reading a Letter (c. 1663), Rijksmuseum · Raphael, The School of Athens (1509–1511), Vatican · Van Gogh, Almond Blossom (1890), Van Gogh Museum · Domenico di Michelino, Dante and the Three Kingdoms (1465), Florence Cathedral · public domain
      </p>

      <ArtViewer artwork={selected} layoutPrefix="story" onClose={close} />
    </div>
  );
}
