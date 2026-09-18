/**
 * The "tap any word" demo — the English sentence from the app's onboarding
 * (Features/Onboarding/DemoGlossary.swift, ST-42B/ST-95A) with every word
 * hand-translated into the other 14 dictionary languages. Ported verbatim;
 * keys are the app's `Glossary.normalize` form (lowercase, no edge
 * punctuation). Content, not UI copy: it is never localised.
 */
export const DEMO_SOURCE_LANGUAGE = "en";
export const DEMO_SENTENCE = "The city sleeps beside its river.";

export const DEMO_TRANSLATIONS: Record<string, Record<string, string>> = {
  the: {
    tr: "belirli tanımlık", de: "der/die/das", fr: "le/la", it: "il/la", es: "el/la", nl: "de/het",
    pt: "o/a (artigo)", ru: "определённый артикль", pl: "rodzajnik określony", uk: "означений артикль",
    ar: "أداة التعريف", "zh-Hans": "定冠词", ja: "定冠詞", ko: "정관사",
  },
  city: {
    tr: "şehir", de: "die Stadt", fr: "la ville", it: "la città", es: "la ciudad", nl: "de stad",
    pt: "a cidade", ru: "город", pl: "miasto", uk: "місто",
    ar: "المدينة", "zh-Hans": "城市", ja: "都市", ko: "도시",
  },
  sleeps: {
    tr: "uyur", de: "schläft", fr: "dort", it: "dorme", es: "duerme", nl: "slaapt",
    pt: "dorme", ru: "спит", pl: "śpi", uk: "спить",
    ar: "ينام", "zh-Hans": "睡觉", ja: "眠る", ko: "잔다",
  },
  beside: {
    tr: "yanında", de: "neben", fr: "près de", it: "accanto a", es: "junto a", nl: "naast",
    pt: "ao lado de", ru: "рядом с", pl: "obok", uk: "поруч із",
    ar: "بجانب", "zh-Hans": "在…旁边", ja: "〜のそばに", ko: "옆에",
  },
  its: {
    tr: "onun", de: "sein/ihr", fr: "son/sa", it: "suo/sua", es: "su", nl: "zijn/haar",
    pt: "seu/sua", ru: "его/её", pl: "jego/jej", uk: "його/її",
    ar: "ـه / ـها", "zh-Hans": "它的", ja: "その", ko: "그것의",
  },
  river: {
    tr: "nehir", de: "der Fluss", fr: "la rivière", it: "il fiume", es: "el río", nl: "de rivier",
    pt: "o rio", ru: "река", pl: "rzeka", uk: "річка",
    ar: "النهر", "zh-Hans": "河流", ja: "川", ko: "강",
  },
};

/** The app's normalize(): lowercase, strip leading/trailing punctuation. */
export const normalizeWord = (raw: string) =>
  raw.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export interface DemoToken {
  /** Display text, punctuation kept. */
  text: string;
  key: string;
}

export const demoTokens = (): DemoToken[] =>
  DEMO_SENTENCE.split(" ").map((text) => ({ text, key: normalizeWord(text) }));

export const demoMeaning = (key: string, lang: string): string | undefined =>
  DEMO_TRANSLATIONS[key]?.[lang];
