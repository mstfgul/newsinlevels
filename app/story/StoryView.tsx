"use client";

import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { Clipping } from "@/components/Clipping";
import { Reveal } from "@/components/Reveal";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { STORY_CONTENT, STORY_CLIPPINGS } from "./content";

export function StoryView() {
  const [lang, setLang] = useState<LegalLang>("en");
  const copy = STORY_CONTENT[lang];
  const [dante, vermeer, starryNight, proust, schoolOfAthens, almond] = STORY_CLIPPINGS;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <LegalLanguagePicker languages={LEGAL_LANGUAGES} active={lang} onSelect={setLang} />
      </div>

      <PageIntro title={copy.title} size="display">
        {copy.intro}
      </PageIntro>

      <div className="space-y-5 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        <Reveal className="mx-auto w-[12rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[14rem]" tilt={-1.1}>
          <Clipping {...dante} caption={copy.captions[0]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[0]}</p>

        <Reveal className="mx-auto w-[10.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[12rem]" tilt={1.1}>
          <Clipping {...vermeer} caption={copy.captions[1]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[1]}</p>

        <Reveal amount={0.6}>
          <blockquote className="editorial my-8 border-l-2 border-margin-red pl-5 text-[1.5rem] italic sm:text-[1.75rem]">
            {copy.pullQuote}
          </blockquote>
        </Reveal>

        <p>{copy.paragraphs[2]}</p>

        <Reveal className="mx-auto w-[13rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[15rem]" tilt={-1.1}>
          <Clipping {...starryNight} caption={copy.captions[2]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[3]}</p>

        <Reveal className="mx-auto w-[10.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[12rem]" tilt={1.1}>
          <Clipping {...proust} caption={copy.captions[3]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[4]}</p>

        <Reveal className="mx-auto w-[13rem] sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-[15.5rem]" tilt={-1.1}>
          <Clipping {...schoolOfAthens} caption={copy.captions[4]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[5]}</p>

        <Reveal className="mx-auto w-[11.5rem] sm:float-left sm:mx-0 sm:mb-4 sm:mr-6 sm:w-[13rem]" tilt={1.1}>
          <Clipping {...almond} caption={copy.captions[5]} className="w-full" />
        </Reveal>

        <p>{copy.paragraphs[6]}</p>

        <div className="clear-both" />
      </div>

      <p className="hand-note mt-10 rotate-[-1deg] text-right" style={{ fontSize: "1.35rem" }}>
        {copy.signoff}
      </p>

      <p className="mt-12 font-mono text-[10px] leading-relaxed uppercase tracking-[0.12em] text-muted-foreground">
        Domenico di Michelino, Dante and the Three Kingdoms (1465), Florence Cathedral · Vermeer, Woman Reading a Letter (c. 1663), Rijksmuseum · Van Gogh, The Starry Night (1889), MoMA · Jacques-Émile Blanche, Portrait de Marcel Proust (1892) · Raphael, The School of Athens (1509–1511), Vatican · Van Gogh, Almond Blossom (1890), Van Gogh Museum · public domain
      </p>
    </div>
  );
}
