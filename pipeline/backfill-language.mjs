/**
 * Adds a missing language to every existing article, and fills in missing
 * categories along the way. Safe to re-run: articles that already have the
 * language are skipped.
 *
 * Usage: OPENAI_API_KEY=... node pipeline/backfill-language.mjs tr
 */
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import {
  LANGUAGES,
  classifyCategory,
  generateLanguageVersions,
  readJson,
  writeJson,
} from "./leveler.mjs";

const lang = process.argv[2];
if (!LANGUAGES[lang]) {
  console.error(`Usage: node pipeline/backfill-language.mjs <${Object.keys(LANGUAGES).join("|")}>`);
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

const ROOT = path.join(import.meta.dirname, "..");
const TARGETS = [
  {
    dir: path.join(ROOT, "data", "articles"),
    indexFile: path.join(ROOT, "data", "index.json"),
  },
  {
    dir: path.join(ROOT, "data", "art"),
    indexFile: path.join(ROOT, "data", "art-index.json"),
  },
  {
    dir: path.join(ROOT, "data", "stories"),
    indexFile: path.join(ROOT, "data", "stories-index.json"),
  },
  {
    dir: path.join(ROOT, "data", "history"),
    indexFile: path.join(ROOT, "data", "history-index.json"),
  },
];

const openai = new OpenAI();

for (const target of TARGETS) {
  if (!fs.existsSync(target.dir)) continue;
  const index = readJson(target.indexFile, []);

  for (const file of fs.readdirSync(target.dir).filter((f) => f.endsWith(".json"))) {
    const articleFile = path.join(target.dir, file);
    const article = readJson(articleFile, null);
    const indexEntry = index.find((entry) => entry.id === article.id);
    let changed = false;

    if (!article.languages[lang]) {
      console.log(`Backfilling ${LANGUAGES[lang]} for: ${article.originalTitle}`);
      const options = article.art
        ? { kind: "art", imageUrl: article.image }
        : article.story
          ? { kind: "story" }
          : article.history
            ? { kind: "history" }
            : {};
      // The English B2 text is the closest thing to the original source we keep.
      article.languages[lang] = await generateLanguageVersions(
        openai,
        article.originalTitle,
        article.languages.en.B2.text,
        lang,
        options,
      );
      changed = true;
    }

    if (!article.category) {
      article.category = await classifyCategory(
        openai,
        article.originalTitle,
        article.languages.en.B2.text,
      );
      console.log(`  category: ${article.category}`);
      changed = true;
    }

    if (changed) {
      writeJson(articleFile, article);
      if (indexEntry) {
        indexEntry.titles[lang] = article.languages[lang].B1.title;
        // Only the news index carries a category column.
        if (!article.art && !article.story && !article.history) {
          indexEntry.category = article.category;
        }
      }
    }
  }

  writeJson(target.indexFile, index);
}

console.log("Done.");
