"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Clipping } from "@/components/Clipping";
import { TypedText } from "@/components/story/TypedText";
import { artworkAlt, artworkSrc, artworkSrcSet, type Artwork } from "@/lib/gallery";

/**
 * A clipping pinned beside the story's prose (ST-104, more motion in
 * ST-107). It fans in from its own side of the page as it scrolls into view
 * (a temporary tilt that lands on 0 — the resting tilt is the Clipping's),
 * drifts a little slower than the text (depth-scaled parallax) and turns a
 * few degrees as it travels up the page, like a paper nudged on a desk. Its
 * caption types itself once it is in view. Under a mouse it tilts toward the
 * cursor (a card lifted at one corner) and the photo eases in a little; a
 * click opens it in the ArtViewer. Reduced motion: fade in, stay put.
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
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dir = side === "left" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22 + depth * 14, -(22 + depth * 14)]);
  const turn = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [dir * 4, 0, -dir * 3]);

  // Pointer tilt (mouse only): the card lifts toward the cursor.
  const tiltX = useSpring(0, { stiffness: 260, damping: 22 });
  const tiltY = useSpring(0, { stiffness: 260, damping: 22 });
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
    tiltY.set(px * 9);
    tiltX.set(-py * 9);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    // `relative z-[1]`: the paragraphs are positioned (for their margin ticks) and
    // would otherwise paint over this float and swallow its hover and clicks.
    <motion.div ref={ref} data-story-clipping style={{ y, rotate: turn }} className={`relative z-[1] ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: dir * 56, rotate: dir * 5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -6, scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 26 } }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 800 }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <button
          type="button"
          onClick={() => onOpen(artwork)}
          className="group block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
              caption={<TypedText text={caption} start={inView} speed={22} />}
              zoomOnHover
              className="w-full"
            />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
