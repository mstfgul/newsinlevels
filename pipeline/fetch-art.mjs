/**
 * Daily art pipeline.
 *
 * 1. Picks a random public-domain painting from The Met's Open Access API
 *    (no key needed) that hasn't been featured before.
 * 2. Grounds the analysis with the artist's Wikipedia summary.
 * 3. Shows the painting image to the model and asks for a leveled analysis
 *    (A1–C2) in every language, with vocabulary lists.
 * 4. Writes data/art/<id>.json and updates data/art-index.json.
 *
 * Requires OPENAI_API_KEY. Run: node pipeline/fetch-art.mjs
 */
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";
import { wikipediaIntroExtract } from "./wikipedia.mjs";

const MET_API = "https://collectionapi.metmuseum.org/public/collection/v1";
const MAX_ATTEMPTS = 25;

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const ART_DIR = path.join(DATA_DIR, "art");
const ART_INDEX_FILE = path.join(DATA_DIR, "art-index.json");
const ART_PROCESSED_FILE = path.join(DATA_DIR, "art-processed.json");

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
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

async function pickPainting(usedIds) {
  const search = await fetchJson(
    `${MET_API}/search?hasImages=true&medium=Paintings&q=painting`,
  );
  const candidates = search.objectIDs.filter((id) => !usedIds.includes(id));

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const id = candidates[Math.floor(Math.random() * candidates.length)];
    try {
      const object = await fetchJson(`${MET_API}/objects/${id}`);
      if (
        object.isPublicDomain &&
        object.primaryImageSmall &&
        object.artistDisplayName &&
        object.classification === "Paintings"
      ) {
        return object;
      }
    } catch {
      // Some object IDs 404; just try another.
    }
  }
  throw new Error(`no suitable painting found in ${MAX_ATTEMPTS} attempts`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set");
    process.exit(1);
  }
  const openai = new OpenAI();

  const processed = readJson(ART_PROCESSED_FILE, []);
  const index = readJson(ART_INDEX_FILE, []);

  const object = await pickPainting(processed.map((p) => p.objectID));
  console.log(`Selected: ${object.title} — ${object.artistDisplayName}`);

  const artistNote = await wikipediaIntroExtract(object.artistDisplayName);
  const facts = [
    `ARTIST: ${object.artistDisplayName} (${object.artistDisplayBio || "dates unknown"})`,
    `TITLE: ${object.title}`,
    `DATE: ${object.objectDate}`,
    `MEDIUM: ${object.medium}`,
    object.period && `PERIOD: ${object.period}`,
    object.culture && `CULTURE: ${object.culture}`,
    `COLLECTION: The Metropolitan Museum of Art, New York`,
    artistNote && `ABOUT THE ARTIST (Wikipedia): ${artistNote}`,
  ]
    .filter(Boolean)
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const id = `${today}-${slugify(`${object.artistDisplayName} ${object.title}`)}`;

  const artwork = {
    id,
    date: today,
    source: { name: "The Met", url: object.objectURL },
    originalTitle: `${object.title} — ${object.artistDisplayName}`,
    image: object.primaryImageSmall,
    category: "art",
    art: {
      artist: object.artistDisplayName,
      title: object.title,
      year: object.objectDate,
      medium: object.medium,
    },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} analysis...`);
    artwork.languages[langCode] = await generateLanguageVersions(
      openai,
      artwork.originalTitle,
      facts,
      langCode,
      { kind: "art", imageUrl: object.primaryImageSmall },
    );
  }

  writeJson(path.join(ART_DIR, `${id}.json`), artwork);
  index.unshift({
    id,
    date: today,
    artist: object.artistDisplayName,
    image: object.primaryImageSmall,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        artwork.languages[lang].B1.title,
      ]),
    ),
  });
  processed.push({ objectID: object.objectID, id, date: today });

  writeJson(ART_INDEX_FILE, index);
  writeJson(ART_PROCESSED_FILE, processed);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
