"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * The story's typographic blocks (ST-105). Everything here answers scrolling:
 * a paragraph rises as it enters; the one marked phrase in it gets the
 * highlighter drawn under it ("the ink dries") a beat later; the three
 * phrasebook lines type themselves onto a ruled card one after another; an
 * epigraph is spoken word by word; the closing lines land one at a time,
 * the last one highlighted end to end. Reduced motion → opacity only, no
 * word stagger.
 */

const SPRING = { type: "spring", stiffness: 240, damping: 24 } as const;

/** "before ==phrase== after" → nodes; the marked phrase becomes <mark class="vocab">. */
export function markup(text: string): ReactNode[] {
  const parts = text.split(/==([^=]+)==/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="vocab">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function StoryParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const short = text.length < 60;
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={SPRING}
      className={`${inView ? "hl-draw" : ""} ${short ? "editorial text-[1.35rem] sm:text-[1.55rem]" : ""}`}
    >
      {markup(text)}
    </motion.p>
  );
}

/** The phrasebook: three lines typed onto a ruled card, one after another. */
export function StoryLines({ lines }: { lines: string[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      className="relative my-8 border border-border bg-card shadow-[0_8px_20px_var(--clipping-shadow)]"
    >
      <span aria-hidden className="absolute bottom-0 left-8 top-0 w-[1.5px] bg-margin-red" />
      <ol className="ruled px-6 pb-5 pt-4 pl-12 text-[1.05rem] sm:pl-14">
        {lines.map((line, i) => (
          <motion.li
            key={line}
            variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
            transition={{ ...SPRING, delay: 0.25 + i * 0.35 }}
            className="font-mono text-[0.95rem] uppercase tracking-[0.06em] text-muted-foreground"
          >
            {line}
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

/** An epigraph, spoken word by word, on a taped paper card. */
export function StoryQuote({ text, cite }: { text: string; cite: string }) {
  const reduce = useReducedMotion() ?? false;
  const words = text.split(" ");
  return (
    <>
    {/* The red pen rules a short line across the page before each epigraph. */}
    <motion.span
      aria-hidden
      className="mx-auto mt-10 block h-[2px] w-24 origin-left bg-margin-red"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    />
    <motion.figure
      initial={{ opacity: 0, y: 24, rotate: -1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={SPRING}
      className="relative mb-12 mt-5 border border-border bg-card px-6 pb-6 pt-8 text-center shadow-[0_8px_20px_var(--clipping-shadow)] sm:px-10"
    >
      <span aria-hidden className="absolute left-[-14px] top-[-5px] h-4 w-[46px] -rotate-[35deg]" style={{ background: "var(--tape)" }} />
      <span aria-hidden className="absolute right-[-14px] top-[-5px] h-4 w-[46px] rotate-[35deg]" style={{ background: "var(--tape)" }} />
      <span aria-hidden className="editorial absolute -top-3 left-4 text-[4rem] leading-none" style={{ color: "var(--hl-strong)" }}>
        “
      </span>
      <blockquote className="editorial text-[1.45rem] italic sm:text-[1.8rem]">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.32, ease: [0.22, 0.9, 0.24, 1], delay: reduce ? 0 : 0.25 + i * 0.045 }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </blockquote>
      <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="mr-2 inline-block h-px w-6 align-middle bg-margin-red" />
        {cite}
      </figcaption>
    </motion.figure>
    </>
  );
}

/** The closing lines: one at a time, larger, the last one highlighted end to end. */
export function StoryFinale({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className={`my-14 space-y-4 text-center ${inView ? "hl-draw" : ""}`}>
      {lines.map((line, i) => {
        const last = i === lines.length - 1;
        return (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...SPRING, delay: i * 0.35 }}
            className={`editorial ${last ? "text-[2rem] sm:text-[2.6rem]" : "text-[1.5rem] text-muted-foreground sm:text-[1.9rem]"}`}
          >
            {last ? <mark className="vocab">{line}</mark> : line}
          </motion.p>
        );
      })}
    </div>
  );
}
