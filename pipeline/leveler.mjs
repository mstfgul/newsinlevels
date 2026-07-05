/**
 * Shared pieces of the news pipeline: language/level constants, the CEFR
 * leveling call and the category classifier. Used by fetch-news.mjs (daily
 * run) and backfill-language.mjs (one-off backfills).
 */
import fs from "node:fs";
import path from "node:path";

export const LANGUAGES = {
  en: "English",
  de: "German",
  fr: "French",
  tr: "Turkish",
};
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

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
];

export const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const LEVEL_SPECS = `
A1: 60-90 words. Present tense only. Very short sentences (max 8 words). Only the ~500 most common words of the language. No subordinate clauses.
A2: 90-130 words. Present and simple past. Short sentences (max 12 words). Common everyday vocabulary. Simple connectors (and, but, because).
B1: 130-180 words. Most common tenses. Some subordinate clauses. Everyday vocabulary plus common news words. Explain difficult concepts simply.
B2: 180-240 words. Full range of tenses, passive voice allowed. Complex sentences. Standard news vocabulary, some idioms.
C1: 220-300 words. Sophisticated structures, nuanced connectors, reported speech. Rich vocabulary, natural journalistic register.
C2: 250-350 words. Native-level journalistic prose. Idiomatic, precise, stylistically refined. May include irony, nuance, low-frequency vocabulary.`;

export function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

const SHARED_INSTRUCTIONS = (langName) => `
For every level also select 5-8 important words from YOUR text and define each one in simple ${langName} that a learner AT THAT LEVEL can understand (for A1/A2 keep definitions to a few very simple words).

Return JSON with exactly this shape:
{"A1":{"title":"...","text":"...","vocabulary":[{"word":"...","definition":"..."}]},"A2":{...},"B1":{...},"B2":{...},"C1":{...},"C2":{...}}`;

/**
 * Writes six CEFR versions of a text in one language.
 * kind "news":    rewrites a news article.
 * kind "art":     writes an analysis of a painting — pass options.imageUrl so
 *                 the model can actually look at it.
 * kind "history": writes a capsule about an on-this-day historical event.
 * kind "quote":   translates a quote (as the title) and explains it (as the
 *                 text) at each level.
 */
export async function generateLanguageVersions(
  openai,
  sourceTitle,
  sourceText,
  langCode,
  options = {},
) {
  const { kind = "news", imageUrl } = options;
  const langName = LANGUAGES[langCode];

  const SYSTEMS = {
    news: `You are an expert ${langName} teacher and news editor. You rewrite real news articles in ${langName} at all six CEFR levels so learners can read the same story at their own level. You always answer with valid JSON only.`,
    art: `You are an art historian and expert ${langName} teacher. You write engaging analyses of paintings in ${langName} at all six CEFR levels so learners can enjoy the same artwork at their own level. You always answer with valid JSON only.`,
    history: `You are a historian and expert ${langName} teacher. You write vivid capsules about historical events in ${langName} at all six CEFR levels so learners can read the same story at their own level. You always answer with valid JSON only.`,
    quote: `You are a literary translator and expert ${langName} teacher. You translate famous quotes into ${langName} and explain them at all six CEFR levels so learners can appreciate the same words at their own level. You always answer with valid JSON only.`,
  };

  const TASKS = {
    news: `Rewrite the news article below in ${langName} at each CEFR level. Follow these level constraints strictly:
${LEVEL_SPECS}

The story must stay factually identical to the source at every level — only language complexity changes.
${SHARED_INSTRUCTIONS(langName)}

SOURCE TITLE: ${sourceTitle}

SOURCE ARTICLE:
${sourceText}`,
    art: `Look carefully at the painting in the image and write an analysis of it in ${langName} at each CEFR level. Describe what the viewer actually sees — scene, colors, light, composition, brushwork — and weave in the artist and historical context using ONLY the facts provided below. Do not invent facts, dates or anecdotes. Follow these level constraints strictly:
${LEVEL_SPECS}
${SHARED_INSTRUCTIONS(langName)}

ARTWORK: ${sourceTitle}

FACTS:
${sourceText}`,
    history: `Write a vivid capsule in ${langName} about the historical event below — what happened, why it mattered, and what it led to — at each CEFR level. Stick strictly to the facts provided; do not invent details, numbers or quotes. Follow these level constraints:
${LEVEL_SPECS}
${SHARED_INSTRUCTIONS(langName)}

EVENT: ${sourceTitle}

FACTS:
${sourceText}`,
    quote: `Work with the famous quote below. First decide on ONE faithful, natural ${langName} translation of the quote. Use that SAME translation, word for word, in the "title" field of EVERY level — the quote itself must never change between levels. Only the explanation changes.

In each level's "text" field, write a short note IN ${langName} — say who the author was in one line, then explain what the quote means and why it resonates. Keep the note within these level limits (they replace the word counts above for this short format):
A1: 30-50 words, very simple. A2: 45-70 words. B1: 60-90 words. B2: 80-120 words. C1: 110-150 words. C2: 130-180 words. Simpler levels, simpler language.

Do not invent biographical facts beyond those provided.
${SHARED_INSTRUCTIONS(langName)}

QUOTE AND AUTHOR: ${sourceTitle}

FACTS:
${sourceText}`,
  };

  const system = SYSTEMS[kind];
  const task = TASKS[kind];

  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: imageUrl
          ? [
              { type: "text", text: task },
              { type: "image_url", image_url: { url: imageUrl } },
            ]
          : task,
      },
    ],
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  for (const level of LEVELS) {
    const entry = parsed[level];
    if (!entry?.title || !entry?.text || !Array.isArray(entry.vocabulary)) {
      throw new Error(`model response missing level ${level} for ${langCode}`);
    }
  }
  return parsed;
}

export async function classifyCategory(openai, title, text) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Classify this news article into exactly one category from this list: ${CATEGORIES.join(", ")}.
Pick the most specific one; use "world" only when nothing else fits. Answer with the category word only.

TITLE: ${title}

ARTICLE: ${text.slice(0, 1500)}`,
      },
    ],
  });
  const category = response.choices[0].message.content.trim().toLowerCase();
  return CATEGORIES.includes(category) ? category : "world";
}
