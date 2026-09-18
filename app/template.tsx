"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Route transition. A template remounts on every navigation (unlike the
 * layout), so this entrance runs each time the reader moves between pages:
 * the new page rises 12px and fades in over the `page` beat. Exit animations
 * are deliberately not attempted — App Router swaps the tree before an exit
 * could play — and Next's experimental viewTransition flag is not used.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 0.9, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
