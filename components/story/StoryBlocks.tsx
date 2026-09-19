"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { TypedText } from "@/components/story/TypedText";

/**
 * The story's typographic blocks (ST-105; more motion in ST-107). Everything
 * here answers scrolling. A paragraph rises as it enters and brightens as it
 * reaches the reading line — a lamp that follows you down the page; a beat
 * later the one marked phrase gets the highlighter drawn under it, a `((word))`
 * gets the red pen's circle, and a small tick lands in the margin, the
 * teacher's pen. Short lines land like a rubber stamp. The phrasebook lines
 * type themselves with a caret. An epigraph card is laid down on the desk
 * (a 3D tilt that settles), taped, then spoken word by word. A rule between
 * the letter's movements is one hand-drawn pen stroke with the ink pooling
 * at its end. Reduced motion → opacity only: no stagger, typing, tilt or lamp.
 */

const SPRING = { type: "spring", stiffness: 240, damping: 24 } as const;

/** "before ==phrase== after ((word))" → nodes: the highlighter mark and the pen circle. */
export function markup(text: string): ReactNode[] {
  return text.split(/(==[^=]+==|\(\([^)]+\)\))/g).map((part, i) => {
    if (part.startsWith("==")) {
      return (
        <mark key={i} className="vocab">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith("((")) return <PenCircle key={i}>{part.slice(2, -2)}</PenCircle>;
    return <span key={i}>{part}</span>;
  });
}

/** The red pen circles a word — the language picker's stroke, drawn once
 * the paragraph's highlighter has dried (`.hl-draw` on the paragraph). */
function PenCircle({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 64 36"
        preserveAspectRatio="none"
        className="pen-circle-inline pointer-events-none absolute"
        style={{ left: "-0.45em", top: "-0.28em", width: "calc(100% + 0.9em)", height: "calc(100% + 0.56em)" }}
      >
        <path
          d="M14,29 C4,26 3,15 12,9 C22,3 46,3 55,9 C63,15 61,26 50,30 C40,33 20,33 12,28"
          fill="none"
          stroke="var(--margin-red)"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/** The teacher's tick in the margin, once a paragraph has been read. Desktop only (the sheet has no margin on phones). */
function MarginTick() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="story-tick pointer-events-none absolute -left-7 top-[0.15em] hidden h-5 w-5 sm:block">
      <path d="M4 13 L10 19 L21 6" fill="none" stroke="var(--margin-red)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
    </svg>
  );
}

export function StoryParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const short = text.length < 60;
  // The reading lamp: dim while the paragraph waits below, full ink while it
  // crosses the middle of the viewport, a little quieter once it has been read.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 20%"] });
  const lamp = useTransform(scrollYProgress, [0, 0.3, 0.75, 1], reduce ? [1, 1, 1, 1] : [0.42, 1, 1, 0.62]);
  return (
    <motion.p
      ref={ref}
      initial={
        short
          ? { opacity: 0, scale: 1.16, rotate: -1.5, filter: reduce ? "blur(0px)" : "blur(6px)" }
          : { opacity: 0, y: 14 }
      }
      whileInView={short ? { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={short ? { type: "spring", stiffness: 300, damping: 18 } : SPRING}
      className={`relative ${inView ? "hl-draw" : ""} ${short ? "editorial text-[1.35rem] sm:text-[1.55rem]" : ""}`}
    >
      <MarginTick />
      <motion.span style={{ opacity: lamp }} className="block">
        {markup(text)}
      </motion.span>
    </motion.p>
  );
}

/** The phrasebook: three lines typed onto a ruled card, one after another. */
export function StoryLines({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [typed, setTyped] = useState(0); // how many lines have finished typing
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, rotate: -0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={SPRING}
      className="relative my-8 border border-border bg-card shadow-[0_8px_20px_var(--clipping-shadow)]"
    >
      <span aria-hidden className="absolute bottom-0 left-8 top-0 w-[1.5px] bg-margin-red" />
      <ol className="ruled px-6 pb-5 pt-4 pl-12 text-[1.05rem] sm:pl-14">
        {lines.map((line, i) => (
          <li key={line} className="font-mono text-[0.95rem] uppercase tracking-[0.06em] text-muted-foreground">
            <TypedText text={line} start={inView && typed >= i} onDone={() => setTyped((n) => Math.max(n, i + 1))} />
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

/** One stroke of the red pen across the page: a short one announces an
 * epigraph, a long one separates the letter's movements. The ink pools at
 * the end of the stroke. */
export function StoryRule({ variant = "section" }: { variant?: "section" | "quote" }) {
  const reduce = useReducedMotion() ?? false;
  const quote = variant === "quote";
  return (
    <div aria-hidden className={`mx-auto ${quote ? "mt-10 w-24" : "my-14 w-3/4 sm:w-1/2"}`}>
      <svg viewBox="0 0 300 12" className="block h-auto w-full overflow-visible">
        <motion.path
          d={quote ? "M4,7 C60,3 120,10 180,6 S250,4 296,7" : "M3,7 C50,2 100,11 150,6 S250,3 297,7"}
          fill="none"
          stroke="var(--margin-red)"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.circle
          cx="296"
          cy="7"
          r="3.4"
          fill="var(--margin-red)"
          initial={reduce ? undefined : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.55 }}
          style={{ transformOrigin: "296px 7px" }}
        />
      </svg>
    </div>
  );
}

/** An epigraph: laid down on the desk, taped, then spoken word by word. */
export function StoryQuote({ text, cite }: { text: string; cite: string }) {
  const reduce = useReducedMotion() ?? false;
  const words = text.split(" ");
  return (
    <>
      <StoryRule variant="quote" />
      <motion.figure
        initial={{ opacity: 0, y: 44, rotateX: -26, rotate: -1.6 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotate: -0.6 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformPerspective: 900, transformOrigin: "50% 100%" }}
        className="relative mb-12 mt-5 border border-border bg-card px-6 pb-6 pt-8 text-center shadow-[0_8px_20px_var(--clipping-shadow)] sm:px-10"
      >
        {/* Two strips of tape land a beat after the card does. */}
        {[-35, 35].map((deg) => (
          <motion.span
            key={deg}
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 420, damping: 16, delay: 0.45 }}
            className={`absolute top-[-5px] h-4 w-[46px] ${deg < 0 ? "left-[-14px]" : "right-[-14px]"}`}
            style={{ background: "var(--tape)", rotate: deg }}
          />
        ))}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SPRING, delay: 0.3 }}
          className="editorial absolute -top-3 left-4 text-[4rem] leading-none"
          style={{ color: "var(--hl-strong)" }}
        >
          “
        </motion.span>
        <blockquote className="editorial text-[1.45rem] italic sm:text-[1.8rem]">
          {/* The space lives between the inline-block words, not inside them
           * (an inline-block drops its own trailing space). */}
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.32, ease: [0.22, 0.9, 0.24, 1], delay: reduce ? 0 : 0.35 + i * 0.045 }}
                className="inline-block"
              >
                {w}
              </motion.span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
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
            initial={{ opacity: 0, y: 18, scale: last ? 0.94 : 1 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
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
