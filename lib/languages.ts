/**
 * The app's languages, for the homepage demos and the marquee.
 *
 * Seven reading languages (content, UI) and eight dictionary-only languages
 * (the target of word/sentence translation, via Apple's on-device
 * Translation in the app — ST-95). Endonyms mirror the app's
 * `DictionaryLanguage.endonym`; `rtl` mirrors `isRTL`.
 */
export interface LanguageInfo {
  code: string;
  endonym: string;
  english: string;
  rtl?: boolean;
}

export const READING_LANGUAGES: readonly LanguageInfo[] = [
  { code: "tr", endonym: "Türkçe", english: "Turkish" },
  { code: "en", endonym: "English", english: "English" },
  { code: "fr", endonym: "Français", english: "French" },
  { code: "it", endonym: "Italiano", english: "Italian" },
  { code: "es", endonym: "Español", english: "Spanish" },
  { code: "de", endonym: "Deutsch", english: "German" },
  { code: "nl", endonym: "Nederlands", english: "Dutch" },
];

export const DICTIONARY_ONLY_LANGUAGES: readonly LanguageInfo[] = [
  { code: "pt", endonym: "Português", english: "Portuguese" },
  { code: "ru", endonym: "Русский", english: "Russian" },
  { code: "pl", endonym: "Polski", english: "Polish" },
  { code: "uk", endonym: "Українська", english: "Ukrainian" },
  { code: "ar", endonym: "العربية", english: "Arabic", rtl: true },
  { code: "zh-Hans", endonym: "简体中文", english: "Chinese (Simplified)" },
  { code: "ja", endonym: "日本語", english: "Japanese" },
  { code: "ko", endonym: "한국어", english: "Korean" },
];

export const DICTIONARY_LANGUAGES: readonly LanguageInfo[] = [
  ...READING_LANGUAGES,
  ...DICTIONARY_ONLY_LANGUAGES,
];

export const languageByCode = (code: string): LanguageInfo | undefined =>
  DICTIONARY_LANGUAGES.find((l) => l.code === code);

/** Best dictionary language for a browser locale, or undefined. */
export function matchBrowserLanguage(locale: string | undefined): string | undefined {
  if (!locale) return undefined;
  const lower = locale.toLowerCase();
  if (lower.startsWith("zh")) return "zh-Hans";
  const primary = lower.split("-")[0];
  return DICTIONARY_LANGUAGES.find((l) => l.code === primary)?.code;
}
