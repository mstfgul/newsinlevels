"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { artworkById, artworkSrc } from "@/lib/gallery";

/**
 * A faint contact sheet of gallery works behind the story — the desk under
 * the letter. Fixed, non-interactive, very low opacity (a little stronger
 * at night, where paper texture is gone), sliding up at a tenth of the
 * scroll so the page seems to float over it. The works are the story's own
 * six plus four more, so most tiles reuse images the page already loads.
 */
const IDS = [
  "dante-michelino", "woman-reading-letter", "starry-night", "proust-portrait",
  "school-of-athens", "almond-blossom", "the-kiss", "great-wave", "milkmaid", "young-girl-reading",
  "wanderer-fog", "birth-of-venus",
];

export function StoryBackdrop() {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => (reduce ? 0 : -v * 0.1));
  const tiles = Array.from({ length: 24 }, (_, i) => artworkById(IDS[i % IDS.length]));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y }} className="grid grid-cols-3 gap-2 opacity-[0.07] dark:opacity-[0.12] sm:grid-cols-4 lg:grid-cols-6">
        {tiles.map((a, i) => (
          <img key={i} src={artworkSrc(a, 640)} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
        ))}
      </motion.div>
    </div>
  );
}
