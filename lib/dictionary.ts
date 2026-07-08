"use client";

import type { Language } from "./types";

export interface DictExample {
  example: string;
  translation?: string;
}

export interface DictSense {
  definition: string;
  examples: DictExample[];
}

export interface DictEntry {
  partOfSpeech: string;
  language: string;
  senses: DictSense[];
}

export interface DictResult {
  /** The Wiktionary page that resolved (may be the lowercased form). */
  term: string;
  entries: DictEntry[];
  /** When the word is an inflection ("plural of wave"), the base form's
   * own entry, so the actual meaning is one tap away. */
  lemma?: { term: string; entries: DictEntry[] };
}

/** Languages the tap-to-define feature is enabled for. */
export const LOOKUP_LANGUAGES: readonly Language[] = ["en", "de", "fr", "es"];

interface RawDefinition {
  definition: string;
  parsedExamples?: { example: string; translation?: string }[];
}

interface RawEntry {
  partOfSpeech: string;
  language: string;
  definitions: RawDefinition[];
}

const memory = new Map<string, DictResult | null>();

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** `«Maison»,` → `Maison`; `l'école` → `école`; `dog's` → `dog` */
export function cleanWord(raw: string): string {
  return raw
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .replace(/^(?:l|d|j|s|n|m|t|c|qu)['’](?=\p{L})/iu, "")
    .replace(/['’]s$/iu, "");
}

// Definitions carrying one of these usage labels are technically correct
// but rarely what a learner is looking for — pushed to the end of their
// entry's sense list rather than dropped, so they're still reachable.
const DEPRIORITIZED_LABEL = /^\([^)]*\b(archaic|obsolete|dialectal|dated|rare|regional)\b[^)]*\)/i;

function isDeprioritized(definition: string): boolean {
  return DEPRIORITIZED_LABEL.test(definition.trim());
}

function parseEntries(
  data: Record<string, RawEntry[]>,
  lang: Language,
): DictEntry[] | null {
  // Only the section for the word's actual language — no cross-language
  // fallback. A silently-wrong-language definition (e.g. an English sense
  // shown for a German word just because no German section existed) is
  // more confusing than a plain "not found".
  const sections = data[lang];
  if (!sections) return null;
  const entries = sections
    .map((section) => ({
      partOfSpeech: section.partOfSpeech,
      language: section.language,
      senses: section.definitions
        .map((d) => ({
          definition: stripHtml(d.definition),
          examples: (d.parsedExamples ?? [])
            .map((e) => ({
              example: stripHtml(e.example),
              translation: e.translation ? stripHtml(e.translation) : undefined,
            }))
            .filter((e) => e.example),
        }))
        .filter((sense) => sense.definition)
        // Stable sort: keeps relative order, just moves archaic/rare/etc.
        // senses (if any) to the end instead of possibly showing first.
        .sort((a, b) => Number(isDeprioritized(a.definition)) - Number(isDeprioritized(b.definition))),
    }))
    .filter((entry) => entry.senses.length > 0);
  return entries.length > 0 ? entries : null;
}

async function fetchEntries(
  term: string,
  lang: Language,
): Promise<DictEntry[] | null> {
  const res = await fetch(
    `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(term)}`,
    { headers: { Accept: "application/json" } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Wiktionary ${res.status}`);
  return parseEntries((await res.json()) as Record<string, RawEntry[]>, lang);
}

/**
 * A last-resort guess at an inflected word's base form for French/Spanish,
 * tried only after the exact and lowercased forms both miss — Wiktionary's
 * coverage of inflected forms (plurals, conjugations) is spottier for these
 * than for English/German, so this cuts down on avoidable "not found"s for
 * common regular patterns. Wrong guesses just 404 and are ignored; this
 * never overrides a real hit.
 */
function guessInflectionVariants(word: string, lang: Language): string[] {
  if (lang !== "fr" && lang !== "es") return [];
  const guesses: string[] = [];
  if (word.length > 4 && /es$/i.test(word)) guesses.push(word.slice(0, -2));
  if (word.length > 3 && /s$/i.test(word)) guesses.push(word.slice(0, -1));
  return guesses;
}

/** `plural of wave` → `wave`; `third-person singular present of laufen 'to
 * run'` → `laufen`. Null when the definition is not a form-of note. */
function formOfTarget(definition: string): string | null {
  if (definition.length > 90) return null;
  const match = definition.match(
    /\b(?:plural|singular|participle|preterite|past|present|infinitive|imperative|subjunctive|indicative|gerund|comparative|superlative|diminutive|inflection|feminine|masculine|neuter|nominative|genitive|dative|accusative|alternative (?:form|spelling)) of ([\p{L}\p{M}'’-]+)/iu,
  );
  return match ? match[1] : null;
}

/**
 * Look a word up on Wiktionary, trying the exact form first, the lowercased
 * form second (sentence-start capitals), then — for French/Spanish only —
 * a couple of guessed base forms if both miss. Results — including misses
 * — are cached in memory and localStorage; network errors are not.
 */
export async function lookupWord(
  raw: string,
  lang: Language,
): Promise<DictResult | null> {
  const word = cleanWord(raw);
  if (!word) return null;

  const key = `${lang}:${word}`;
  if (memory.has(key)) return memory.get(key)!;

  const storageKey = `dict:v3:${key}`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached !== null) {
      const parsed = JSON.parse(cached) as DictResult | null;
      memory.set(key, parsed);
      return parsed;
    }
  } catch {
    // Unreadable cache entry — fall through to the network.
  }

  // Sentence-start capitals usually hide an ordinary word ("Waves" the
  // town vs "waves"), so try lowercase first — except in German, where
  // capitalization is meaningful for nouns.
  const lower = word.toLocaleLowerCase();
  const attempts = [
    ...(lower === word ? [word] : lang === "de" ? [word, lower] : [lower, word]),
    ...guessInflectionVariants(lower, lang),
  ];

  let result: DictResult | null = null;
  for (const term of attempts) {
    const entries = await fetchEntries(term, lang);
    if (entries) {
      result = { term, entries };
      break;
    }
  }

  // "waves → plural of wave" alone doesn't teach the meaning; follow the
  // pointer once and carry the base form's entry along.
  if (result) {
    const target = formOfTarget(result.entries[0].senses[0].definition);
    if (target && target.toLocaleLowerCase() !== result.term.toLocaleLowerCase()) {
      try {
        const lemmaEntries = await fetchEntries(target, lang);
        if (lemmaEntries) {
          result = { ...result, lemma: { term: target, entries: lemmaEntries } };
        }
      } catch {
        // The inflection note is still worth showing on its own.
      }
    }
  }

  memory.set(key, result);
  try {
    localStorage.setItem(storageKey, JSON.stringify(result));
  } catch {
    // Storage full or unavailable — the in-memory cache still applies.
  }
  return result;
}
