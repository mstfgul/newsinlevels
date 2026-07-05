export const LANGUAGES = ["en", "de", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

export interface VocabularyItem {
  word: string;
  definition: string;
}

export interface LeveledText {
  title: string;
  text: string;
  vocabulary: VocabularyItem[];
}

export type LanguageVersions = Record<Level, LeveledText>;

export interface Article {
  id: string;
  date: string; // YYYY-MM-DD
  source: { name: string; url: string };
  originalTitle: string;
  image?: string;
  languages: Record<Language, LanguageVersions>;
}

export interface IndexEntry {
  id: string;
  date: string;
  source: string;
  titles: Record<Language, string>; // B1 title per language, used on cards
}
