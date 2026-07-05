/**
 * Daily news pipeline.
 *
 * 1. Reads BBC World RSS and picks the newest articles not processed before.
 * 2. Extracts the full article text.
 * 3. For each article and each target language (en/de/fr), asks OpenAI to
 *    rewrite it at all six CEFR levels (A1–C2) with a vocabulary list.
 * 4. Writes data/articles/<id>.json and updates data/index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-news.mjs
 */
import fs from "node:fs";
import path from "node:path";
import Parser from "rss-parser";
import { extract } from "@extractus/article-extractor";
import OpenAI from "openai";

const ARTICLES_PER_RUN = Number(process.env.ARTICLES_PER_RUN ?? 3);
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const FEED_URL = process.env.FEED_URL ?? "https://feeds.bbci.co.uk/news/world/rss.xml";

const LANGUAGES = { en: "English", de: "German", fr: "French" };
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const ARTICLES_DIR = path.join(DATA_DIR, "articles");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const PROCESSED_FILE = path.join(DATA_DIR, "processed.json");

const LEVEL_SPECS = `
A1: 60-90 words. Present tense only. Very short sentences (max 8 words). Only the ~500 most common words of the language. No subordinate clauses.
A2: 90-130 words. Present and simple past. Short sentences (max 12 words). Common everyday vocabulary. Simple connectors (and, but, because).
B1: 130-180 words. Most common tenses. Some subordinate clauses. Everyday vocabulary plus common news words. Explain difficult concepts simply.
B2: 180-240 words. Full range of tenses, passive voice allowed. Complex sentences. Standard news vocabulary, some idioms.
C1: 220-300 words. Sophisticated structures, nuanced connectors, reported speech. Rich vocabulary, natural journalistic register.
C2: 250-350 words. Native-level journalistic prose. Idiomatic, precise, stylistically refined. May include irony, nuance, low-frequency vocabulary.`;

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function pickFreshItems(processedUrls) {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);
  return feed.items
    .filter((item) => item.link && !processedUrls.includes(item.link))
    .slice(0, ARTICLES_PER_RUN);
}

async function extractText(url, fallback) {
  try {
    const article = await extract(url);
    const text = (article?.content ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 400) {
      return { text: text.slice(0, 5000), image: article?.image };
    }
  } catch (err) {
    console.warn(`  extraction failed for ${url}: ${err.message}`);
  }
  return { text: fallback, image: undefined };
}

async function generateLanguageVersions(openai, sourceTitle, sourceText, langCode) {
  const langName = LANGUAGES[langCode];
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert ${langName} teacher and news editor. You rewrite real news articles in ${langName} at all six CEFR levels so learners can read the same story at their own level. You always answer with valid JSON only.`,
      },
      {
        role: "user",
        content: `Rewrite the news article below in ${langName} at each CEFR level. Follow these level constraints strictly:
${LEVEL_SPECS}

For every level also select 5-8 important words from YOUR rewritten text and define each one in simple ${langName} that a learner AT THAT LEVEL can understand (for A1/A2 keep definitions to a few very simple words).

The story must stay factually identical to the source at every level — only language complexity changes.

Return JSON with exactly this shape:
{"A1":{"title":"...","text":"...","vocabulary":[{"word":"...","definition":"..."}]},"A2":{...},"B1":{...},"B2":{...},"C1":{...},"C2":{...}}

SOURCE TITLE: ${sourceTitle}

SOURCE ARTICLE:
${sourceText}`,
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

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const processed = readJson(PROCESSED_FILE, []);
  const index = readJson(INDEX_FILE, []);

  const items = await pickFreshItems(processed.map((p) => p.url));
  if (items.length === 0) {
    console.log("No fresh articles found.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  for (const item of items) {
    console.log(`Processing: ${item.title}`);
    const { text, image } = await extractText(
      item.link,
      `${item.title}. ${item.contentSnippet ?? ""}`,
    );

    const id = `${today}-${slugify(item.title)}`;
    const article = {
      id,
      date: today,
      source: { name: "BBC News", url: item.link },
      originalTitle: item.title,
      image,
      languages: {},
    };

    for (const langCode of Object.keys(LANGUAGES)) {
      console.log(`  generating ${LANGUAGES[langCode]} versions...`);
      article.languages[langCode] = await generateLanguageVersions(
        openai,
        item.title,
        text,
        langCode,
      );
    }

    writeJson(path.join(ARTICLES_DIR, `${id}.json`), article);
    index.unshift({
      id,
      date: today,
      source: article.source.name,
      titles: {
        en: article.languages.en.B1.title,
        de: article.languages.de.B1.title,
        fr: article.languages.fr.B1.title,
      },
    });
    processed.push({ url: item.link, id, date: today });
    console.log(`  saved ${id}`);
  }

  writeJson(INDEX_FILE, index);
  writeJson(PROCESSED_FILE, processed);
  console.log(`Done. ${items.length} article(s) processed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
