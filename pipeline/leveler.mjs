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
  es: "Spanish",
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

// Both default to the mini tier to keep daily pipeline cost down. Override
// OPENAI_MODEL to a stronger model if the learner-facing text needs a
// quality bump; FAST_MODEL backs cheap selection/classification tasks
// (picking a film, sorting a category) that don't need frontier nuance.
export const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
export const FAST_MODEL = process.env.OPENAI_FAST_MODEL ?? "gpt-4o-mini";

// Two calls instead of one: asking a single completion to write both A1 and
// C2 in the same breath makes the extremes blur toward the middle. Splitting
// low and high bands lets the model commit fully to each register.
const LEVEL_GROUPS = [
  ["A1", "A2", "B1"],
  ["B2", "C1", "C2"],
];

const LEVEL_DESCRIPTIONS = {
  A1: `80-110 words. Grammar: present tense only (plus the verb "to be"/"to have" in their most basic forms); no subordinate clauses, no passive voice, no reported speech. Sentences: max 8 words, one idea per sentence, strict subject-verb-object order. Vocabulary: only the ~500 most frequent words of the language; zero idioms, phrasal/compound verbs or abstract nouns — if a source concept has no simple word, replace it with a short concrete description instead of a hard word.`,
  A2: `120-160 words. Grammar: present and simple past, plus "going to"/simple future for plans; only coordinating connectors (and, but, because, so) — still no relative clauses or passive voice. Sentences: max 12 words, mostly simple with an occasional two-clause sentence joined by "and"/"but". Vocabulary: the ~1000 most frequent words plus a handful of concrete, topic-specific nouns, each made clear from context.`,
  B1: `175-230 words. Grammar: adds present perfect and basic subordinate clauses (relative clauses with who/which/that, first-conditional "if" sentences); still no passive voice or reported speech. Sentences: 12-18 words on average, a mix of simple and one-clause-subordinate sentences. Vocabulary: everyday words plus common news/topic vocabulary (~2000-word band); any less-common term must be explained in simple words the moment it's introduced.`,
  B2: `175-230 words. Grammar: full range of tenses, passive voice, reported speech, second/third-conditional sentences. Sentences: up to ~25 words, genuinely complex (multiple clauses, varied connectors like "although", "since", "in order to"). Vocabulary: standard news register, common idioms and phrasal verbs allowed as long as they're widely known.`,
  C1: `175-230 words. Grammar: sophisticated structures — nominalisation, participle clauses, inversion for emphasis, nuanced connectors (nevertheless, whereas, given that, insofar as), reported speech with modal nuance. Sentences: long and varied in length and rhythm, mixing short punchy sentences with layered ones for effect. Vocabulary: rich and precise, including less-common but still natural words, in a genuine journalistic register.`,
  C2: `175-230 words. Grammar: no simplification whatsoever — native-level control of every structure, including rhetorical devices (rhetorical questions, ellipsis, deliberate fragments for effect). Sentences: whatever length and shape a skilled native writer would choose. Vocabulary: idiomatic, precise, stylistically refined; low-frequency words, irony, understatement and nuance are all welcome where they fit.`,
};

const LEVEL_SPECS_FOOTER = `Across these levels: sentence length and grammar are the primary signal of difficulty, not just word count — a text that hits its word count but reuses flatter, simpler sentence patterns from a lower level is wrong for its label. Vary sentence length naturally within a level's stated range rather than making every sentence the same length. Word counts are minimums to respect, not targets to stop short of: each level's text MUST reach at least the lower bound of its range. Develop the material fully — add context, background and consequences at higher levels rather than padding with repetition.`;

function levelSpecsBlock(levels) {
  return `${levels.map((level) => `${level}: ${LEVEL_DESCRIPTIONS[level]}`).join("\n")}\n\n${LEVEL_SPECS_FOOTER}`;
}

// CEFR labels describe roughly the same overall difficulty across languages,
// but the actual grammar milestone that DEFINES each level differs per
// language. Without this, the model tends to just translate the generic
// English-shaped level spec, which under-uses (or misplaces) the grammar
// point that would make a level feel genuinely native to that language.
const LANGUAGE_GRAMMAR_NOTES = {
  en: `A1-A2: use single-word verbs only, avoid phrasal verbs (say "enter" rather than "go into", "discover" rather than "find out").
B1: this is where phrasal verbs and the present-perfect/simple-past contrast (have done vs did) first appear — introduce them deliberately, not before.
B2: passive voice and reported speech with back-shifted tenses become natural; phrasal verbs used freely.
C1-C2: idiomatic phrasal verbs, inversion for emphasis ("Never had she seen...", "Not only did..."), and nuanced modal-perfect forms (would have, might have, need not have) belong here.`,
  de: `A1: Nominativ and Akkusativ only; strict main-clause word order (verb second); no subordinate clauses yet, so don't force verb-final constructions.
A2: introduce the Dativ case (mir, dir, ihm) and simple subordinate clauses with weil/dass — this is where the verb first moves to the end of the clause.
B1: full four-case system including Genitiv; separable verbs (ankommen → "Er kommt an"); relative clauses with case-marked pronouns (der/die/das/den/dem/deren).
B2: Konjunktiv II for hypotheticals (würde + infinitive, wäre, hätte) and the passive voice (werden + Partizip II); longer subordinate-clause chains.
C1-C2: Konjunktiv I for reported/indirect speech (the register real German journalism uses) and nominal style (Nominalstil) with dense, left-branching noun phrases.`,
  fr: `A1: présent only, no subjunctive; simple negation (ne...pas); avoid any subordinate clause.
A2: passé composé for completed past actions; futur proche (aller + infinitive); basic object pronouns (le/la/les) placed correctly before the verb.
B1: the passé composé vs imparfait contrast (completed event vs background/habitual past) is the core grammar point here — make it explicit; relative pronouns qui/que/où; conditionnel présent for polite requests.
B2: subjonctif présent after common triggers (il faut que, vouloir que, bien que); passive voice; relative pronoun dont.
C1-C2: subjonctif passé, literary past tenses (passé simple) may appear in narrative asides, nuanced connectors (or, cependant, néanmoins, quoique), stylistic inversion.`,
  es: `A1: ser vs estar from the very first sentence (ser = identity/characteristic, estar = location/state) — this distinction cannot be avoided even at the simplest level; present tense only, no subjunctive.
A2: pretérito indefinido for completed past events; ir a + infinitive for the near future; basic direct/indirect object pronouns (lo/la, le).
B1: the pretérito indefinido vs imperfecto contrast (completed vs ongoing/habitual past) is THE defining grammar challenge at this level — make it explicit and central; reflexive verbs; first-conditional si-clauses.
B2: subjuntivo presente after common triggers (querer que, es importante que, cuando with future meaning); passive voice with ser; formal and informal imperative forms.
C1-C2: subjuntivo imperfecto and pluscuamperfecto in hypothetical or reported contexts (si tuviera, hubiera sido), full sequence-of-tense with the subjunctive, idiomatic subjunctive triggers and natural register shifts.`,
};

function grammarNotesBlock(langCode) {
  const notes = LANGUAGE_GRAMMAR_NOTES[langCode];
  if (!notes) return "";
  return `\nLanguage-specific grammar checkpoints for ${LANGUAGES[langCode]} — bring each one in at the level named; don't skip it just because the generic spec above didn't mention it:\n${notes}\n`;
}

// Short-format word counts for the "quote" kind, which writes an explanatory
// note rather than a full article — these replace LEVEL_DESCRIPTIONS' counts
// for that kind only.
const QUOTE_WORD_COUNTS = {
  A1: "50-80 words, very simple.",
  A2: "75-110 words.",
  B1: "100-150 words.",
  B2: "140-200 words.",
  C1: "180-250 words.",
  C2: "220-300 words.",
};

const WORD_BOUNDS = { A1: 80, A2: 120, B1: 175, B2: 175, C1: 175, C2: 175 };
const QUOTE_WORD_BOUNDS = { A1: 50, A2: 75, B1: 100, B2: 140, C1: 180, C2: 220 };

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Comprehension questions are a nice-to-have on top of the text itself, so a
 * malformed batch is dropped (with a warning) rather than failing the run.
 */
function sanitizeQuestions(entry, label) {
  const valid = Array.isArray(entry.questions)
    ? entry.questions.filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length >= 2 &&
          q.options.every((option) => typeof option === "string") &&
          Number.isInteger(q.answer) &&
          q.answer >= 0 &&
          q.answer < q.options.length,
      )
    : [];
  if (valid.length === 0) {
    console.warn(`  no usable comprehension questions for ${label} — keeping the text anyway`);
    delete entry.questions;
    return;
  }
  entry.questions = valid;
}

export function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

const SHARED_INSTRUCTIONS = (langName, levels) => `
Before you finalize your answer, mentally count the words of each level's "text" against its minimum stated above. If any level falls short, keep writing — add more legitimate context, background or consequences — until it reaches at least the lower bound. Never submit a level that undershoots its word count.

Do not reuse the same content word (noun, verb or adjective) more than twice within a single level's text — vary your word choice with level-appropriate synonyms instead of repeating. A text that pads its length by repeating the same few words is not richly educational; genuine lexical range is part of what makes each level worth reading.

For every level also select 5-8 important words from YOUR text and define each one in simple ${langName} that a learner AT THAT LEVEL can understand (for A1/A2 keep definitions to a few very simple words).

For every level also write 3 multiple-choice comprehension questions IN ${langName} about YOUR text at that level, phrased simply enough for a learner AT THAT LEVEL to read. Each question has exactly 3 options with exactly one correct answer; "answer" is the 0-based index of the correct option. Every question must be answerable from that level's text alone — no outside knowledge — and the wrong options must be plausible but clearly contradicted by the text. Do not copy a sentence verbatim as a question; ask about what happened, who, why or what it means.

Return JSON with exactly this shape, and ALL of these levels (${levels.join(", ")}) must be present as top-level keys — never omit one:
{${levels.map((level) => `"${level}":{"title":"...","text":"...","vocabulary":[{"word":"...","definition":"..."}],"questions":[{"question":"...","options":["...","...","..."],"answer":0}]}`).join(",")}}`;

const SYSTEMS = (langName) => ({
  news: `You are an expert ${langName} teacher and news editor. You rewrite real news articles in ${langName} across CEFR levels A1 to C2 so learners can read the same story at their own level. You always answer with valid JSON only.`,
  art: `You are an art historian and expert ${langName} teacher. You write engaging analyses of paintings in ${langName} across CEFR levels A1 to C2 so learners can enjoy the same artwork at their own level. You always answer with valid JSON only.`,
  history: `You are a historian and expert ${langName} teacher. You write vivid capsules about historical events in ${langName} across CEFR levels A1 to C2 so learners can read the same story at their own level. You always answer with valid JSON only.`,
  quote: `You are a literary translator and expert ${langName} teacher. You translate famous quotes into ${langName} and explain them across CEFR levels A1 to C2 so learners can appreciate the same words at their own level. You always answer with valid JSON only.`,
  film: `You are a film critic and expert ${langName} teacher. You write spoiler-free essays about great films in ${langName} across CEFR levels A1 to C2 so learners can discover the same film at their own level. You always answer with valid JSON only.`,
  book: `You are a literary critic and expert ${langName} teacher. You write spoiler-free introductions to great books in ${langName} across CEFR levels A1 to C2 so learners can discover the same book at their own level. You always answer with valid JSON only.`,
});

function buildTask(kind, { langName, langCode, levels, sourceTitle, sourceText, forcedQuoteTitle }) {
  const specs = levelSpecsBlock(levels);
  const grammarNotes = grammarNotesBlock(langCode);
  const shared = SHARED_INSTRUCTIONS(langName, levels);

  if (kind === "quote") {
    const quoteInstruction = forcedQuoteTitle
      ? `Use EXACTLY this translation, word for word, as the "title" field for every level below — it was already fixed while writing this quote's other CEFR levels, so do not retranslate or alter it: "${forcedQuoteTitle}"`
      : `First decide on ONE faithful, natural ${langName} translation of the quote. Use that SAME translation, word for word, in the "title" field of EVERY level below — the quote itself must never change between levels.`;
    const wordCounts = levels.map((level) => `${level}: ${QUOTE_WORD_COUNTS[level]}`).join(" ");
    return `Work with the famous quote below. ${quoteInstruction} Only the explanation changes.

In each level's "text" field, write a short note IN ${langName} — say who the author was in one line, then explain what the quote means and why it resonates. Keep the note within these level limits: ${wordCounts} Simpler levels, simpler language. Reach at least the lower bound of each range.
${grammarNotes}
Do not invent biographical facts beyond those provided.
${shared}

QUOTE AND AUTHOR: ${sourceTitle}

FACTS:
${sourceText}`;
  }

  const bodies = {
    news: `Rewrite the news article below in ${langName} at each CEFR level. Follow these level constraints strictly:
${specs}
${grammarNotes}
The story must stay factually identical to the source at every level — only language complexity changes.
${shared}

SOURCE TITLE: ${sourceTitle}

SOURCE ARTICLE:
${sourceText}`,
    art: `Look carefully at the painting in the image and write an INTERPRETIVE analysis of it in ${langName} at each CEFR level. Do not merely describe what is visible. Use the visual details (scene, colour, light, composition, brushwork) as evidence for a reading of the work: what does it mean, what mood or idea does it convey, what were the artist's choices trying to achieve, and how does it sit within its art-historical moment and style/movement? Interpret its significance and, where relevant, its symbolism.

Ground all biographical and historical claims ONLY in the facts provided below — do not invent dates, events or anecdotes. Art-historical interpretation and reasoned reading of the image are welcome; fabricated facts are not. Even at the simplest levels, go beyond "what we see" to "what it means". Follow these level constraints strictly:
${specs}
${grammarNotes}
${shared}

ARTWORK: ${sourceTitle}

FACTS:
${sourceText}`,
    history: `Write a vivid capsule in ${langName} about the historical event below — what happened, why it mattered, and what it led to — at each CEFR level. Stick strictly to the facts provided; do not invent details, numbers or quotes. Follow these level constraints:
${specs}
${grammarNotes}
${shared}

EVENT: ${sourceTitle}

FACTS:
${sourceText}`,
    film: `Write an essay in ${langName} about the film below that makes a curious viewer want to watch it — at each CEFR level.

ABSOLUTE RULE — NO SPOILERS: you may sketch the premise (the situation as the film opens), but never reveal how the story develops or ends, any twist, any character's fate, or any scene from the second half. If in doubt, leave it out.

Go beyond plot entirely: write about what the film is ABOUT in the deeper sense — its themes and philosophical questions, its mood and visual language (camera, light, rhythm, sound), the director's sensibility, and its place in cinema history. Ground all factual claims (names, dates, awards, production details) ONLY in the facts provided; interpretation is welcome, invented facts are not. Follow these level constraints strictly:
${specs}
${grammarNotes}
${shared}

FILM: ${sourceTitle}

FACTS:
${sourceText}`,
    book: `Write an introduction in ${langName} to the book below that makes a curious reader want to pick it up — at each CEFR level.

ABSOLUTE RULE — NO SPOILERS for fiction: you may sketch the premise (the situation as the book opens), but never reveal how the story develops or ends, any twist, or any character's fate. For philosophy and non-fiction there is no plot to spoil — instead present the central questions and key ideas invitingly, without turning the text into a dry summary.

Go beyond synopsis: write about what the book is ABOUT in the deeper sense — its themes and questions, the author's voice and style, the world it grew out of, its place in literary or intellectual history, and why it still matters to a reader today. Ground all factual claims (names, dates, events, publication details) ONLY in the facts provided; interpretation is welcome, invented facts are not. Follow these level constraints strictly:
${specs}
${grammarNotes}
${shared}

BOOK: ${sourceTitle}

FACTS:
${sourceText}`,
  };

  return bodies[kind];
}

/**
 * Asks the model to expand a single level's text in place rather than
 * regenerating the whole group — cheaper and more reliable, since the model
 * is editing concrete text instead of writing from scratch under the same
 * constraints it just under-delivered on. Returns null (caller keeps the
 * original) if the repair call itself fails or comes back malformed.
 */
async function expandLevelText(openai, kind, langCode, langName, level, entry, minWords, sourceTitle, sourceText) {
  const levelSpec = kind === "quote" ? `Target length: ${QUOTE_WORD_COUNTS[level]}` : LEVEL_DESCRIPTIONS[level];
  const grammarNotes = grammarNotesBlock(langCode);
  const currentWords = countWords(entry.text);

  const prompt = `The ${langName} text below was written for CEFR level ${level} but is too short (${currentWords} words; it needs at least ${minWords}). Expand it to reach the target by adding genuine additional content — more context, background, detail or consequences drawn from the facts below — never by repeating sentences or padding with filler. Keep the exact same CEFR level style throughout, do not drift to a simpler or more advanced register: ${levelSpec}
${grammarNotes}
Keep the title/translation exactly as given below — do not change it. Update the vocabulary list (5-8 items) to match the expanded text if needed, and return 3 multiple-choice comprehension questions in ${langName} about the expanded text (3 options each, "answer" = 0-based index of the correct one, answerable from the text alone).

ORIGINAL TITLE: ${entry.title}

ORIGINAL TEXT:
${entry.text}

SOURCE TITLE: ${sourceTitle}

BACKGROUND FACTS (for legitimate additional context — do not invent beyond these, but drawing out well-known general context or implications around them is fine):
${sourceText}

Return JSON: {"title":"...","text":"...","vocabulary":[{"word":"...","definition":"..."}],"questions":[{"question":"...","options":["...","...","..."],"answer":0}]}`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    if (parsed?.title && parsed?.text && Array.isArray(parsed.vocabulary)) {
      sanitizeQuestions(parsed, `${level}/${langCode}/${kind} (expansion)`);
      // An expansion that loses the questions shouldn't lose them for the level.
      if (!parsed.questions && entry.questions) parsed.questions = entry.questions;
      return parsed;
    }
  } catch (error) {
    console.warn(`  expansion call failed for ${level}/${langCode}/${kind}: ${error.message}`);
  }
  return null;
}

/**
 * Writes one or more CEFR versions of a text in one language for the given
 * subset of levels. Retries on structural problems; tops up any level that
 * comes back under its word-count target with a targeted expansion instead
 * of regenerating (and risking) the whole group again.
 */
async function generateGroup(openai, kind, langCode, langName, levels, sourceTitle, sourceText, imageUrl, forcedQuoteTitle) {
  const system = SYSTEMS(langName)[kind];
  const task = buildTask(kind, { langName, langCode, levels, sourceTitle, sourceText, forcedQuoteTitle });
  const bounds = kind === "quote" ? QUOTE_WORD_BOUNDS : WORD_BOUNDS;

  const MAX_TRIES = 3;
  let lastError;
  let parsed;
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
      const candidate = JSON.parse(choice.message.content);
      for (const level of levels) {
        const entry = candidate[level];
        if (!entry?.title || !entry?.text || !Array.isArray(entry.vocabulary)) {
          throw new Error(
            `model response missing level ${level} for ${langCode}/${kind} (finish_reason: ${choice.finish_reason})`,
          );
        }
        sanitizeQuestions(entry, `${level}/${langCode}/${kind}`);
      }
      parsed = candidate;
      break;
    } catch (error) {
      lastError = error;
      console.warn(`  attempt ${attempt}/${MAX_TRIES} failed: ${error.message}`);
    }
  }
  if (!parsed) throw lastError;

  for (const level of levels) {
    const minWords = bounds[level];
    const wordCount = countWords(parsed[level].text);
    if (wordCount >= minWords * 0.9) continue;
    console.warn(`  ${level} for ${langCode}/${kind} came back short (${wordCount}w, needs ~${minWords}w) — expanding in place`);
    const expanded = await expandLevelText(openai, kind, langCode, langName, level, parsed[level], minWords, sourceTitle, sourceText);
    if (!expanded) {
      console.warn(`  expansion call failed for ${level}/${langCode}/${kind}, keeping the short text rather than failing the run`);
      continue;
    }
    parsed[level] = expanded;
    const newWordCount = countWords(expanded.text);
    if (newWordCount < minWords * 0.9) {
      console.warn(`  ${level}/${langCode}/${kind} still short after expansion (${newWordCount}w, needs ~${minWords}w) — keeping it anyway rather than failing the run`);
    }
  }

  return parsed;
}

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

  const merged = {};
  let quoteTitle;
  for (const group of LEVEL_GROUPS) {
    const result = await generateGroup(openai, kind, langCode, langName, group, sourceTitle, sourceText, imageUrl, quoteTitle);
    Object.assign(merged, result);
    if (kind === "quote" && !quoteTitle) quoteTitle = result[group[0]].title;
  }

  return merged;
}

export async function classifyCategory(openai, title, text) {
  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
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
