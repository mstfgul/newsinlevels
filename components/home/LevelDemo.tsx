"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { LEVEL_SAMPLES, levelColor, splitFocus, type Level } from "@/lib/level-samples";

/**
 * "One text, six levels" — the app's one bold move (design-language.md § 1:
 * drag across the A1→C2 ladder and the text rewrites itself), on the desk.
 *
 * The ladder auto-plays once when the section scrolls into view: A1 → C2,
 * 1.6 s a step, each step swapping the sentence in place (`level-swap`) and
 * re-drawing the highlighter over the focus word (`hl-draw`, "the ink
 * dries"). The first touch — pointer, click or arrow key — hands control to
 * the reader and the tour stops. Under reduced motion there is no tour: the
 * ladder starts at B1 and swaps are plain crossfades.
 */
const STEP_MS = 1600;
const DEFAULT_LEVEL_INDEX = 2; // B1 — the app's own default

export function LevelDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [index, setIndex] = useState(reduce ? DEFAULT_LEVEL_INDEX : 0);
  const [touring, setTouring] = useState(!reduce);
  const [swapKey, setSwapKey] = useState(0);

  // The tour: advance a step at a time until C2, then stop.
  useEffect(() => {
    if (!inView || !touring) return;
    if (index >= LEVEL_SAMPLES.length - 1) {
      setTouring(false);
      return;
    }
    const t = setTimeout(() => {
      setIndex((i) => i + 1);
      setSwapKey((k) => k + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [inView, touring, index]);

  const choose = (i: number) => {
    setTouring(false);
    if (i === index) return;
    setIndex(i);
    setSwapKey((k) => k + 1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      choose(Math.min(LEVEL_SAMPLES.length - 1, index + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      choose(Math.max(0, index - 1));
    }
  };

  const sample = LEVEL_SAMPLES[index];
  const [before, focus, after] = splitFocus(sample);

  return (
    <section ref={ref} className="mx-auto max-w-5xl px-5 py-20 sm:py-28" onPointerEnter={() => setTouring(false)}>
      <SectionHeading kicker="one painting, six levels" title="The same page, rewritten for you.">
        Every painting, film and book arrives at six CEFR levels. Pick yours and the sentence
        changes under your eyes — same idea, same highlighted word, different language.
      </SectionHeading>

      {/* The ladder: six level dots joined by a rule, the chosen one lifted. */}
      <div
        role="radiogroup"
        aria-label="CEFR level"
        onKeyDown={onKey}
        className="relative mx-auto mt-10 flex max-w-xl items-center justify-between"
      >
        <span aria-hidden className="absolute inset-x-6 top-1/2 -z-10 h-px bg-rule-blue" />
        {LEVEL_SAMPLES.map((s, i) => {
          const selected = i === index;
          return (
            <button
              key={s.level}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${s.label}, ${s.name}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(i)}
              className="flex size-11 items-center justify-center rounded-full font-mono text-xs font-semibold text-on-primary transition-[transform,opacity,box-shadow] duration-[var(--m-swift)] ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              style={{
                background: levelColor(s.level as Level),
                opacity: selected ? 1 : 0.42,
                transform: selected ? "scale(1.14)" : "scale(1)",
                boxShadow: selected ? "0 0 0 3px var(--background), 0 0 0 5px " + levelColor(s.level as Level) : "none",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* The page: red margin, exercise-book ruling, the sentence on it. */}
      <div className="relative mx-auto mt-10 max-w-2xl border border-border bg-card shadow-[0_8px_20px_var(--clipping-shadow)]">
        <span aria-hidden className="absolute bottom-0 left-9 top-0 w-[1.5px] bg-margin-red" />
        <div className="px-6 pb-8 pt-7 pl-14 sm:pl-16 sm:pr-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {sample.label} · {sample.name}
          </p>
          <div
            key={swapKey}
            className={`level-swap hl-draw ruled mt-3 min-h-[7.5rem] ${sample.easy ? "ruled--easy" : ""}`}
            aria-live="polite"
          >
            <p>
              {before}
              {focus && <mark className="vocab">{focus}</mark>}
              {after}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {touring ? "watch it climb — or tap a level" : "tap a level · ← → on a keyboard"}
      </p>
    </section>
  );
}
