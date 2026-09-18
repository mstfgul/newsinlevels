"use client";

import { useCallback, useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { Reveal } from "@/components/Reveal";
import { ArtViewer } from "@/components/home/ArtViewer";
import { StoryClipping } from "@/components/story/StoryClipping";
import { StoryBackdrop } from "@/components/story/StoryBackdrop";
import { ReadingProgress } from "@/components/story/ReadingProgress";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { artworkById, type Artwork } from "@/lib/gallery";
import { STORY_CONTENT, STORY_CLIPPINGS } from "./content";

export function StoryView() {
  const [lang, setLang] = useState<LegalLang>("en");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const copy = STORY_CONTENT[lang];

  // One clipping per slot, floated beside the prose from `sm` up.
  const clip = (i: number, className: string) => {
    const c = STORY_CLIPPINGS[i];
    return (
      <StoryClipping
        artwork={artworkById(c.id)}
        caption={copy.captions[i]}
        rotate={c.rotate}
        side={c.side}
        depth={c.depth}
        className={className}
        onOpen={setSelected}
      />
    );
  };

  return (
    <div>
      <ReadingProgress />
      <StoryBackdrop />

      <div className="mb-6 flex justify-end">
        <LegalLanguagePicker languages={LEGAL_LANGUAGES} active={lang} onSelect={setLang} />
      </div>

      <PageIntro title={copy.title} size="display">
        {copy.intro}
      </PageIntro>

      <div className="space-y-5 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        {clip(0, "mx-auto w-[12rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[14rem]")}

        <p>{copy.paragraphs[0]}</p>

        {clip(1, "mx-auto w-[10.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[12rem]")}

        <p>{copy.paragraphs[1]}</p>

        <Reveal amount={0.6}>
          <blockquote className="editorial my-8 border-l-2 border-margin-red pl-5 text-[1.5rem] italic sm:text-[1.75rem]">
            {copy.pullQuote}
          </blockquote>
        </Reveal>

        <p>{copy.paragraphs[2]}</p>

        {clip(2, "mx-auto w-[13rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[15rem]")}

        <p>{copy.paragraphs[3]}</p>

        {clip(3, "mx-auto w-[10.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[12rem]")}

        <p>{copy.paragraphs[4]}</p>

        {clip(4, "mx-auto w-[13rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[15.5rem]")}

        <p>{copy.paragraphs[5]}</p>

        {clip(5, "mx-auto w-[11.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[13rem]")}

        <p>{copy.paragraphs[6]}</p>

        <div className="clear-both" />
      </div>

      <p className="hand-note mt-10 rotate-[-1deg] text-right" style={{ fontSize: "1.35rem" }}>
        {copy.signoff}
      </p>

      <p className="mt-12 font-mono text-[10px] leading-relaxed uppercase tracking-[0.12em] text-muted-foreground">
        Domenico di Michelino, Dante and the Three Kingdoms (1465), Florence Cathedral · Vermeer, Woman Reading a Letter (c. 1663), Rijksmuseum · Van Gogh, The Starry Night (1889), MoMA · Jacques-Émile Blanche, Portrait de Marcel Proust (1892) · Raphael, The School of Athens (1509–1511), Vatican · Van Gogh, Almond Blossom (1890), Van Gogh Museum · public domain
      </p>

      <ArtViewer artwork={selected} layoutPrefix="story" onClose={close} />
    </div>
  );
}
