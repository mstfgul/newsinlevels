/**
 * Tap-to-translate glossaries. For every non-English article we build a
 * compact { word: English translation } map so the reader can show a word's
 * meaning instantly, offline, without a live dictionary call.
 *
 * A shared, growing cache per reading language (data/glossary/<lang>.json)
 * means each word is translated by the model only once, ever — after the first
 * weeks the common vocabulary is all cached and the daily translation cost is
 * near zero. English text gets no glossary (nothing to translate into English);
 * the reader falls back to Wiktionary for those, and for any word not cached.
 */
import fs from "node:fs";
import path from "node:path";
import { LANGUAGES, FAST_MODEL } from "./leveler.mjs";

const GLOSSARY_DIR = path.join(import.meta.dirname, "..", "data", "glossary");

// A word token: letters (with accents/combining marks), allowing internal
// apostrophes/hyphens (l'école, week-end). Numbers and punctuation are skipped.
const WORD_RE = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu;

// MUST match lib/dictionary.ts cleanWord() exactly, so a glossary key lines up
// with what the reader looks up: strip edge non-letters, a leading elided
// article (l'/d'/qu'…) and a trailing English possessive, then lowercase.
function cleanWord(raw) {
  return raw
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .replace(/^(?:l|d|j|s|n|m|t|c|qu)['’](?=\p{L})/iu, "")
    .replace(/['’]s$/iu, "")
    .toLocaleLowerCase();
}

/** Unique, cleaned content words in a text (length > 1). */
export function tokenizeUnique(text) {
  const out = new Set();
  for (const match of text.matchAll(WORD_RE)) {
    const word = cleanWord(match[0]);
    if (word.length > 1) out.add(word);
  }
  return [...out];
}

function cacheFile(langCode) {
  return path.join(GLOSSARY_DIR, `${langCode}.json`);
}

export function loadCache(langCode) {
  const file = cacheFile(langCode);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
}

export function saveCache(langCode, cache) {
  fs.mkdirSync(GLOSSARY_DIR, { recursive: true });
  // Sorted keys keep the diff readable as the shared dictionary grows.
  const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(cacheFile(langCode), JSON.stringify(sorted, null, 2) + "\n");
}

/**
 * Translate a batch of words from one language into English. Returns a
 * { word: translation } object; words the model omits are simply left out.
 */
async function translateBatch(openai, words, langName) {
  const prompt = `Translate each of these ${langName} words into English for a language learner. Give ONE short, natural translation per word — the most common everyday meaning, in dictionary form (e.g. a verb as "to run", a noun as the bare noun). Keep proper nouns as they are. Do not add notes or alternatives.

Return a JSON object mapping each input word (exactly as given) to its English translation.

WORDS: ${words.join(", ")}`;

  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    const out = {};
    for (const [word, gloss] of Object.entries(parsed)) {
      if (typeof gloss === "string" && gloss.trim()) {
        out[word.toLocaleLowerCase()] = gloss.trim();
      }
    }
    return out;
  } catch {
    return {};
  }
}

const BATCH = 120;

/**
 * Build a { word: English } glossary for one text in one language, translating
 * only the words not already in the shared cache and appending the new ones.
 * Returns the subset of the cache covering the words that appear in this text.
 */
export async function buildGlossary(openai, text, langCode) {
  if (langCode === "en") return {};
  const langName = LANGUAGES[langCode];
  const words = tokenizeUnique(text);

  const cache = loadCache(langCode);
  const missing = words.filter((word) => !(word in cache));

  if (missing.length) {
    for (let i = 0; i < missing.length; i += BATCH) {
      const batch = missing.slice(i, i + BATCH);
      Object.assign(cache, await translateBatch(openai, batch, langName));
    }
    saveCache(langCode, cache);
  }

  const glossary = {};
  for (const word of words) {
    if (cache[word]) glossary[word] = cache[word];
  }
  return glossary;
}

/**
 * Attach a per-language glossary to an article, built from every level's text
 * combined (words repeat across levels, so one map per language covers them
 * all). Mutates and returns the article. No-op for an article with only
 * English.
 */
export async function attachGlossaries(openai, article) {
  const glossary = {};
  // Only the languages the site actually serves (LANGUAGES), never English and
  // never stray legacy editions like the retired Turkish (tr) data still
  // sitting in some old articles — translating those would be wasted cost.
  for (const langCode of Object.keys(LANGUAGES)) {
    if (langCode === "en") continue;
    const versions = article.languages[langCode];
    if (!versions) continue;
    const text = Object.values(versions)
      .map((v) => `${v.title}\n${v.text}`)
      .join("\n");
    const map = await buildGlossary(openai, text, langCode);
    if (Object.keys(map).length) glossary[langCode] = map;
  }
  if (Object.keys(glossary).length) article.glossary = glossary;
  return article;
}
