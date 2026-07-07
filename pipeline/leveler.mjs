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
A1: 100-140 words. Present tense only. Very short sentences (max 8 words). Only the ~500 most common words of the language. No subordinate clauses.
A2: 150-200 words. Present and simple past. Short sentences (max 12 words). Common everyday vocabulary. Simple connectors (and, but, because).
B1: 220-290 words. Most common tenses. Some subordinate clauses. Everyday vocabulary plus common news words. Explain difficult concepts simply.
B2: 300-380 words. Full range of tenses, passive voice allowed. Complex sentences. Standard news vocabulary, some idioms.
C1: 380-470 words. Sophisticated structures, nuanced connectors, reported speech. Rich vocabulary, natural journalistic register.
C2: 450-560 words. Native-level journalistic prose. Idiomatic, precise, stylistically refined. May include irony, nuance, low-frequency vocabulary.

Word counts are minimums to respect, not targets to stop short of: each level's text MUST reach at least the lower bound of its range. Develop the material fully — add context, background and consequences at higher levels rather than padding with repetition.`;

export function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

const SHARED_INSTRUCTIONS = (langName) => `
For every level also select 5-8 important words from YOUR text and define each one in simple ${langName} that a learner AT THAT LEVEL can understand (for A1/A2 keep definitions to a few very simple words).

Return JSON with exactly this shape, and ALL SIX levels (A1, A2, B1, B2, C1, C2) must be present as top-level keys — never omit a level:
{"A1":{"title":"...","text":"...","vocabulary":[{"word":"...","definition":"..."}]},"A2":{...},"B1":{...},"B2":{...},"C1":{...},"C2":{...}}`;

/**
 * Writes six CEFR versions of a text in one language.
 * kind "news":    rewrites a news article.
 * kind "art":     writes an analysis of a painting — pass options.imageUrl so
 *                 the model can actually look at it.
 * kind "history": writes a capsule about an on-this-day historical event.
 * kind "quote":   translates a quote (as the title) and explains it (as the
 *                 text) at each level.
 * kind "film":    writes a spoiler-free essay about a film.
 * kind "book":    writes a spoiler-free introduction to a book.
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
    film: `You are a film critic and expert ${langName} teacher. You write spoiler-free essays about great films in ${langName} at all six CEFR levels so learners can discover the same film at their own level. You always answer with valid JSON only.`,
    book: `You are a literary critic and expert ${langName} teacher. You write spoiler-free introductions to great books in ${langName} at all six CEFR levels so learners can discover the same book at their own level. You always answer with valid JSON only.`,
  };

  const TASKS = {
    news: `Rewrite the news article below in ${langName} at each CEFR level. Follow these level constraints strictly:
${LEVEL_SPECS}

The story must stay factually identical to the source at every level — only language complexity changes.
${SHARED_INSTRUCTIONS(langName)}

SOURCE TITLE: ${sourceTitle}

SOURCE ARTICLE:
${sourceText}`,
    art: `Look carefully at the painting in the image and write an INTERPRETIVE analysis of it in ${langName} at each CEFR level. Do not merely describe what is visible. Use the visual details (scene, colour, light, composition, brushwork) as evidence for a reading of the work: what does it mean, what mood or idea does it convey, what were the artist's choices trying to achieve, and how does it sit within its art-historical moment and style/movement? Interpret its significance and, where relevant, its symbolism.

Ground all biographical and historical claims ONLY in the facts provided below — do not invent dates, events or anecdotes. Art-historical interpretation and reasoned reading of the image are welcome; fabricated facts are not. Even at the simplest levels, go beyond "what we see" to "what it means". Follow these level constraints strictly:
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
A1: 50-80 words, very simple. A2: 75-110 words. B1: 100-150 words. B2: 140-200 words. C1: 180-250 words. C2: 220-300 words. Simpler levels, simpler language. Reach at least the lower bound of each range.

Do not invent biographical facts beyond those provided.
${SHARED_INSTRUCTIONS(langName)}

QUOTE AND AUTHOR: ${sourceTitle}

FACTS:
${sourceText}`,
    film: `Write an essay in ${langName} about the film below that makes a curious viewer want to watch it — at each CEFR level.

ABSOLUTE RULE — NO SPOILERS: you may sketch the premise (the situation as the film opens), but never reveal how the story develops or ends, any twist, any character's fate, or any scene from the second half. If in doubt, leave it out.

Go beyond plot entirely: write about what the film is ABOUT in the deeper sense — its themes and philosophical questions, its mood and visual language (camera, light, rhythm, sound), the director's sensibility, and its place in cinema history. Ground all factual claims (names, dates, awards, production details) ONLY in the facts provided; interpretation is welcome, invented facts are not. Follow these level constraints strictly:
${LEVEL_SPECS}
${SHARED_INSTRUCTIONS(langName)}

FILM: ${sourceTitle}

FACTS:
${sourceText}`,
    book: `Write an introduction in ${langName} to the book below that makes a curious reader want to pick it up — at each CEFR level.

ABSOLUTE RULE — NO SPOILERS for fiction: you may sketch the premise (the situation as the book opens), but never reveal how the story develops or ends, any twist, or any character's fate. For philosophy and non-fiction there is no plot to spoil — instead present the central questions and key ideas invitingly, without turning the text into a dry summary.

Go beyond synopsis: write about what the book is ABOUT in the deeper sense — its themes and questions, the author's voice and style, the world it grew out of, its place in literary or intellectual history, and why it still matters to a reader today. Ground all factual claims (names, dates, events, publication details) ONLY in the facts provided; interpretation is welcome, invented facts are not. Follow these level constraints strictly:
${LEVEL_SPECS}
${SHARED_INSTRUCTIONS(langName)}

BOOK: ${sourceTitle}

FACTS:
${sourceText}`,
  };

  const system = SYSTEMS[kind];
  const task = TASKS[kind];

  // Long six-level responses occasionally come back with a level missing or
  // truncated — retry a few times before giving up on the whole article.
  const MAX_TRIES = 3;
  let lastError;
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
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

    const choice = response.choices[0];
    try {
      const parsed = JSON.parse(choice.message.content);
      for (const level of LEVELS) {
        const entry = parsed[level];
        if (!entry?.title || !entry?.text || !Array.isArray(entry.vocabulary)) {
          throw new Error(
            `model response missing level ${level} for ${langCode} (finish_reason: ${choice.finish_reason})`,
          );
        }
      }
      return parsed;
    } catch (error) {
      lastError = error;
      console.warn(`  attempt ${attempt}/${MAX_TRIES} failed: ${error.message}`);
    }
  }
  throw lastError;
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
