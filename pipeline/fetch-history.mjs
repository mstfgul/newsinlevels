/**
 * Daily "on this day" pipeline.
 *
 * 1. Reads Wikipedia's curated on-this-day events for today's date (free,
 *    no key) and picks one not featured before.
 * 2. Uses the event text plus the linked article's summary as grounding.
 * 3. Generates a leveled capsule (A1–C2) in every language.
 * 4. Writes data/history/<id>.json and updates data/history-index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-history.mjs
 */
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const HISTORY_DIR = path.join(DATA_DIR, "history");
const HISTORY_INDEX_FILE = path.join(DATA_DIR, "history-index.json");
const HISTORY_PROCESSED_FILE = path.join(DATA_DIR, "history-processed.json");

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

/** Only hotlink images that live on Wikimedia Commons (free licenses). */
function freeImage(page) {
  const src = page?.thumbnail?.source;
  return src?.includes("/wikipedia/commons/") ? src : undefined;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const processed = readJson(HISTORY_PROCESSED_FILE, []);
  const index = readJson(HISTORY_INDEX_FILE, []);

  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const feed = await fetchJson(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/${month}/${day}`,
  );

  const seen = new Set(processed.map((p) => p.key));
  // Prefer events whose lead article has a freely licensed picture.
  const candidates = (feed.selected ?? [])
    .filter((event) => event.year && event.pages?.length)
    .filter((event) => !seen.has(`${month}-${day}-${event.year}`))
    .sort((a, b) => Number(!!freeImage(b.pages[0])) - Number(!!freeImage(a.pages[0])));

  const event = candidates[0];
  if (!event) {
    console.log("No fresh on-this-day event found.");
    return;
  }

  const page = event.pages[0];
  console.log(`Selected: ${event.year} — ${event.text.slice(0, 80)}`);

  const facts = [
    `DATE: ${now.toLocaleString("en-GB", { month: "long", timeZone: "UTC" })} ${now.getUTCDate()}, ${event.year}`,
    `EVENT: ${event.text}`,
    page.extract && `BACKGROUND (Wikipedia): ${page.extract}`,
  ]
    .filter(Boolean)
    .join("\n");

  const today = now.toISOString().slice(0, 10);
  const id = `${today}-${event.year}-${slugify(page.titles?.normalized ?? event.text)}`;

  const capsule = {
    id,
    date: today,
    source: {
      name: "Wikipedia",
      url:
        page.content_urls?.desktop?.page ??
        `https://en.wikipedia.org/wiki/${page.titles?.canonical ?? ""}`,
    },
    originalTitle: `${event.year}: ${event.text}`,
    image: freeImage(page),
    category: "history",
    history: { year: event.year },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} capsule...`);
    capsule.languages[langCode] = await generateLanguageVersions(
      openai,
      capsule.originalTitle,
      facts,
      langCode,
      { kind: "history" },
    );
  }

  writeJson(path.join(HISTORY_DIR, `${id}.json`), capsule);
  index.unshift({
    id,
    date: today,
    year: event.year,
    image: capsule.image,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        capsule.languages[lang].B1.title,
      ]),
    ),
  });
  processed.push({ key: `${month}-${day}-${event.year}`, id, date: today });

  writeJson(HISTORY_INDEX_FILE, index);
  writeJson(HISTORY_PROCESSED_FILE, processed);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
