/**
 * Builds the homepage backdrop collage: downloads the source images for art,
 * films, books and quotes (never news or history), shrinks each to a small
 * square WebP under public/collage/, and writes data/collage.json listing the
 * local paths. Serving pre-shrunk local files means the browser isn't pulling
 * full-size images off the Met / TMDB / OpenLibrary / Wikimedia on every visit.
 *
 * Run it after the daily content pipelines: `node pipeline/build-collage.mjs`.
 * Re-running is cheap — an image whose WebP already exists is skipped.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "collage");
const MANIFEST = path.join(ROOT, "data", "collage.json");
const TILE = 200; // px, square — matches the object-cover tiles on the page

// News and history are deliberately excluded.
const SOURCES = [
  "art-index.json",
  "films-index.json",
  "books-index.json",
  "quotes-index.json",
];

function readIndex(file) {
  const full = path.join(ROOT, "data", file);
  return fs.existsSync(full) ? JSON.parse(fs.readFileSync(full, "utf8")) : [];
}

function nameFor(url) {
  return crypto.createHash("sha1").update(url).digest("hex").slice(0, 16) + ".webp";
}

async function shrink(url) {
  const name = nameFor(url);
  const dest = path.join(OUT_DIR, name);
  const publicPath = `/collage/${name}`;
  if (fs.existsSync(dest)) return publicPath; // already built

  // Wikimedia (and others) 429 requests with no descriptive User-Agent.
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "AnyTextInLevels/1.0 (https://www.anytext.art; homepage collage builder)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  await sharp(input)
    .resize(TILE, TILE, { fit: "cover", position: "attention" })
    .webp({ quality: 68 })
    .toFile(dest);
  return publicPath;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const urls = [
    ...new Set(
      SOURCES.flatMap(readIndex)
        .map((entry) => entry.image)
        .filter(Boolean),
    ),
  ];

  console.log(`Building collage from ${urls.length} source images…`);
  const built = [];
  for (const url of urls) {
    try {
      built.push(await shrink(url));
    } catch (error) {
      console.warn(`  skipped ${url}: ${error.message}`);
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(built, null, 2) + "\n");
  console.log(`Wrote ${built.length} tiles → data/collage.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
