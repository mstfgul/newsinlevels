/**
 * Daily news pipeline.
 *
 * 1. Reads BBC World RSS and picks the newest articles not processed before.
 * 2. Extracts the full article text.
 * 3. For each article and each target language (en/de/fr/es), asks OpenAI to
 *    rewrite it at all six CEFR levels (A1–C2) with a vocabulary list, and
 *    classifies the article into a category.
 * 4. Writes data/articles/<id>.json and updates data/index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-news.mjs
 */
import path from "node:path";
import Parser from "rss-parser";
import { extract } from "@extractus/article-extractor";
import OpenAI from "openai";
import {
  LANGUAGES,
  classifyCategory,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";

const ARTICLES_PER_RUN = Number(process.env.ARTICLES_PER_RUN ?? 3);
const FEED_URL = process.env.FEED_URL ?? "https://feeds.bbci.co.uk/news/world/rss.xml";

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const ARTICLES_DIR = path.join(DATA_DIR, "articles");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const PROCESSED_FILE = path.join(DATA_DIR, "processed.json");

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
    const category = await classifyCategory(openai, item.title, text);
    const article = {
      id,
      date: today,
      source: { name: "BBC News", url: item.link },
      originalTitle: item.title,
      image,
      category,
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
      image,
      category,
      titles: Object.fromEntries(
        Object.keys(LANGUAGES).map((lang) => [
          lang,
          article.languages[lang].B1.title,
        ]),
      ),
    });
    processed.push({ url: item.link, id, date: today });
    console.log(`  saved ${id} (${category})`);
  }

  writeJson(INDEX_FILE, index);
  writeJson(PROCESSED_FILE, processed);
  console.log(`Done. ${items.length} article(s) processed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
