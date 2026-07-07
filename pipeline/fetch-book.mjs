/**
 * Daily book pipeline.
 *
 * 1. Asks the model to pick a literary or philosophical classic that hasn't
 *    been featured before (data/books-processed.json).
 * 2. Grounds it with the book's Wikipedia summary (free, no key).
 * 3. Finds a real cover on Open Library, falling back to Google Books
 *    (both free, no key).
 * 4. Generates a spoiler-free leveled introduction (A1–C2) in every language.
 * 5. Writes data/books/<id>.json and updates data/books-index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-book.mjs
 */
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  FAST_MODEL,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";

const MAX_ATTEMPTS = 5;

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const BOOKS_DIR = path.join(DATA_DIR, "books");
const BOOKS_INDEX_FILE = path.join(DATA_DIR, "books-index.json");
const BOOKS_PROCESSED_FILE = path.join(DATA_DIR, "books-processed.json");

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

async function pickBook(openai, exclusions) {
  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `Pick ONE book for a daily book club: literature and philosophy of lasting value — novels, plays, poetry collections, essays and philosophical works that readers call essential. Any country, any era; over time the club should wander across centuries, languages and traditions (Dostoevsky to Woolf, Plato to Arendt, Murasaki to Borges), so avoid the obvious pick if a more surprising one is just as strong.

Do NOT pick any of these (already featured or unavailable):
${exclusions.join("\n") || "(none yet)"}

Answer with JSON only: {"title": "<common English title>", "author": "...", "year": <number, first publication>}`,
      },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

/** The book's Wikipedia article summary, or null when no confident match. */
async function wikipediaSummary(pick) {
  const search = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      `${pick.title} ${pick.author}`,
    )}&srlimit=5&format=json`,
  );
  const surname = pick.author.split(" ").pop().toLowerCase();
  for (const result of search?.query?.search ?? []) {
    try {
      const summary = await fetchJson(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          result.title.replace(/ /g, "_"),
        )}`,
      );
      const text = `${summary.extract ?? ""}`.toLowerCase();
      // Only trust a page that is about the book and mentions its author.
      if (
        summary.extract &&
        text.includes(surname) &&
        summary.title.toLowerCase().includes(pick.title.slice(0, 12).toLowerCase())
      ) {
        return summary;
      }
    } catch {
      // try the next search result
    }
  }
  return null;
}

/** A real cover image: Open Library first, then Google Books. */
async function findCover(pick) {
  try {
    const data = await fetchJson(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        pick.title,
      )}&author=${encodeURIComponent(pick.author)}&limit=10&fields=cover_i`,
    );
    const doc = (data.docs ?? []).find((d) => d.cover_i);
    if (doc) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  } catch {
    // fall through to Google Books
  }
  try {
    const data = await fetchJson(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        `intitle:${pick.title} inauthor:${pick.author}`,
      )}&maxResults=10`,
    );
    const item = (data.items ?? []).find(
      (i) => i.volumeInfo?.imageLinks?.thumbnail,
    );
    if (item) {
      return item.volumeInfo.imageLinks.thumbnail
        .replace("http://", "https://")
        .replace("zoom=1", "zoom=2");
    }
  } catch {
    // no cover anywhere
  }
  return null;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const processed = readJson(BOOKS_PROCESSED_FILE, []);
  const index = readJson(BOOKS_INDEX_FILE, []);

  const rejected = [];
  let pick, summary, cover;
  for (let attempt = 0; attempt < MAX_ATTEMPTS && !cover; attempt++) {
    pick = await pickBook(openai, [
      ...processed.map((p) => `${p.title} — ${p.author}`),
      ...rejected,
    ]);
    console.log(`Pick: ${pick.title} (${pick.year}) — ${pick.author}`);
    if (
      processed.some(
        (p) => slugify(`${p.title} ${p.author}`) === slugify(`${pick.title} ${pick.author}`),
      )
    ) {
      rejected.push(`${pick.title} — ${pick.author} (already featured)`);
      continue;
    }
    summary = await wikipediaSummary(pick);
    if (!summary) {
      rejected.push(`${pick.title} — ${pick.author} (no Wikipedia page found)`);
      continue;
    }
    cover = await findCover(pick);
    if (!cover) {
      rejected.push(`${pick.title} — ${pick.author} (no cover found)`);
    }
  }
  if (!cover) throw new Error(`no usable book found in ${MAX_ATTEMPTS} attempts`);

  const facts = [
    `TITLE: ${pick.title}`,
    `AUTHOR: ${pick.author}`,
    `FIRST PUBLISHED: ${pick.year}`,
    summary.description && `WHAT IT IS: ${summary.description}`,
    `ABOUT THE BOOK (Wikipedia): ${summary.extract}`,
  ]
    .filter(Boolean)
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const id = `${today}-${slugify(`${pick.title} ${pick.author}`)}`;

  const book = {
    id,
    date: today,
    source: {
      name: "Wikipedia",
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
        summary.title.replace(/ /g, "_"),
      )}`,
    },
    originalTitle: `${pick.title} (${pick.year}) — ${pick.author}`,
    image: cover,
    category: "book",
    book: { author: pick.author, title: pick.title, year: String(pick.year) },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} introduction...`);
    book.languages[langCode] = await generateLanguageVersions(
      openai,
      book.originalTitle,
      facts,
      langCode,
      { kind: "book" },
    );
  }

  writeJson(path.join(BOOKS_DIR, `${id}.json`), book);
  index.unshift({
    id,
    date: today,
    author: pick.author,
    image: cover,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        book.languages[lang].B1.title,
      ]),
    ),
  });
  processed.push({ title: pick.title, author: pick.author, id, date: today });

  writeJson(BOOKS_INDEX_FILE, index);
  writeJson(BOOKS_PROCESSED_FILE, processed);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
