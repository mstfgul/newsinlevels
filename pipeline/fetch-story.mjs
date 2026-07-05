/**
 * Daily story pipeline: classic public-domain fiction as a serial.
 *
 * A story runs for ~5 daily parts. State lives in data/story-state.json:
 * - When there is no story in progress, the model writes a part-by-part
 *   outline of the next classic from the curated list below.
 * - Each run then generates ONE part (A1–C2 × all languages), grounded in
 *   the outline plus a recap of previous parts, and advances the state.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-story.mjs
 */
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  MODEL,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";

/** Famous short classics, all long out of copyright. */
const CLASSICS = [
  { title: "The Happy Prince", author: "Oscar Wilde", parts: 5 },
  { title: "The Selfish Giant", author: "Oscar Wilde", parts: 4 },
  { title: "The Canterville Ghost", author: "Oscar Wilde", parts: 6 },
  { title: "The Gift of the Magi", author: "O. Henry", parts: 4 },
  { title: "The Last Leaf", author: "O. Henry", parts: 4 },
  { title: "Rikki-Tikki-Tavi", author: "Rudyard Kipling", parts: 5 },
  { title: "The Red-Headed League", author: "Arthur Conan Doyle", parts: 6 },
  { title: "The Adventure of the Speckled Band", author: "Arthur Conan Doyle", parts: 6 },
  { title: "The Legend of Sleepy Hollow", author: "Washington Irving", parts: 6 },
  { title: "The Ugly Duckling", author: "Hans Christian Andersen", parts: 4 },
  { title: "The Emperor's New Clothes", author: "Hans Christian Andersen", parts: 3 },
  { title: "The Little Match Girl", author: "Hans Christian Andersen", parts: 3 },
  { title: "The Nightingale", author: "Hans Christian Andersen", parts: 5 },
  { title: "The Necklace", author: "Guy de Maupassant", parts: 4 },
  { title: "The Bet", author: "Anton Chekhov", parts: 4 },
  { title: "The Open Window", author: "Saki", parts: 3 },
  { title: "The Monkey's Paw", author: "W. W. Jacobs", parts: 5 },
  { title: "A Christmas Carol", author: "Charles Dickens", parts: 5 },
  { title: "The Town Mouse and the Country Mouse", author: "Aesop", parts: 3 },
  { title: "The Tortoise and the Hare", author: "Aesop", parts: 3 },
];

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const STORIES_DIR = path.join(DATA_DIR, "stories");
const STORIES_INDEX_FILE = path.join(DATA_DIR, "stories-index.json");
const STATE_FILE = path.join(DATA_DIR, "story-state.json");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function outlineStory(openai, classic) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `You know the classic public-domain story "${classic.title}" by ${classic.author}. Divide its plot into exactly ${classic.parts} sequential parts for a serialized retelling. For each part write a 2-3 sentence summary of the events it covers, faithful to the original plot. Return JSON: {"parts":["...", "..."]} with exactly ${classic.parts} strings.`,
      },
    ],
  });
  const parsed = JSON.parse(response.choices[0].message.content);
  if (!Array.isArray(parsed.parts) || parsed.parts.length !== classic.parts) {
    throw new Error(`outline for ${classic.title} has wrong shape`);
  }
  return parsed.parts;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const state = readJson(STATE_FILE, { current: null, nextPart: 1, processed: [] });
  const index = readJson(STORIES_INDEX_FILE, []);

  if (!state.current || state.nextPart > state.current.parts) {
    if (state.current) state.processed.push(state.current.title);
    const remaining = CLASSICS.filter((c) => !state.processed.includes(c.title));
    if (remaining.length === 0) {
      console.log("All classics used — add more to CLASSICS.");
      return;
    }
    const classic = remaining[Math.floor(Math.random() * remaining.length)];
    console.log(`Starting new story: ${classic.title} — ${classic.author}`);
    state.current = { ...classic, outline: await outlineStory(openai, classic) };
    state.nextPart = 1;
  }

  const { current } = state;
  const part = state.nextPart;
  const today = new Date().toISOString().slice(0, 10);
  const id = `${today}-${slugify(current.title)}-part-${part}`;

  const brief = [
    `AUTHOR: ${current.author}`,
    `THIS IS PART ${part} OF ${current.parts}.`,
    part > 1 &&
      `EVENTS SO FAR (do not retell these, just stay consistent):\n${current.outline
        .slice(0, part - 1)
        .map((s, i) => `Part ${i + 1}: ${s}`)
        .join("\n")}`,
    `EVENTS OF THIS PART (retell exactly these):\n${current.outline[part - 1]}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const chapter = {
    id,
    date: today,
    source: {
      name: "Project Gutenberg",
      url: `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(
        `${current.title} ${current.author}`,
      )}`,
    },
    originalTitle: `${current.title} — Part ${part} of ${current.parts}`,
    category: "fiction",
    story: {
      title: current.title,
      author: current.author,
      part,
      totalParts: current.parts,
    },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} part ${part}...`);
    chapter.languages[langCode] = await generateLanguageVersions(
      openai,
      `${current.title} by ${current.author}`,
      brief,
      langCode,
      { kind: "story" },
    );
  }

  writeJson(path.join(STORIES_DIR, `${id}.json`), chapter);
  index.unshift({
    id,
    date: today,
    story: current.title,
    author: current.author,
    part,
    totalParts: current.parts,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        chapter.languages[lang].B1.title,
      ]),
    ),
  });
  state.nextPart = part + 1;

  writeJson(STORIES_INDEX_FILE, index);
  writeJson(STATE_FILE, state);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
