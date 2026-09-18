"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { SectionHeading } from "@/components/home/SectionHeading";
import { DEMO_SOURCE_LANGUAGE, demoMeaning, demoTokens } from "@/lib/demo-glossary";
import { DICTIONARY_LANGUAGES, languageByCode, matchBrowserLanguage } from "@/lib/languages";

/**
 * "Tap any word" — the app's meaning drawer, on the desk. Every word of the
 * sentence is a button; hover, focus or tap shows its meaning in the
 * visitor's dictionary language on a card beneath the page (the app's
 * GlossDrawer, minus the star). The language row above — the 14 languages a
 * word can be translated into — doubles as the "15 dictionary languages"
 * claim, and starts on the browser's own language when we have it.
 */
const TARGETS = DICTIONARY_LANGUAGES.filter((l) => l.code !== DEMO_SOURCE_LANGUAGE);
const CODES = TARGETS.map((l) => l.code);
const LABELS = Object.fromEntries(TARGETS.map((l) => [l.code, l.endonym])) as Record<string, string>;
const TOKENS = demoTokens();

export function WordDemo() {
  const [target, setTarget] = useState("tr");
  const [active, setActive] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const match = matchBrowserLanguage(navigator.language);
    if (match && match !== DEMO_SOURCE_LANGUAGE) setTarget(match);
  }, []);

  const language = languageByCode(target);
  const token = active === null ? null : TOKENS[active];
  const meaning = token ? demoMeaning(token.key, target) : undefined;

  const pick = (i: number) => {
    setTouched(true);
    setActive((current) => (current === i ? null : i));
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <SectionHeading kicker="tap any word" title="Meaning, without leaving the page.">
        Stuck on a word? Tap it. Its meaning appears in your own language, right under the
        line you are reading — {TARGETS.length + 1} dictionary languages, on device.
      </SectionHeading>

      <div className="mx-auto mt-8 flex max-w-2xl justify-center">
        <LegalLanguagePicker languages={CODES} active={target} onSelect={setTarget} labels={LABELS} />
      </div>

      <div className="relative mx-auto mt-8 max-w-2xl border border-border bg-card shadow-[0_8px_20px_var(--clipping-shadow)]">
        <span aria-hidden className="absolute bottom-0 left-9 top-0 w-[1.5px] bg-margin-red" />
        <div className="px-6 pb-8 pt-7 pl-14 sm:pl-16 sm:pr-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {DEMO_SOURCE_LANGUAGE} · b1 · from today&apos;s page
          </p>
          <p className="ruled mt-3 min-h-[4.6rem]">
            {TOKENS.map((t, i) => (
              <span key={i}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onPointerEnter={() => {
                    setTouched(true);
                    setActive(i);
                  }}
                  onFocus={() => setActive(i)}
                  aria-pressed={active === i}
                  aria-label={`${t.key}: show meaning`}
                  className="cursor-pointer rounded-sm underline decoration-dotted decoration-[var(--rule-blue)] decoration-2 underline-offset-[5px] transition-colors hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {active === i ? <mark className="vocab">{t.text}</mark> : t.text}
                </button>
                {i < TOKENS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>

        {/* The meaning card: the drawer that slides up from under the page. */}
        <div className="min-h-[5.75rem] border-t border-border bg-surface-sunken px-6 py-4 pl-14 sm:pl-16">
          <AnimatePresence mode="wait" initial={false}>
            {token && meaning ? (
              <motion.div
                key={`${token.key}-${target}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {DEMO_SOURCE_LANGUAGE} → {target}
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[1.25rem] font-semibold" style={{ fontFamily: "var(--font-literata)" }}>
                    {token.key}
                  </span>
                  <span
                    className="text-[1.05rem] text-foreground"
                    dir={language?.rtl ? "rtl" : undefined}
                    lang={target}
                  >
                    {meaning}
                  </span>
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {touched ? "tap another word" : "tap a word above"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
