export type LegalLang = "tr" | "en" | "fr" | "it" | "es" | "de" | "nl";

export const LEGAL_LANGUAGES: readonly LegalLang[] = [
  "tr",
  "en",
  "fr",
  "it",
  "es",
  "de",
  "nl",
];

export interface LegalSection {
  heading: string;
  body: string[]; // one string per paragraph
}

export interface LegalPageCopy {
  title: string;
  intro: string;
  sections: LegalSection[];
}
