"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { artworkById, artworkSrc } from "@/lib/gallery";

/**
 * A faint contact sheet of gallery works behind the story — the desk under
 * the letter. Fixed, non-interactive, very low opacity (a little stronger
 * at night, where paper texture is gone). It slides up at a tenth of the
 * scroll and grows a touch over the whole read, so the page seems to float
 * over it, and the sheet inside drifts sideways on its own, very slowly
 * (globals.css `.backdrop-drift` — on an inner element, so the CSS animation
 * never overrides the scroll-driven transform). The works are the story's
 * own six plus six more, so most tiles reuse images the page already loads.
 */
const IDS = [
  "dante-michelino", "woman-reading-letter", "starry-night", "proust-portrait",
  "school-of-athens", "almond-blossom", "the-kiss", "great-wave", "milkmaid", "young-girl-reading",
  "wanderer-fog", "birth-of-venus",
];

export function StoryBackdrop() {
  const reduce = useReducedMotion() ?? false;
  const { scrollY, scrollYProgress } = useScroll();
  const y = useTransform(scrollY, (v) => (reduce ? 0 : -v * 0.1));
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.08]);
  const tiles = Array.from({ length: 24 }, (_, i) => artworkById(IDS[i % IDS.length]));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y, scale }} className="origin-center">
        <div className="backdrop-drift grid grid-cols-3 gap-2 opacity-[0.09] dark:opacity-[0.14] sm:grid-cols-4 lg:grid-cols-6">
          {tiles.map((a, i) => (
            <img key={i} src={artworkSrc(a, 640)} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
