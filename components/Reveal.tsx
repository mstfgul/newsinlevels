"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * In-view entrance: the element rises 24px and fades in with the settle
 * spring the first time it scrolls into view. `tilt` adds a temporary
 * entrance rotation that lands on 0 (the app's `entranceTiltDegrees`);
 * the element's own resting tilt, if any, lives in CSS underneath.
 * Reduced motion → opacity only (MotionConfig).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  tilt = 0,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  tilt?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
    >
      {children}
    </motion.div>
  );
}
