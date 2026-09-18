"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * One switch for every motion/react animation on the site: with
 * reducedMotion="user", visitors who asked their OS for less motion get
 * opacity-only transitions — no transforms, no parallax — matching the CSS
 * `prefers-reduced-motion` rules in globals.css.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
