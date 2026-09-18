"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Clipping } from "@/components/Clipping";
import { ArtViewer } from "@/components/home/ArtViewer";
import { SectionHeading } from "@/components/home/SectionHeading";
import { artworkAlt, artworkById, artworkSrc, artworkSrcSet, type Artwork } from "@/lib/gallery";

/**
 * "Every day, ten kinds of text" — one tile per kind the app publishes
 * daily, each carrying a work from the gallery (the kinds' own subjects:
 * a painting for art, a film still for film, a reader for word…). Tiles
 * write themselves in with the settle stagger as the grid scrolls into
 * view; a click opens the artwork in the viewer.
 */
const KINDS: { kind: string; artwork: string; body: string }[] = [
  { kind: "art", artwork: "the-scream", body: "A painting a day, from the Met to the Rijksmuseum — and the story behind it." },
  { kind: "film", artwork: "great-train-robbery", body: "A film from a century of cinema, and a director worth remembering." },
  { kind: "book", artwork: "dante-michelino", body: "A classic introduced — plus a library of whole novels, rewritten at every level." },
  { kind: "quote", artwork: "proust-portrait", body: "A line worth keeping, and the person who said it." },
  { kind: "essay", artwork: "school-of-athens", body: "An essay on one question — art, science, society — written at your level." },
  { kind: "culture", artwork: "winter-skaters", body: "Something the country of your language is known for, explained." },
  { kind: "story", artwork: "rousseau-tiger", body: "A short story, complete, at your level." },
  { kind: "word", artwork: "young-girl-reading", body: "One word a day, explained the way a good teacher would." },
  { kind: "history", artwork: "hunters-in-snow", body: "What happened on this day, told simply." },
  { kind: "news", artwork: "paris-rainy-day", body: "Today's news from six BBC sections, in one digest." },
];

export function KindsGrid() {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading kicker="art first" title="Then film, books, stories — and more.">
        Not a course: a curated daily selection of real culture. Each piece rewritten for your
        level, every word a tap away — learn the language and the art at once.
      </SectionHeading>

      <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {KINDS.map(({ kind, artwork: id, body }, i) => {
          const a = artworkById(id);
          return (
            <motion.li
              key={kind}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: (i % 5) * 0.06 }}
              className="group"
            >
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                aria-label={`${kind}: ${artworkAlt(a)} — open`}
              >
                <motion.div
                  layoutId={`kind-${a.id}`}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                >
                  <Clipping
                    src={artworkSrc(a, 640)}
                    srcSet={artworkSrcSet(a)}
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                    alt=""
                    width={a.w640}
                    height={a.h640}
                    aspect="4/3"
                    variant="frame"
                  />
                </motion.div>
              </button>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-margin-red">{kind}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
            </motion.li>
          );
        })}
      </ul>

      <ArtViewer artwork={selected} layoutPrefix="kind" onClose={close} />
    </section>
  );
}
