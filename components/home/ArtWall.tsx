"use client";

import { useCallback, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Clipping } from "@/components/Clipping";
import { ArtViewer } from "@/components/home/ArtViewer";
import { artworkAlt, artworkSrc, artworkSrcSet, type Artwork } from "@/lib/gallery";

/**
 * The wall of art along the bottom of the hero — DailyArt's opening move,
 * done with the desk's own vocabulary: by day ten taped clippings, each at
 * its own tilt, overlapping the way things pile up on a desk; by night the
 * same ten hang flat on the black gallery wall (globals.css strips the tape).
 *
 * Motion, in order of appearance:
 *   1. Entrance — each clipping rises with the onboardingEnter spring, one
 *      every 90 ms, with a temporary ±1.1° tilt that settles to 0 (the app's
 *      `entranceTiltDegrees`); the resting tilt is the Clipping's own.
 *   2. Parallax — as the hero scrolls away the wall drifts down slower than
 *      the page and fans outward from the centre (measured from DailyArt:
 *      ~12% lag, ±30px spread at 400px). Front tiles travel further than
 *      back ones, which is what makes it read as depth.
 *   3. Hover — the clipping lifts and its caption appears.
 *   4. Click — it grows into the full-screen ArtViewer (shared layoutId).
 * Under reduced motion MotionConfig turns 1–3 into opacity only.
 */

const SLOTS = [
  { left: -3, width: 16, bottom: 18, depth: 1 },
  { left: 9, width: 12, bottom: 44, depth: 2 },
  { left: 17, width: 20, bottom: 6, depth: 0 },
  { left: 31, width: 14, bottom: 48, depth: 2 },
  { left: 40, width: 19, bottom: 0, depth: 0 },
  { left: 53, width: 16, bottom: 36, depth: 1 },
  { left: 62, width: 20, bottom: 4, depth: 0 },
  { left: 75, width: 12, bottom: 50, depth: 2 },
  { left: 83, width: 17, bottom: 14, depth: 1 },
  { left: 94, width: 13, bottom: 40, depth: 2 },
] as const;

const ENTER = { type: "spring", stiffness: 260, damping: 18 } as const;

function WallTile({
  artwork,
  index,
  progress,
  slot,
  onSelect,
  className = "",
  parallax,
}: {
  artwork: Artwork;
  index: number;
  progress: MotionValue<number>;
  slot?: (typeof SLOTS)[number];
  onSelect: (a: Artwork) => void;
  className?: string;
  parallax: boolean;
}) {
  const depth = slot?.depth ?? 1;
  const centre = slot ? (slot.left + slot.width / 2 - 50) / 50 : 0; // −1 … 1
  // Page scroll in px → drift. The wall sits in the first viewport, so the
  // drift starts from the very first scrolled pixel (as DailyArt's does) and
  // is complete once the reader has moved 600px down.
  const y = useTransform(progress, [0, 600], [0, parallax ? 30 + (2 - depth) * 25 : 0]);
  const x = useTransform(progress, [0, 600], [0, parallax ? centre * 36 : 0]);
  const zIndex = 30 - depth * 10;

  return (
    <motion.div
      className={`group ${className}`}
      style={
        slot
          ? { position: "absolute", left: `${slot.left}%`, width: `${slot.width}%`, bottom: `${slot.bottom}%`, zIndex, x, y }
          : { zIndex, x, y }
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 48, rotate: (index % 2 ? 1 : -1) * 1.1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ ...ENTER, delay: 0.2 + index * 0.09 }}
        whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 380, damping: 26 } }}
      >
        <button
          type="button"
          onClick={() => onSelect(artwork)}
          className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          aria-label={`${artworkAlt(artwork)} — open`}
        >
          <motion.div layoutId={`wall-${artwork.id}`} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
            <Clipping
              src={artworkSrc(artwork, 640)}
              srcSet={artworkSrcSet(artwork)}
              sizes="(min-width: 640px) 16vw, 30vw"
              alt=""
              width={artwork.w640}
              height={artwork.h640}
              rotate={artwork.tilt}
              priority={index < 3}
            />
          </motion.div>
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground opacity-0 transition-opacity duration-[var(--m-swift)] group-hover:opacity-100"
        >
          {artwork.artist} · {artwork.year}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function ArtWall({ artworks }: { artworks: Artwork[] }) {
  const { scrollY } = useScroll();
  const [selected, setSelected] = useState<Artwork | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const desktop = artworks.slice(0, SLOTS.length);
  const mobile = artworks.slice(0, 6);

  return (
    <div>
      {/* Desktop: the fanned pile, absolutely placed along the bottom edge. */}
      <div className="relative mx-auto hidden h-[38vw] max-h-[480px] min-h-[320px] w-full max-w-[1400px] sm:block">
        {desktop.map((a, i) => (
          <WallTile key={a.id} artwork={a} index={i} slot={SLOTS[i]} progress={scrollY} onSelect={setSelected} parallax />
        ))}
      </div>
      {/* Phones: two rows of three, still tilted, no parallax. */}
      <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-6 px-3 sm:hidden">
        {mobile.map((a, i) => (
          <WallTile
            key={a.id}
            artwork={a}
            index={i}
            progress={scrollY}
            onSelect={setSelected}
            parallax={false}
            className="w-[27%]"
          />
        ))}
      </div>
      <ArtViewer artwork={selected} layoutPrefix="wall" onClose={close} />
    </div>
  );
}
