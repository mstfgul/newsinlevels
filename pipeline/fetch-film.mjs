/**
 * Daily film pipeline.
 *
 * 1. Asks the model to pick an art-house / cult / philosophically rich film
 *    that hasn't been featured before (data/films-processed.json).
 * 2. Verifies the pick on TMDB, pulling the poster, director and metadata,
 *    plus the film's Wikipedia lead section for richer grounding when a
 *    confident match is found (free, no key).
 * 3. Generates a spoiler-free leveled essay (A1–C2) in every language.
 * 4. Writes data/films/<id>.json and updates data/films-index.json.
 *
 * Requires OPENAI_API_KEY and TMDB_READ_TOKEN. Run: node pipeline/fetch-film.mjs
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
import { fetchJson, wikipediaIntroExtract, wikipediaAnalysisSection } from "./wikipedia.mjs";

const TMDB_API = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w780";
const MAX_ATTEMPTS = 5;

const ROOT = path.join(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const FILMS_DIR = path.join(DATA_DIR, "films");
const FILMS_INDEX_FILE = path.join(DATA_DIR, "films-index.json");
const FILMS_PROCESSED_FILE = path.join(DATA_DIR, "films-processed.json");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function tmdb(pathname, params = {}) {
  const url = new URL(`${TMDB_API}${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`TMDB ${response.status} for ${pathname}`);
  return response.json();
}

async function pickFilm(openai, exclusions) {
  const response = await openai.chat.completions.create({
    model: FAST_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `Pick ONE feature film for a daily art-film club: art-house, cult or philosophically rich cinema — the kind of film cinephiles call essential. Any country, any era; over time the club should wander across decades, languages and directors (Tarkovsky to Varda, Ozu to Lynch), so avoid the obvious pick if a more surprising one is just as strong.

Do NOT pick any of these (already featured or unavailable):
${exclusions.join("\n") || "(none yet)"}

Answer with JSON only: {"title": "<original release title in English>", "year": <number>, "director": "..."}`,
      },
    ],
  });
  return JSON.parse(response.choices[0].message.content);
}

/**
 * TMDB's overview is a solid spoiler-free premise but usually just one short
 * paragraph — too little for a rich C1/C2 essay. The film's Wikipedia lead
 * section adds real production/reception context (verified live to stay
 * premise/production/reception-focused, not plot-revealing, for classics
 * like Persona, Stalker and Seven Samurai), and — when the article has one —
 * its "Themes"/"Analysis"/"Legacy" section adds real critical discussion of
 * what the film is ABOUT, so the essay's thematic/philosophical reading
 * comes from actual film criticism instead of only the model's memory of
 * the work. Falls back to nothing if no confident match is found; the essay
 * still works from TMDB facts (and the model's own knowledge) alone.
 */
async function wikipediaBackground(title, director) {
  try {
    const search = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        `${title} (film) ${director}`,
      )}&srlimit=5&format=json`,
    );
    const surname = director.split(" ").pop().toLowerCase();
    const titleKey = title.slice(0, 12).toLowerCase();
    for (const result of search?.query?.search ?? []) {
      // Only trust a page that is actually about the FILM (not, say, the
      // director's own biography page, which trivially mentions their name).
      if (!result.title.toLowerCase().includes(titleKey)) continue;
      const extract = await wikipediaIntroExtract(result.title);
      if (!extract || !extract.toLowerCase().includes(surname)) continue;
      const analysis = await wikipediaAnalysisSection(result.title);
      return analysis ? `${extract}\n\n${analysis}` : extract;
    }
  } catch {
    // No confident match — the caller just skips this fact.
  }
  return "";
}

async function findOnTmdb(pick) {
  let results = [];
  if (pick.year) {
    const byYear = await tmdb("/search/movie", {
      query: pick.title,
      year: String(pick.year),
      include_adult: "false",
    });
    results = byYear.results ?? [];
  }
  if (results.length === 0) {
    const any = await tmdb("/search/movie", {
      query: pick.title,
      include_adult: "false",
    });
    results = any.results ?? [];
  }
  return results.find((movie) => movie.poster_path) ?? null;
}

async function main() {
  for (const name of ["OPENAI_API_KEY", "TMDB_READ_TOKEN"]) {
    if (!process.env[name]) {
      console.error(`${name} is not set`);
      process.exit(1);
    }
  }
  const openai = new OpenAI();

  const processed = readJson(FILMS_PROCESSED_FILE, []);
  const index = readJson(FILMS_INDEX_FILE, []);

  const rejected = [];
  let movie = null;
  let pick;

  // Manual override (set via the workflow_dispatch "title"/"year"/"director"
  // inputs): try to feature exactly this film first. If it can't be found
  // on TMDB or was already featured, fall back to the normal AI auto-pick
  // below rather than failing the whole run.
  const manualTitle = process.env.MANUAL_TITLE?.trim();
  if (manualTitle) {
    const manualPick = {
      title: manualTitle,
      year: process.env.MANUAL_YEAR?.trim() || undefined,
      director: process.env.MANUAL_DIRECTOR?.trim() ?? "",
    };
    console.log(
      `Manual pick: ${manualPick.title}${manualPick.year ? ` (${manualPick.year})` : ""}${manualPick.director ? ` — ${manualPick.director}` : ""}`,
    );
    const found = await findOnTmdb(manualPick);
    if (!found) {
      console.warn(`  "${manualPick.title}" not found on TMDB — falling back to AI pick`);
    } else if (processed.some((p) => p.tmdbId === found.id)) {
      console.warn(`  "${manualPick.title}" was already featured — falling back to AI pick`);
    } else {
      pick = manualPick;
      movie = found;
    }
  }

  if (!movie) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS && !movie; attempt++) {
      pick = await pickFilm(openai, [
        ...processed.map((p) => `${p.title} (${p.year})`),
        ...rejected,
      ]);
      console.log(`Pick: ${pick.title} (${pick.year}) — ${pick.director}`);
      const found = await findOnTmdb(pick);
      if (!found) {
        rejected.push(`${pick.title} (${pick.year}) — not found on TMDB`);
      } else if (processed.some((p) => p.tmdbId === found.id)) {
        rejected.push(`${pick.title} (${pick.year}) — already featured`);
      } else {
        movie = found;
      }
    }
    if (!movie) throw new Error(`no usable film found in ${MAX_ATTEMPTS} attempts`);
  }

  const details = await tmdb(`/movie/${movie.id}`, {
    append_to_response: "credits",
  });
  const director =
    details.credits?.crew?.find((c) => c.job === "Director")?.name ??
    pick.director;
  const year = (details.release_date || String(pick.year)).slice(0, 4);
  const genres = details.genres.map((g) => g.name).slice(0, 3).join(", ");
  const posterUrl = `${POSTER_BASE}${details.poster_path}`;
  console.log(`Matched TMDB #${details.id}: ${details.title} (${year})`);

  const background = await wikipediaBackground(details.title, director);

  const facts = [
    `TITLE: ${details.title}`,
    details.original_title !== details.title &&
      `ORIGINAL TITLE: ${details.original_title}`,
    `DIRECTOR: ${director}`,
    `YEAR: ${year}`,
    details.production_countries?.length &&
      `COUNTRY: ${details.production_countries.map((c) => c.name).join(", ")}`,
    details.original_language && `ORIGINAL LANGUAGE: ${details.original_language}`,
    `GENRES: ${genres}`,
    details.runtime && `RUNTIME: ${details.runtime} minutes`,
    details.tagline && `TAGLINE: ${details.tagline}`,
    `PREMISE (spoiler-free, from TMDB): ${details.overview}`,
    background &&
      `BACKGROUND (Wikipedia — production/reception context and, where available, critical/thematic analysis; not plot): ${background}`,
    `DATA: TMDB${background ? " + Wikipedia" : ""}`,
  ]
    .filter(Boolean)
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const id = `${today}-${slugify(`${details.title} ${director}`)}`;

  const film = {
    id,
    date: today,
    source: { name: "TMDB", url: `https://www.themoviedb.org/movie/${details.id}` },
    originalTitle: `${details.title} (${year}) — ${director}`,
    image: posterUrl,
    category: "film",
    film: { director, title: details.title, year, genres },
    languages: {},
  };

  for (const langCode of Object.keys(LANGUAGES)) {
    console.log(`  generating ${LANGUAGES[langCode]} essay...`);
    film.languages[langCode] = await generateLanguageVersions(
      openai,
      film.originalTitle,
      facts,
      langCode,
      { kind: "film" },
    );
  }

  writeJson(path.join(FILMS_DIR, `${id}.json`), film);
  index.unshift({
    id,
    date: today,
    director,
    image: posterUrl,
    titles: Object.fromEntries(
      Object.keys(LANGUAGES).map((lang) => [
        lang,
        film.languages[lang].B1.title,
      ]),
    ),
  });
  processed.push({ tmdbId: details.id, title: details.title, year, id, date: today });

  writeJson(FILMS_INDEX_FILE, index);
  writeJson(FILMS_PROCESSED_FILE, processed);
  console.log(`Done. Saved ${id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
