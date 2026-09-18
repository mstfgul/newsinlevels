"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Clipping } from "@/components/Clipping";
import { artworkAlt, artworkSrc, artworkSrcSet, type Artwork } from "@/lib/gallery";

/**
 * A clipping pinned beside the story's prose (ST-104). It fans in from its
 * own side of the page as it scrolls into view (a temporary tilt that lands
 * on 0 — the resting tilt is the Clipping's), drifts a little slower than
 * the text (depth-scaled parallax, element-relative so it works anywhere
 * down the page), lifts under the pointer, and opens in the ArtViewer on a
 * click. Under reduced motion it simply fades in and stays put.
 */
export function StoryClipping({
  artwork,
  caption,
  rotate,
  side,
  depth = 1,
  className = "",
  onOpen,
}: {
  artwork: Artwork;
  caption: string;
  rotate: number;
  side: "left" | "right";
  depth?: 0 | 1 | 2;
  className?: string;
  onOpen: (a: Artwork) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22 + depth * 14, -(22 + depth * 14)]);
  const dir = side === "left" ? -1 : 1;

  return (
    <motion.div ref={ref} data-story-clipping style={{ y }} className={className}>
      <motion.div
        initial={{ opacity: 0, x: dir * 56, rotate: dir * 5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -6, scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 26 } }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
      >
        <button
          type="button"
          onClick={() => onOpen(artwork)}
          className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          aria-label={`${artworkAlt(artwork)} — open`}
        >
          <motion.div layoutId={`story-${artwork.id}`} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
            <Clipping
              src={artworkSrc(artwork, 640)}
              srcSet={artworkSrcSet(artwork)}
              sizes="(min-width: 640px) 15rem, 13rem"
              alt=""
              width={artwork.w640}
              height={artwork.h640}
              rotate={rotate}
              caption={caption}
              className="w-full"
            />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
