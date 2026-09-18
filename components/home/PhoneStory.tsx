"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { PhoneFrame } from "@/components/home/PhoneFrame";
import { Clipping } from "@/components/Clipping";
import { artworkById, artworkSrc, artworkSrcSet, type Artwork } from "@/lib/gallery";

/**
 * The sticky phone — DailyArt's centrepiece, with the app's own screen
 * recordings inside, driven entirely by scroll (ST-104).
 *
 * The section is three viewports tall and the stage sticks while the reader
 * scrolls through it. Nothing here is a timed animation: every value is a
 * function of scroll progress, so a fast flick and a slow read both show the
 * transitions — the three recordings are one vertical stack inside the
 * phone's screen and the stack slides a screen at a time (plateaus to read
 * on, short slides between them); the phone itself turns a few degrees on
 * its axis toward the copy; the copy for each step fades and lifts in its
 * own window; six gallery clippings around the phone rise, drift with a
 * little parallax, and hand over to the next step's pair; a red pen line
 * fills a rail beside the phone.
 *
 * Both themes' recordings are always in the tree (CSS shows the one that
 * matches data-theme, so there is no hydration mismatch), sources load only
 * within 600px of the viewport, only the active visible video plays, and
 * under reduced motion the phone stays flat and the clippings stand still.
 */
export interface PhoneStep {
  id: "today" | "reader" | "collection";
  kicker: string;
  title: string;
  body: string;
  /** Two gallery works that keep the step company beside the phone. */
  art: [string, string];
}

const STEPS: readonly PhoneStep[] = [
  {
    id: "today",
    kicker: "every morning",
    title: "Today's page, and the painting on it.",
    body: "A painting first — then a film, a book, a story, a quote, the news: one curated page a day, in the language you are learning. Swipe back for yesterday's; nothing is ever lost.",
    art: ["girl-pearl-earring", "wanderer-fog"],
  },
  {
    id: "reader",
    kicker: "your level, your words",
    title: "Change the level. Tap a word. Translate a sentence.",
    body: "Too hard? Step down to A2. Too easy? Climb to C1. Tap any word for its meaning, or switch on sentence mode and tap a whole sentence — the painting stays on the page while you read about it.",
    art: ["woman-parasol", "the-scream"],
  },
  {
    id: "collection",
    kicker: "keep what you love",
    title: "Favourites, painters, the archive.",
    body: "Tap the heart on a page — or on a painter, a director, a writer — and it waits in Favourites. Every past page stays in the archive, by kind, as a wall of art you have read.",
    art: ["birth-of-venus", "rousseau-dream"],
  },
];

/** Progress → continuous screen index: plateaus to read on, short slides between. */
const SCREEN_STOPS = [0, 0.27, 0.4, 0.6, 0.73, 1];
const SCREEN_VALUES = [0, 0, 1, 1, 2, 2];

/** How strongly a step "owns" a screen position s (1 at its plateau, 0 a half-screen away). */
const presence = (s: number, i: number) => Math.max(0, Math.min(1, 1 - Math.abs(s - i) * 2));

function StepVideo({
  step,
  theme,
  active,
  load,
  autoplay,
}: {
  step: PhoneStep;
  theme: "light" | "dark";
  active: boolean;
  load: boolean;
  autoplay: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = `/demo/${step.id}-${theme}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Only the visible copy (the one whose theme matches) is allowed to play.
    const visible = getComputedStyle(el).display !== "none";
    if (active && load && autoplay && visible) {
      el.play().catch(() => {});
    } else {
      el.pause();
      if (!active) el.currentTime = 0;
    }
  }, [active, load, autoplay, theme]);

  return (
    <video
      ref={ref}
      src={load ? `${src}.mp4` : undefined}
      poster={`${src}.webp`}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={`absolute inset-0 h-full w-full object-cover object-top ${theme === "dark" ? "hidden dark:block" : "dark:hidden"}`}
    />
  );
}

/** One step's copy: fades and lifts within its own scroll window. */
function StepCopy({ step, index, screen, reduce }: { step: PhoneStep; index: number; screen: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(screen, (s) => presence(s, index));
  const y = useTransform(screen, (s) => (reduce ? 0 : (s - index) * -28));
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0" aria-hidden={false}>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{step.kicker}</p>
      <h2 className="editorial mt-3 text-[clamp(1.6rem,3.3vw,2.5rem)]">{step.title}</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">{step.body}</p>
    </motion.div>
  );
}

function StepDots({ step, className }: { step: number; className: string }) {
  return (
    <ol className={className} aria-hidden>
      {STEPS.map((s, i) => (
        <li
          key={s.id}
          className={`h-1.5 rounded-full transition-[width,background-color] duration-[var(--m-page)] ${
            i === step ? "w-8 bg-primary" : "w-3 bg-border"
          }`}
        />
      ))}
    </ol>
  );
}

/** A gallery clipping beside the phone: appears with its step, drifts with depth. */
function SideArt({
  artwork,
  index,
  slot,
  screen,
  progress,
  reduce,
}: {
  artwork: Artwork;
  index: number;
  slot: { left?: string; right?: string; top: string; width: string; depth: number; tilt: number };
  screen: MotionValue<number>;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const opacity = useTransform(screen, (s) => presence(s, index));
  const rise = useTransform(screen, (s) => (reduce ? 0 : (1 - presence(s, index)) * 40));
  const drift = useTransform(progress, [0, 1], [0, reduce ? 0 : -(30 + slot.depth * 30)]);
  const y = useTransform(() => rise.get() + drift.get());
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute hidden sm:block"
      style={{ left: slot.left, right: slot.right, top: slot.top, width: slot.width, opacity, y, zIndex: 5 - slot.depth }}
    >
      <Clipping
        src={artworkSrc(artwork, 640)}
        srcSet={artworkSrcSet(artwork)}
        sizes="12vw"
        alt=""
        width={artwork.w640}
        height={artwork.h640}
        rotate={slot.tilt}
      />
    </motion.div>
  );
}

const SIDE_SLOTS = [
  { left: "2%", top: "8%", width: "13%", depth: 1, tilt: -2 },
  { right: "3%", top: "56%", width: "12%", depth: 2, tilt: 1.5 },
  { right: "1%", top: "6%", width: "13%", depth: 2, tilt: 1.5 },
  { left: "4%", top: "58%", width: "12%", depth: 1, tilt: -1.5 },
  { left: "1%", top: "22%", width: "12%", depth: 0, tilt: -2 },
  { right: "4%", top: "30%", width: "13%", depth: 1, tilt: 2 },
] as const;

export function PhoneStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Lazy sources: set once the section is within 600px of the viewport.
  const [loaded, setLoaded] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", () => setLoaded(true));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoaded(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const screen = useTransform(scrollYProgress, SCREEN_STOPS, SCREEN_VALUES);
  const stackY = useTransform(screen, (s) => `${(-s * 100) / STEPS.length}%`);
  const rotateY = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], reduce ? [0, 0, 0, 0] : [-7, 7, -7, 7]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.98, 1.02, 0.98]);
  const railScale = scrollYProgress;

  const [step, setStep] = useState(0);
  useMotionValueEvent(screen, "change", (s) => setStep(Math.min(STEPS.length - 1, Math.max(0, Math.round(s)))));

  return (
    <section ref={ref} className="relative" style={{ height: `${STEPS.length * 100}svh` }} aria-label="The app, step by step">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5">
        <div className="relative flex w-full max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
          {/* The clippings that keep each step company (desktop only). */}
          {STEPS.flatMap((s, i) =>
            s.art.map((id, j) => (
              <SideArt
                key={id}
                artwork={artworkById(id)}
                index={i}
                slot={SIDE_SLOTS[i * 2 + j]}
                screen={screen}
                progress={scrollYProgress}
                reduce={reduce}
              />
            )),
          )}

          {/* Copy. Wide screens: a three-column grid — steps 1 and 3 read on the
           * left of the phone, step 2 on the right — with both side columns always
           * present so the phone never jumps. Phones: all copy under the device. */}
          <div className="relative order-2 h-[15rem] w-full max-w-sm text-center sm:hidden">
            {STEPS.map((s, i) => (
              <StepCopy key={s.id} step={s} index={i} screen={screen} reduce={reduce} />
            ))}
            <StepDots step={step} className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2" />
          </div>
          <div className="relative hidden h-[18rem] w-[34%] text-left sm:block">
            <StepCopy step={STEPS[0]} index={0} screen={screen} reduce={reduce} />
            <StepCopy step={STEPS[2]} index={2} screen={screen} reduce={reduce} />
            <StepDots step={step} className="absolute -bottom-2 left-0 flex gap-2" />
          </div>

          <div className="relative order-1 flex items-center gap-5 sm:order-none">
            <motion.div data-phone style={{ rotateY, scale: phoneScale, transformPerspective: 1400 }} className="shrink-0">
              <PhoneFrame className="w-[min(272px,62vw)] sm:w-[300px]">
                <motion.div data-stack className="absolute inset-x-0 top-0" style={{ height: `${STEPS.length * 100}%`, y: stackY }}>
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="relative w-full" style={{ height: `${100 / STEPS.length}%` }}>
                      <StepVideo step={s} theme="light" active={i === step} load={loaded} autoplay={!reduce} />
                      <StepVideo step={s} theme="dark" active={i === step} load={loaded} autoplay={!reduce} />
                    </div>
                  ))}
                </motion.div>
              </PhoneFrame>
            </motion.div>

            {/* The red pen fills a rail beside the phone as the reader scrolls. */}
            <div aria-hidden className="relative hidden h-[60svh] w-px bg-border sm:block">
              <motion.div data-rail className="absolute inset-x-0 top-0 origin-top bg-margin-red" style={{ scaleY: railScale, height: "100%" }} />
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full border transition-colors duration-[var(--m-page)] ${
                    i <= step ? "border-margin-red bg-margin-red" : "border-border bg-background"
                  }`}
                  style={{ top: `${((i + 0.5) / STEPS.length) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="relative hidden h-[18rem] w-[34%] text-left sm:block">
            <StepCopy step={STEPS[1]} index={1} screen={screen} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}
