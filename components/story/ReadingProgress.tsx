"use client";

import { motion, useScroll } from "motion/react";

/** The teacher's red pen drawing a line across the top of the page as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-margin-red"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
