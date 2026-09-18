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
  /** Four gallery works that keep the step company around the phone. */
  art: [string, string, string, string];
}

const STEPS: readonly PhoneStep[] = [
  {
    id: "today",
    kicker: "every morning",
    title: "Today's page, and the painting on it.",
    body: "A painting first — then a film, a book, a story, a quote, the news: one curated page a day, in the language you are learning. Swipe back for yesterday's; nothing is ever lost.",
    art: ["girl-pearl-earring", "wanderer-fog", "the-kiss", "young-girl-reading"],
  },
  {
    id: "reader",
    kicker: "your level, your words",
    title: "Change the level. Tap a word. Translate a sentence.",
    body: "Too hard? Step down to A2. Too easy? Climb to C1. Tap any word for its meaning, or switch on sentence mode and tap a whole sentence — the painting stays on the page while you read about it.",
    art: ["woman-parasol", "the-scream", "cafe-terrace", "milkmaid"],
  },
  {
    id: "collection",
    kicker: "keep what you love",
    title: "Favourites, painters, the archive.",
    body: "Tap the heart on a page — or on a painter, a director, a writer — and it waits in Favourites. Every past page stays in the archive, by kind, as a wall of art you have read.",
    art: ["birth-of-venus", "rousseau-dream", "grande-jatte", "ophelia"],
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
      <p data-copy-end className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">{step.body}</p>
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

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const pct = (v: string) => parseFloat(v) / 100;

/** Minimum clearance between a clipping and the copy's text, in px — covers
 * the ±14px the visible copy drifts while its step fades in or out. */
const COPY_GAP = 20;

type Stage = { w: number; h: number; copyTop: number; copyBottom: number };

/**
 * A gallery clipping beside the phone. Each one lives *behind* the phone
 * until its step comes: as the step's presence rises it slides straight up
 * (or down) out from behind the device into the top or bottom band, then
 * sideways along that band to its corner — vertical first, then horizontal,
 * so the path never crosses the copy columns in the middle band. When the
 * step passes it retreats the same way. Geometry is measured against the
 * stage (the sticky viewport-high box) each time it resizes, and each band
 * is pushed away from the copy's measured extent — the body text overflows
 * its fixed-height column, so a bare stage percentage would meet it on
 * short viewports.
 */
function SideArt({
  artwork,
  index,
  slot,
  screen,
  progress,
  stage,
  reduce,
}: {
  artwork: Artwork;
  index: number;
  slot: { left?: string; right?: string; top: string; width: string; depth: number; tilt: number };
  screen: MotionValue<number>;
  progress: MotionValue<number>;
  stage: Stage;
  reduce: boolean;
}) {
  const geometry = useRef({ dx: 0, dy: 0 });
  const [top, setTop] = useState<number | null>(null);
  useEffect(() => {
    if (!stage.w || !stage.h) return;
    const w = stage.w * pct(slot.width);
    const h = w * (artwork.h640 / artwork.w640) + 34; // frame padding + tape
    const x0 = slot.left !== undefined ? stage.w * pct(slot.left) : stage.w - stage.w * pct(slot.right ?? "0") - w;
    const wanted = stage.h * pct(slot.top);
    // Top band: the clipping's bottom edge stays above the kicker; bottom
    // band: its top edge stays below the longest body. Cropping at the stage
    // edge on a very short viewport is preferable to covering the words.
    const y0 = pct(slot.top) < 0.5 ? Math.min(wanted, stage.copyTop - COPY_GAP - h) : Math.max(wanted, stage.copyBottom + COPY_GAP);
    geometry.current = { dx: stage.w / 2 - (x0 + w / 2), dy: stage.h / 2 - (y0 + h / 2) };
    setTop(y0);
    screen.set(screen.get()); // re-evaluate the transforms below with the new geometry
  }, [stage, slot, artwork, screen]);

  const opacity = useTransform(screen, (s) => clamp01(presence(s, index) * 3));
  const x = useTransform(screen, (s) => {
    if (reduce) return 0;
    const t = presence(s, index);
    return geometry.current.dx * (1 - clamp01((t - 0.5) * 2));
  });
  const rise = useTransform(screen, (s) => {
    if (reduce) return 0;
    const t = presence(s, index);
    return geometry.current.dy * (1 - clamp01(t * 2));
  });
  // Slow parallax over the whole section, always *away* from the copy in the
  // middle: the top band lifts, the bottom band sinks.
  const away = pct(slot.top) < 0.5 ? -1 : 1;
  const drift = useTransform(progress, [0, 1], [0, reduce ? 0 : away * (10 + slot.depth * 10)]);
  const y = useTransform(() => rise.get() + drift.get());
  const scale = useTransform(screen, (s) => (reduce ? 1 : 0.6 + 0.4 * presence(s, index)));
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute hidden sm:block"
      style={{ left: slot.left, right: slot.right, top: top ?? slot.top, width: slot.width, opacity, x, y, scale, zIndex: 3 - slot.depth }}
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

/** Four clippings per step, in the four corners around the phone. The copy
 * columns are vertically centred, so the clippings keep to the top and
 * bottom bands of the stage (top ≤ 4% / ≥ 72% — SideArt pushes a band
 * further out when the measured copy would reach it) and stay narrow
 * enough (≤ 11%) never to reach the columns' text sideways. */
const SIDE_SLOTS = [
  // step 0
  { left: "1%", top: "3%", width: "10%", depth: 1, tilt: -2 },
  { left: "5%", top: "74%", width: "9%", depth: 2, tilt: 1.5 },
  { right: "2%", top: "4%", width: "9%", depth: 2, tilt: 1.5 },
  { right: "4%", top: "72%", width: "11%", depth: 0, tilt: -1.5 },
  // step 1
  { left: "4%", top: "4%", width: "9%", depth: 2, tilt: 1.5 },
  { left: "1%", top: "72%", width: "11%", depth: 0, tilt: -2 },
  { right: "1%", top: "2%", width: "10%", depth: 1, tilt: -1.5 },
  { right: "5%", top: "75%", width: "9%", depth: 2, tilt: 2 },
  // step 2
  { left: "5%", top: "2%", width: "9%", depth: 2, tilt: -1.5 },
  { left: "2%", top: "73%", width: "10%", depth: 1, tilt: 2 },
  { right: "3%", top: "3%", width: "11%", depth: 0, tilt: -2 },
  { right: "1%", top: "74%", width: "9%", depth: 1, tilt: 1.5 },
] as const;

export function PhoneStory() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>({ w: 0, h: 0, copyTop: 0, copyBottom: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      // Percent offsets of the absolutely positioned clippings resolve against
      // the stage's padding box, so measure that (not the content box).
      const w = el.clientWidth;
      const h = el.clientHeight;
      const stageTop = el.getBoundingClientRect().top;
      let copyTop = Infinity;
      let copyBottom = 0;
      el.querySelectorAll<HTMLElement>("[data-copy]").forEach((col) => {
        const r = col.getBoundingClientRect();
        if (!r.height) return; // display:none on phones
        copyTop = Math.min(copyTop, r.top - stageTop);
        // Bodies overflow the fixed-height column; offsetTop ignores the
        // copy's fade-in transform, so this is the layout extent.
        col.querySelectorAll<HTMLElement>("[data-copy-end]").forEach((p) => {
          copyBottom = Math.max(copyBottom, r.top - stageTop + p.offsetTop + p.offsetHeight);
        });
      });
      setStage({ w, h, copyTop: Number.isFinite(copyTop) ? copyTop : h / 2, copyBottom: copyBottom || h / 2 });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll<HTMLElement>("[data-copy-end]").forEach((p) => ro.observe(p)); // fonts/reflow change the copy's height
    return () => ro.disconnect();
  }, []);
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
      <div ref={stageRef} className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5">
        {/* The clippings that keep each step company: they emerge from behind
         * the phone into the stage's top/bottom bands (see SideArt). Desktop only. */}
        {STEPS.flatMap((s, i) =>
          s.art.map((id, j) => (
            <SideArt
              key={id}
              artwork={artworkById(id)}
              index={i}
              slot={SIDE_SLOTS[i * 4 + j]}
              screen={screen}
              progress={scrollYProgress}
              stage={stage}
              reduce={reduce}
            />
          )),
        )}
        <div className="relative flex w-full max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
          {/* Copy. Wide screens: a three-column grid — steps 1 and 3 read on the
           * left of the phone, step 2 on the right — with both side columns always
           * present so the phone never jumps. Phones: all copy under the device. */}
          <div className="relative order-2 h-[15rem] w-full max-w-sm text-center sm:hidden">
            {STEPS.map((s, i) => (
              <StepCopy key={s.id} step={s} index={i} screen={screen} reduce={reduce} />
            ))}
            <StepDots step={step} className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2" />
          </div>
          <div data-copy className="relative hidden h-[18rem] w-[34%] text-left sm:block">
            <StepCopy step={STEPS[0]} index={0} screen={screen} reduce={reduce} />
            <StepCopy step={STEPS[2]} index={2} screen={screen} reduce={reduce} />
            <StepDots step={step} className="absolute -bottom-2 left-0 flex gap-2" />
          </div>

          <div className="relative order-1 flex items-center gap-5 sm:order-none">
            <motion.div data-phone style={{ rotateY, scale: phoneScale, transformPerspective: 1400, zIndex: 10 }} className="relative shrink-0">
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

          <div data-copy className="relative hidden h-[18rem] w-[34%] text-left sm:block">
            <StepCopy step={STEPS[1]} index={1} screen={screen} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}
