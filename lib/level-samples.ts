/**
 * "One text, six levels" — the English row of the app's onboarding samples
 * (Features/Onboarding/LevelSamples.swift): the same idea at every CEFR
 * level, each with the one word the highlighter lands on. Content, never
 * localised.
 */
export type Level = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface LevelSample {
  level: Level;
  label: string;
  name: string;
  text: string;
  focus: string;
  /** A1/A2 read on wider ruling with bigger type (the app's readEasy). */
  easy: boolean;
}

export const LEVEL_SAMPLES: readonly LevelSample[] = [
  { level: "a1", label: "A1", name: "Beginner", text: "The city has a river.", focus: "river", easy: true },
  { level: "a2", label: "A2", name: "Elementary", text: "The city is cleaning its river.", focus: "cleaning", easy: true },
  { level: "b1", label: "B1", name: "Intermediate", text: "For twenty years, the city has been bringing its rivers back.", focus: "rivers", easy: false },
  { level: "b2", label: "B2", name: "Upper intermediate", text: "The city has turned its polluted rivers into lively public spaces.", focus: "polluted", easy: false },
  { level: "c1", label: "C1", name: "Advanced", text: "What was once an open sewer has become the city's quiet pride.", focus: "sewer", easy: false },
  { level: "c2", label: "C2", name: "Mastery", text: "A city reconciled with its rivers no longer seems fanciful.", focus: "reconciled", easy: false },
];

export const levelColor = (level: Level) => `var(--level-${level})`;

/** Splits a sample into [before, focus, after] so the focus word can be marked. */
export function splitFocus(sample: LevelSample): [string, string, string] {
  const i = sample.text.indexOf(sample.focus);
  if (i < 0) return [sample.text, "", ""];
  return [sample.text.slice(0, i), sample.focus, sample.text.slice(i + sample.focus.length)];
}
