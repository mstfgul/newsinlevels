"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { BrandMark } from "@/components/BrandMark";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { ArtViewer } from "@/components/home/ArtViewer";
import { StoryClipping } from "@/components/story/StoryClipping";
import { StoryBackdrop } from "@/components/story/StoryBackdrop";
import { ReadingProgress } from "@/components/story/ReadingProgress";
import { StoryFinale, StoryLines, StoryParagraph, StoryQuote, StoryRule } from "@/components/story/StoryBlocks";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { artworkById, type Artwork } from "@/lib/gallery";
import { STORY_CONTENT, STORY_CLIPPINGS } from "./content";

/**
 * The letter (ST-105 rewrite, ST-107 motion): the reader's language up top;
 * the mark stamped down and the title written in ink with a pen underline
 * drawn beneath it, the whole head lagging and fading as the reading begins;
 * then the blocks in order — paragraphs that rise and light up as they
 * reach the reading line (with the teacher's ticks in the margin, the
 * highlighter and the red pen's circle), the phrasebook card typing itself,
 * three epigraphs laid down and taped, six clippings fanning in beside the
 * prose (parallax, turn, pointer tilt, click to open), pen rules between
 * the letter's movements, the closing lines, the signature written in and
 * the mark stamped beside it, and the door to today's page. A red pen line
 * across the top keeps the reader's place; on wide screens a pen mark
 * travels down the sheet's left edge with the reading.
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
  const reduce = useReducedMotion() ?? false;

  // The head lags the scroll and fades as the reading begins.
  const { scrollY } = useScroll();
  const headY = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, 110]);
  const headOpacity = useTransform(scrollY, [0, 380], reduce ? [1, 1] : [1, 0]);

  // The pen mark that travels down the sheet's left edge as you read.
  const sheetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: read } = useScroll({ target: sheetRef, offset: ["start start", "end end"] });
  const markTop = useTransform(read, (p) => `calc(${(p * 100).toFixed(3)}% - ${(p * 16).toFixed(1)}px)`);

  const signRef = useRef<HTMLDivElement>(null);
  const signed = useInView(signRef, { once: true, amount: 0.8 });

  return (
    <div ref={sheetRef} className="relative">
      <ReadingProgress />
      <StoryBackdrop />

      {!reduce && (
        <motion.div
          aria-hidden
          data-pen-mark
          className="pointer-events-none absolute z-10 hidden sm:block"
          style={{ left: "calc(-2rem - 16px)", top: markTop }}
        >
          <svg width="32" height="16" viewBox="0 0 32 16">
            <path d="M2 8 H21" stroke="var(--margin-red)" strokeWidth="3" strokeLinecap="round" />
            <path d="M21 2.5 L30 8 L21 13.5 Z" fill="var(--margin-red)" />
          </svg>
        </motion.div>
      )}

      <div className="mb-8 flex justify-end">
        <LegalLanguagePicker languages={LEGAL_LANGUAGES} active={lang} onSelect={setLang} />
      </div>

      <motion.header key={`head-${lang}`} style={{ y: headY, opacity: headOpacity }} className="mb-12 text-center">
        <motion.div
          initial={{ scale: 1.7, rotate: -22, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 13, delay: 0.1 }}
          className="mx-auto mb-4 w-fit"
        >
          <BrandMark size={52} />
        </motion.div>
        <h1 className="ink-wipe editorial text-[3rem] italic sm:text-[4.25rem]" style={{ animationDelay: "260ms" }}>
          {copy.title}
        </h1>
        <svg aria-hidden viewBox="0 0 300 12" className="mx-auto -mt-1 block h-auto w-[52%] max-w-[18rem] overflow-visible sm:w-[40%]">
          <motion.path
            d="M4,8 C60,3 120,11 180,6 S262,4 296,8"
            fill="none"
            stroke="var(--margin-red)"
            strokeWidth="2.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05, ease: "easeOut" }}
          />
        </svg>
        <p className="ink-wipe hand-note mt-3 rotate-[-0.6deg]" style={{ fontSize: "1.5rem", animationDelay: "1.35s" }}>
          {copy.intro}
        </p>
      </motion.header>

      <motion.div
        key={lang}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="story-body space-y-6 text-[17px] leading-relaxed"
        style={{ fontFamily: "var(--font-literata)" }}
      >
        {copy.blocks.map((block, i) => {
          switch (block.type) {
            case "p":
              return <StoryParagraph key={i} text={block.text} />;
            case "lines":
              return <StoryLines key={i} lines={block.lines} />;
            case "quote":
              return <StoryQuote key={i} text={block.text} cite={block.cite} />;
            case "rule":
              return <StoryRule key={i} />;
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
      </motion.div>

      <div ref={signRef} className="mt-10 flex items-center justify-end gap-4">
        <motion.div
          initial={{ scale: 1.8, rotate: 34, opacity: 0 }}
          animate={signed ? { scale: 1, rotate: 9, opacity: 0.9 } : undefined}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
        >
          <BrandMark size={44} />
        </motion.div>
        <p
          key={`sign-${lang}-${signed}`}
          className={`hand-note rotate-[-1deg] ${signed ? "ink-wipe" : "opacity-0"}`}
          style={{ fontSize: "1.6rem", animationDuration: "1.1s" }}
        >
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
