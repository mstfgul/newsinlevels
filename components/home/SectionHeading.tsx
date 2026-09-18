"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Kicker in mono, title in Instrument Serif, an optional lede. The title is
 * "spoken" word by word as the section scrolls into view (the same beat as
 * the story's epigraphs); under reduced motion it simply appears.
 */
export function SectionHeading({
  kicker,
  title,
  children,
  align = "center",
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  const reduce = useReducedMotion() ?? false;
  const centered = align === "center";
  const words = typeof title === "string" ? title.split(" ") : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className={`mx-auto max-w-3xl ${centered ? "text-center" : ""}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
      <h2 className="editorial mt-3 text-[clamp(2rem,4.6vw,3.25rem)]">
        {words
          ? words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.36, ease: [0.22, 0.9, 0.24, 1], delay: reduce ? 0 : 0.15 + i * 0.06 }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            ))
          : title}
      </h2>
      {children && (
        <p className={`mt-4 text-[17px] leading-relaxed text-muted-foreground ${centered ? "mx-auto" : ""} max-w-2xl`}>
          {children}
        </p>
      )}
    </motion.div>
  );
}
