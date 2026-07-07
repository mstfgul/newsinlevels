export const LANGUAGES = ["en", "de", "fr", "es"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof LEVELS)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export const CATEGORIES = [
  "politics",
  "business",
  "science",
  "tech",
  "climate",
  "culture",
  "sport",
  "health",
  "world",
] as const;
export type Category = (typeof CATEGORIES)[number];

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
  category?: Category | "art" | "history" | "quote" | "film" | "book";
  // Present on gallery entries: the artwork behind the analysis.
  art?: { artist: string; title: string; year: string; medium: string };
  // Present on on-this-day capsules: the year the event happened.
  history?: { year: number };
  // Present on quote-of-the-day entries: the author and original wording.
  quote?: { author: string; text: string };
  // Present on film-club entries: the film behind the essay.
  film?: { director: string; title: string; year: string; genres: string };
  // Present on book-club entries: the book behind the introduction.
  book?: { author: string; title: string; year: string };
  // Older articles may lack recently added languages — resolve with a fallback.
  languages: Partial<Record<Language, LanguageVersions>> &
    Record<"en", LanguageVersions>;
}

export interface IndexEntry {
  id: string;
  date: string;
  source: string;
  image?: string;
  category?: Category;
  // B1 title per language, used on cards; English is always present.
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

export interface ArtIndexEntry {
  id: string;
  date: string;
  artist: string;
  image: string;
  // B1 title per language; English is always present.
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

export interface HistoryIndexEntry {
  id: string;
  date: string;
  year: number;
  image?: string;
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

export interface QuoteIndexEntry {
  id: string;
  date: string;
  author: string;
  image?: string;
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

export interface FilmIndexEntry {
  id: string;
  date: string;
  director: string;
  image: string;
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

export interface BookIndexEntry {
  id: string;
  date: string;
  author: string;
  image: string;
  titles: Partial<Record<Language, string>> & Record<"en", string>;
}

/** The requested language if the article has it, otherwise English. */
export function resolveLanguage(
  languages: Article["languages"],
  preferred: Language,
): Language {
  return languages[preferred] ? preferred : "en";
}
