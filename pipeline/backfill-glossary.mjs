/**
 * Builds tap-to-translate glossaries for existing content that predates the
 * glossary step. Safe and cheap to re-run: the shared per-language cache means
 * words already translated cost nothing, so a re-run only touches genuinely
 * new vocabulary.
 *
 * Usage:
 *   OPENAI_API_KEY=... node pipeline/backfill-glossary.mjs            # all content
 *   OPENAI_API_KEY=... node pipeline/backfill-glossary.mjs --limit 1  # just the first (for a cheap test)
 */
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { readJson, writeJson } from "./leveler.mjs";
import { attachGlossaries } from "./glossary.mjs";

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

const limitFlag = process.argv.indexOf("--limit");
const LIMIT = limitFlag !== -1 ? Number(process.argv[limitFlag + 1]) : Infinity;

const ROOT = path.join(import.meta.dirname, "..");
const DIRS = ["articles", "art", "history", "quotes", "films", "books"].map((d) =>
  path.join(ROOT, "data", d),
);

const openai = new OpenAI();

let done = 0;
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    if (done >= LIMIT) break;
    const articleFile = path.join(dir, file);
    const article = readJson(articleFile, null);
    if (!article?.languages) continue;

    const before = JSON.stringify(article.glossary ?? null);
    await attachGlossaries(openai, article);
    if (JSON.stringify(article.glossary ?? null) !== before) {
      writeJson(articleFile, article);
      console.log(`  glossary → ${path.basename(dir)}/${file}`);
    }
    done += 1;
  }
  if (done >= LIMIT) break;
}

console.log(`Done. Processed ${done} article(s).`);
