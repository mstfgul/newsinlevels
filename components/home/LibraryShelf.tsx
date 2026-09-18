"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { BrandMark } from "@/components/BrandMark";
import { bookCoverSrc, LIBRARY } from "@/lib/library";

/**
 * The Library shelf: the app's whole-novel titles standing on a shelf. Each
 * cover leans a few degrees on its axis (a real shelf never has every spine
 * flush), rises into place with the settle stagger, and straightens and
 * lifts under the pointer. Phones scroll the shelf sideways.
 */
export function LibraryShelf() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading kicker="the library" title="Whole novels, every chapter at six levels.">
        {LIBRARY.length} classics so far — Carroll, Fitzgerald, Dostoevsky, London, James, Maupassant —
        each chapter rewritten from A1 to C2, illustrations and all, the original a tap away. More
        titles arrive with every update.
      </SectionHeading>

      <div className="relative mx-auto mt-14 max-w-5xl">
        <ul
          className="flex items-end gap-5 overflow-x-auto px-6 pb-3 pt-6 [scrollbar-width:none] sm:justify-center sm:gap-7 sm:overflow-visible sm:px-2"
          style={{ perspective: "1600px" }}
        >
          {LIBRARY.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 36, rotateY: -14 }}
              whileInView={{ opacity: 1, y: 0, rotateY: i % 2 ? 7 : -7 }}
              viewport={{ once: true, amount: 0.4 }}
              whileHover={{ y: -14, rotateY: 0, scale: 1.05, transition: { type: "spring", stiffness: 380, damping: 24 } }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: i * 0.07 }}
              className="w-[124px] shrink-0 sm:w-[15%] sm:max-w-[150px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={bookCoverSrc(b)}
                alt={`${b.title} — ${b.author}`}
                width={b.width}
                height={b.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-[3px] border border-border bg-card"
                style={{ boxShadow: "0 18px 30px -14px var(--clipping-shadow), 0 2px 4px rgba(0,0,0,0.12)" }}
              />
              <p className="mt-3 text-[13px] font-semibold leading-tight" style={{ fontFamily: "var(--font-literata)" }}>
                {b.title}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {b.author} · {b.year}
              </p>
            </motion.li>
          ))}
        </ul>
        {/* The shelf itself: a plank with a shadow under its lip, the mark as a bookend. */}
        <div className="relative mx-2">
          <div aria-hidden className="h-2.5 rounded-sm bg-border shadow-[0_6px_14px_-4px_var(--clipping-shadow)]" />
          <BrandMark size={30} className="absolute -top-[30px] right-1 rotate-[8deg] opacity-90" />
        </div>
      </div>
    </section>
  );
}
