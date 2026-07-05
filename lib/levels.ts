import type { Level } from "./types";

export const LEVEL_COLORS: Record<Level, string> = {
  A1: "var(--level-a1)",
  A2: "var(--level-a2)",
  B1: "var(--level-b1)",
  B2: "var(--level-b2)",
  C1: "var(--level-c1)",
  C2: "var(--level-c2)",
};

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper intermediate",
  C1: "Advanced",
  C2: "Mastery",
};
