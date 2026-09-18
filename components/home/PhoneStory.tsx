"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { PhoneFrame } from "@/components/home/PhoneFrame";

/**
 * The sticky phone — DailyArt's centrepiece, with the app's own screen
 * recordings inside. The section is three viewports tall; the stage (the
 * phone and the copy beside it) sticks to the top while the reader scrolls
 * through it, and scroll progress picks the active step: the copy swaps,
 * the recording in the phone cross-fades.
 *
 * Videos: every step has a light and a dark recording (the app's own two
 * themes). Both <video>s are always in the tree; CSS shows only the one
 * matching data-theme (`dark:` variant), so the choice never touches React
 * state and cannot mismatch on hydration. Nothing loads until the section
 * is within 600px of the viewport (`src` is set on demand, preload none),
 * only the visible, active video plays, and under reduced motion the
 * posters stand still.
 */
export interface PhoneStep {
  id: "today" | "reader" | "collection";
  kicker: string;
  title: string;
  body: string;
}

const STEPS: readonly PhoneStep[] = [
  {
    id: "today",
    kicker: "every morning",
    title: "Today's page.",
    body: "A painting, a film, a book, a quote, an essay, a story, the news — one page a day, in the language you are learning. Swipe back for yesterday's; nothing is ever lost.",
  },
  {
    id: "reader",
    kicker: "your level, your words",
    title: "Change the level. Tap a word. Translate a sentence.",
    body: "Too hard? Step down to A2. Too easy? Climb to C1. Tap any word for its meaning, or switch on sentence mode and tap a whole sentence.",
  },
  {
    id: "collection",
    kicker: "keep what you love",
    title: "Favourites and the archive.",
    body: "Tap the heart on a page — or a painter, a director, a writer — and it waits for you in Favourites. Every past page stays in the archive, by kind.",
  },
];

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
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      } ${theme === "dark" ? "hidden dark:block" : "dark:hidden"}`}
    />
  );
}

export function PhoneStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const near = useInView(ref, { margin: "600px 0px 600px 0px" });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (near) setLoaded(true);
  }, [near]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))));
  });
  const current = STEPS[step];

  return (
    <section ref={ref} className="relative" style={{ height: `${STEPS.length * 100}svh` }} aria-label="The app, step by step">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5">
        <div className="relative flex w-full max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
          {/* Copy — left of the phone on wide screens (right for the middle step), under it on phones. */}
          <div className={`order-2 w-full max-w-sm text-center sm:w-[34%] sm:text-left ${step === 1 ? "sm:order-3" : "sm:order-1"}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 0.9, 0.24, 1] }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{current.kicker}</p>
                <h2 className="editorial mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)]">{current.title}</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">{current.body}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-6 flex justify-center gap-2 sm:justify-start" aria-hidden>
              {STEPS.map((s, i) => (
                <li
                  key={s.id}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-[var(--m-page)] ${
                    i === step ? "w-8 bg-primary" : "w-3 bg-border"
                  }`}
                />
              ))}
            </ol>
          </div>

          <PhoneFrame className="order-1 w-[min(272px,62vw)] shrink-0 sm:order-2 sm:w-[300px]">
            {STEPS.map((s, i) => (
              <div key={s.id} className="contents">
                <StepVideo step={s} theme="light" active={i === step} load={loaded} autoplay={!reduce} />
                <StepVideo step={s} theme="dark" active={i === step} load={loaded} autoplay={!reduce} />
              </div>
            ))}
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
