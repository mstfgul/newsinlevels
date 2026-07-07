/**
 * Daily quote pipeline.
 *
 * 1. Picks a curated classic author/poet not featured recently.
 * 2. Pulls a real, verifiable quote from their Wikiquote page (free, no key).
 * 3. Grounds a short explanation with the author's Wikipedia summary, and
 *    uses their freely licensed Wikipedia/Commons portrait.
 * 4. Generates, in every language, a faithful translation of the quote plus a
 *    short leveled note on who said it and what it means.
 * 5. Writes data/quotes/<id>.json and updates data/quotes-index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-quote.mjs
 */
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  LEVELS,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";
import { wikipediaIntroExtract } from "./wikipedia.mjs";

/** Classic authors and poets with real Wikiquote pages and free portraits. */
const AUTHORS = [
  "Oscar Wilde",
  "Mark Twain",
  "Virginia Woolf",
  "Fyodor Dostoevsky",
  "Leo Tolstoy",
  "Jane Austen",
  "Charles Dickens",
  "Ralph Waldo Emerson",
  "Henry David Thoreau",
  "Friedrich Nietzsche",
  "Johann Wolfgang von Goethe",
  "Victor Hugo",
  "Marcus Aurelius",
  "Seneca the Younger",
  "Confucius",
  "Rumi",
  "Rabindranath Tagore",
  "Emily Dickinson",
  "Walt Whitman",
  "Kahlil Gibran",
  "Anton Chekhov",
  "Franz Kafka",
  "Albert Camus",
  "William Shakespeare",
  "Maya Angelou",
];

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const QUOTES_DIR = path.join(DATA_DIR, "quotes");
const QUOTES_INDEX_FILE = path.join(DATA_DIR, "quotes-index.json");
const QUOTES_PROCESSED_FILE = path.join(DATA_DIR, "quotes-processed.json");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "news-in-levels (daily learner pipeline)" },
  });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

/** Strip wiki markup from a single quote line to plain text. */
function cleanWiki(line) {
  return line
    .replace(/^\*+\s*/, "")
    .replace(/\[\[[^|\]]*\|([^\]]*)\]\]/g, "$1")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/'{2,}/g, "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Return clean, self-contained quotes from an author's Wikiquote page. */
async function quotesFor(author) {
  const data = await fetchJson(
    `https://en.wikiquote.org/w/api.php?action=parse&page=${encodeURIComponent(
      author.replace(/ /g, "_"),
    )}&prop=wikitext&section=1&format=json`,
  );
  const wikitext = data?.parse?.wikitext?.["*"] ?? "";
  return wikitext
    .split("\n")
    .filter((l) => /^\*\s/.test(l) && !l.startsWith("**"))
    .map(cleanWiki)
    // Prefer a single, tweet-sized, self-contained sentence.
    .filter((q) => q.length >= 40 && q.length <= 180 && !q.includes("http"))
    .filter((q) => (q.match(/[.!?]/g) || []).length <= 2);
}

async function wikipedia(author) {
  let summary;
  try {
    summary = await fetchJson(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        author.replace(/ /g, "_"),
      )}`,
    );
  } catch {
    return {};
  }
  // The REST summary's own extract is just the first paragraph, truncated —
  // fetch the full lead section separately for real grounding material.
  const fullExtract = await wikipediaIntroExtract(summary.title ?? author);
  return fullExtract ? { ...summary, extract: fullExtract } : summary;
}

function freeImage(summary) {
  const src = summary?.thumbnail?.source;
  return src?.includes("/commons/") ? src : undefined;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const processed = readJson(QUOTES_PROCESSED_FILE, []);
  const index = readJson(QUOTES_INDEX_FILE, []);

  // Round-robin: skip authors used most recently.
  const recent = new Set(processed.slice(-15).map((p) => p.author));
  const pool = AUTHORS.filter((a) => !recent.has(a));
  const authors = (pool.length ? pool : AUTHORS).sort(() => Math.random() - 0.5);

  let author, quote, summary;
  for (const candidate of authors) {
    const quotes = await quotesFor(candidate);
    const usedQuotes = new Set(
      processed.filter((p) => p.author === candidate).map((p) => p.quote),
    );
    const fresh = quotes.filter((q) => !usedQuotes.has(q));
    if (fresh.length === 0) continue;
    const sum = await wikipedia(candidate);
    if (!freeImage(sum)) continue; // need a free portrait
    author = candidate;
    quote = fresh[Math.floor(Math.random() * fresh.length)];
    summary = sum;
    break;
  }

  if (!author) {
    console.log("No fresh quote with a free portrait found.");
    return;
  }
  console.log(`Selected: ${author} — "${quote}"`);

  const facts = [
    `AUTHOR: ${author}`,
    summary.description && `WHO THEY WERE: ${summary.description}`,
    summary.extract && `BACKGROUND (Wikipedia): ${summary.extract}`,
    `THE QUOTE (English, from Wikiquote): "${quote}"`,
  ]
    .filter(Boolean)
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const id = `${today}-${slugify(author)}-${slugify(quote).slice(0, 30)}`;

  const entry = {
    id,
    date: today,
    source: {
      name: "Wikiquote",
      url: `https://en.wikiquote.org/wiki/${encodeURIComponent(
        author.replace(/ /g, "_"),
      )}`,
    },
    originalTitle: `${author}: "${quote}"`,
    image: freeImage(summary),
    category: "quote",
    quote: { author, text: quote },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} note...`);
    const versions = await generateLanguageVersions(
      openai,
      entry.originalTitle,
      facts,
      langCode,
      { kind: "quote" },
    );
    // The quote must stay identical across levels — only the note changes.
    // Pin every level's title to one translation regardless of model drift.
    const canonical = versions.B2.title;
    for (const level of LEVELS) versions[level].title = canonical;
    entry.languages[langCode] = versions;
  }

  writeJson(path.join(QUOTES_DIR, `${id}.json`), entry);
  index.unshift({
    id,
    date: today,
    author,
    image: entry.image,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        entry.languages[lang].B1.title,
      ]),
    ),
  });
  processed.push({ author, quote, id, date: today });

  writeJson(QUOTES_INDEX_FILE, index);
  writeJson(QUOTES_PROCESSED_FILE, processed);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
