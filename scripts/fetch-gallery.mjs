#!/usr/bin/env node
/**
 * fetch-gallery.mjs — builds the static artwork set for anytext.art (ST-103).
 *
 *   PATH=/usr/local/bin:$PATH node scripts/fetch-gallery.mjs [--only id,id] [--force] [--sheet] [--pool path]
 *
 * For every entry in scripts/gallery-list.mjs:
 *   1. resolve metadata (pool entry by qid, or the inline fields),
 *   2. ask the Commons API for a 1600px thumbnail URL + extmetadata licence,
 *   3. refuse anything that is not Public domain / CC0 / PD-* (warn + skip),
 *   4. download (cached in scripts/.cache/gallery/), encode two WebPs with
 *      sharp — 640px and 1400px on the long edge, fit inside, never cropped,
 *      never enlarged (the app pipeline's toWebp recipe) — into public/gallery/,
 *   5. record width/height/dominant colour.
 * Then it writes lib/gallery.ts (generated manifest) and public/gallery/CREDITS.md.
 * With --sheet it also renders public/gallery/contact-sheet.png for review.
 *
 * Idempotent: existing outputs are reused unless --force. Network etiquette:
 * a descriptive User-Agent (Wikimedia policy), ~350 ms between requests,
 * retries on 429/5xx.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { GALLERY_LIST } from "./gallery-list.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "gallery");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache", "gallery");
const MANIFEST = path.join(ROOT, "lib", "gallery.ts");
const CREDITS = path.join(ROOT, "public", "gallery", "CREDITS.md");
/** Machine-readable twin of the manifest so `--only` runs can merge with earlier results. */
const MANIFEST_JSON = path.join(CACHE_DIR, "gallery.generated.mjs");
const SIZES = [640, 1400];
const THUMB_WIDTH = 1600;
const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024;
const USER_AGENT = "AnyTextWeb/1.0 (https://anytext.art; gallery build script) node";
const PD_LICENCE = /^(public domain|cc0|pd\b|pd-)/i;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const only = opt("--only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const force = flag("--force");
const poolPath = path.resolve(
  ROOT,
  opt("--pool", "../mobile/functions/pipeline/art-famous-data.js"),
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, init = {}, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "User-Agent": USER_AGENT, ...(init.headers ?? {}) },
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status} for ${url}`);
        await sleep(3000 * (i + 1));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(2000 * (i + 1));
    }
  }
  throw lastErr;
}

/** Commons imageinfo for one file: thumb URL, size and licence in one call. */
async function commonsInfo(commonsFile) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    `&titles=${encodeURIComponent(`File:${commonsFile}`)}` +
    `&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=${THUMB_WIDTH}`;
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  const data = await res.json();
  const page = data.query?.pages?.[0];
  if (!page || page.missing) return null;
  return page.imageinfo?.[0] ?? null;
}

export function commonsFilePageUrl(commonsFile) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(commonsFile.replace(/ /g, "_"))}`;
}

function pickDownloadUrl(info) {
  if (info.thumburl && !info.thumberror) return info.thumburl.split("?")[0];
  if (info.url && typeof info.size === "number" && info.size <= MAX_ORIGINAL_BYTES) {
    return info.url.split("?")[0];
  }
  return null;
}

async function loadPool() {
  if (!existsSync(poolPath)) {
    console.warn(`pool not found at ${poolPath} — qid entries will fail`);
    return new Map();
  }
  const mod = await import(pathToFileURL(poolPath).href);
  return new Map(mod.FAMOUS_PAINTINGS.map((p) => [p.qid, p]));
}

function resolveEntry(entry, pool) {
  if (entry.qid) {
    const p = pool.get(entry.qid);
    if (!p) throw new Error(`${entry.id}: qid ${entry.qid} not in pool`);
    return {
      ...entry,
      title: entry.title ?? p.title,
      artist: entry.artist ?? p.artist,
      year: entry.year ?? p.inception,
      museum: entry.museum ?? p.museum,
      commonsFile: entry.commonsFile ?? p.commonsFile,
    };
  }
  for (const k of ["title", "artist", "year", "museum", "commonsFile"]) {
    if (!entry[k]) throw new Error(`${entry.id}: missing ${k}`);
  }
  return entry;
}

const toHex = ({ r, g, b }) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

async function encode(entry, sourcePath) {
  const result = {};
  const meta = await sharp(sourcePath).rotate().metadata();
  for (const size of SIZES) {
    const out = path.join(OUT_DIR, `${entry.id}-${size}.webp`);
    if (!force && existsSync(out)) {
      const m = await sharp(out).metadata();
      result[size] = { width: m.width, height: m.height };
      continue;
    }
    const pipeline = sharp(sourcePath)
      .rotate()
      .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 });
    const info = await pipeline.toFile(out);
    result[size] = { width: info.width, height: info.height };
  }
  const { dominant } = await sharp(path.join(OUT_DIR, `${entry.id}-640.webp`)).stats();
  return { sizes: result, dominant: toHex(dominant), source: { width: meta.width, height: meta.height } };
}

async function processEntry(entry) {
  const cacheBase = path.join(CACHE_DIR, entry.id);
  const have = SIZES.every((s) => existsSync(path.join(OUT_DIR, `${entry.id}-${s}.webp`)));
  const info = await commonsInfo(entry.commonsFile);
  await sleep(350);
  if (!info) throw new Error(`Commons file missing: ${entry.commonsFile}`);
  const licence = info.extmetadata?.LicenseShortName?.value ?? "";
  if (!PD_LICENCE.test(licence)) {
    throw new Error(`NOT public domain (${licence || "no licence tag"}) — skipped`);
  }
  let sourcePath = null;
  for (const ext of ["jpg", "png", "jpeg", "webp"]) {
    if (existsSync(`${cacheBase}.${ext}`)) sourcePath = `${cacheBase}.${ext}`;
  }
  if (!sourcePath || force || !have) {
    if (!sourcePath || force) {
      const dl = pickDownloadUrl(info);
      if (!dl) throw new Error("no usable thumbnail/original URL");
      const res = await fetchWithRetry(dl);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = (info.mime ?? "image/jpeg").split("/")[1].replace("jpeg", "jpg");
      sourcePath = `${cacheBase}.${ext}`;
      await writeFile(sourcePath, buf);
      await sleep(350);
    }
  }
  const encoded = await encode(entry, sourcePath);
  return {
    id: entry.id,
    title: entry.title,
    artist: entry.artist,
    year: String(entry.year),
    museum: entry.museum,
    licence,
    source: commonsFilePageUrl(entry.commonsFile),
    commonsFile: entry.commonsFile,
    wall: Boolean(entry.wall),
    kind: entry.kind ?? null,
    tilt: entry.tilt ?? -1.1,
    dominant: encoded.dominant,
    w640: encoded.sizes[640].width,
    h640: encoded.sizes[640].height,
    w1400: encoded.sizes[1400].width,
    h1400: encoded.sizes[1400].height,
  };
}

function manifestSource(items) {
  const rows = items
    .map(
      (a) =>
        `  { id: ${JSON.stringify(a.id)}, title: ${JSON.stringify(a.title)}, artist: ${JSON.stringify(a.artist)}, year: ${JSON.stringify(a.year)}, museum: ${JSON.stringify(a.museum)},\n` +
        `    source: ${JSON.stringify(a.source)}, licence: ${JSON.stringify(a.licence)}, wall: ${a.wall}, kind: ${JSON.stringify(a.kind)}, tilt: ${a.tilt},\n` +
        `    dominant: ${JSON.stringify(a.dominant)}, w640: ${a.w640}, h640: ${a.h640}, w1400: ${a.w1400}, h1400: ${a.h1400} },`,
    )
    .join("\n");
  return `/**
 * GENERATED by scripts/fetch-gallery.mjs — do not edit by hand.
 * Source list: scripts/gallery-list.mjs · credits: public/gallery/CREDITS.md
 * Every work is public domain / CC0 (licence re-checked from Commons at build time).
 */
export type ArtworkKind =
  | "art" | "film" | "book" | "quote" | "essay" | "culture" | "story" | "word" | "history" | "news";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  museum: string;
  /** Commons file page — the credit link. */
  source: string;
  licence: string;
  /** Candidate for the hero art wall. */
  wall: boolean;
  kind: ArtworkKind | null;
  /** Resting tilt on the paper desk, degrees (ignored in the dark gallery). */
  tilt: number;
  /** Average colour, for blurred backdrops and placeholders. */
  dominant: string;
  w640: number;
  h640: number;
  w1400: number;
  h1400: number;
}

export const GALLERY: readonly Artwork[] = [
${rows}
] as const;

export const artworkById = (id: string): Artwork => {
  const a = GALLERY.find((g) => g.id === id);
  if (!a) throw new Error(\`Unknown artwork: \${id}\`);
  return a;
};

/** "Artist, Title (year)" — the alt text every artwork carries. */
export const artworkAlt = (a: Artwork) => \`\${a.artist}, \${a.title} (\${a.year})\`;

export const artworkSrc = (a: Artwork, size: 640 | 1400 = 640) => \`/gallery/\${a.id}-\${size}.webp\`;

export const artworkSrcSet = (a: Artwork) =>
  \`/gallery/\${a.id}-640.webp \${a.w640}w, /gallery/\${a.id}-1400.webp \${a.w1400}w\`;
`;
}

function creditsSource(items) {
  const rows = items
    .map(
      (a) =>
        `| \`${a.id}\` | ${a.title} | ${a.artist} | ${a.year} | ${a.museum} | [Wikimedia Commons](${a.source}) | ${a.licence} |`,
    )
    .join("\n");
  return `# Image credits — public/gallery

All works below are in the public domain (or CC0). Licences were read from
Wikimedia Commons' \`extmetadata\` by \`scripts/fetch-gallery.mjs\` at build
time; anything without a PD/CC0 tag is refused by the script. Files are
Commons' own 1600px thumbnails (never gigapixel originals), re-encoded with
sharp to WebP q80 at 640px and 1400px on the long edge, fit inside, uncropped.

| id | Work | Artist | Year | Collection | Source | Licence |
|---|---|---|---|---|---|---|
${rows}
`;
}

async function contactSheet(items) {
  const cell = 220;
  const cols = 6;
  const label = 34;
  const rows = Math.ceil(items.length / cols);
  const width = cols * cell;
  const height = rows * (cell + label);
  const composites = [];
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * (cell + label);
    const img = await sharp(path.join(OUT_DIR, `${a.id}-640.webp`))
      .resize({ width: cell - 16, height: cell - 16, fit: "inside" })
      .toBuffer({ resolveWithObject: true });
    composites.push({
      input: img.data,
      left: x + Math.round((cell - img.info.width) / 2),
      top: y + Math.round((cell - img.info.height) / 2),
    });
    const text = `<svg width="${cell}" height="${label}"><text x="${cell / 2}" y="22" font-family="Helvetica, Arial" font-size="13" text-anchor="middle" fill="#212e3e">${i + 1}. ${a.id}${a.wall ? " ★" : ""}</text></svg>`;
    composites.push({ input: Buffer.from(text), left: x, top: y + cell });
  }
  await sharp({ create: { width, height, channels: 3, background: "#faf5e4" } })
    .composite(composites)
    .png()
    .toFile(path.join(OUT_DIR, "contact-sheet.png"));
  console.log(`contact sheet: ${items.length} works → public/gallery/contact-sheet.png`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(CACHE_DIR, { recursive: true });
  const pool = await loadPool();
  const selected = GALLERY_LIST.filter((e) => only.length === 0 || only.includes(e.id));
  const results = [];
  const failures = [];
  for (const raw of selected) {
    let entry;
    try {
      entry = resolveEntry(raw, pool);
      const item = await processEntry(entry);
      results.push(item);
      console.log(`ok   ${item.id.padEnd(28)} ${item.w1400}×${item.h1400}  ${item.licence}`);
    } catch (err) {
      failures.push({ id: raw.id, error: err.message });
      console.warn(`FAIL ${raw.id.padEnd(28)} ${err.message}`);
    }
  }
  // Keep previously built entries that were not part of an --only run.
  let items = results;
  if (only.length > 0 && existsSync(MANIFEST_JSON)) {
    const prev = await import(pathToFileURL(MANIFEST_JSON).href).catch(() => null);
    if (prev?.GALLERY) {
      const ids = new Set(results.map((r) => r.id));
      items = [...prev.GALLERY.filter((p) => !ids.has(p.id)), ...results];
    }
  }
  // Manifest order follows the curated list, not download order.
  const order = new Map(GALLERY_LIST.map((e, i) => [e.id, i]));
  items.sort((a, b) => order.get(a.id) - order.get(b.id));
  await writeFile(MANIFEST, manifestSource(items));
  await writeFile(MANIFEST_JSON, `export const GALLERY = ${JSON.stringify(items)};\n`);
  await writeFile(CREDITS, creditsSource(items));
  if (flag("--sheet")) await contactSheet(items);
  console.log(`\n${items.length} works in manifest, ${failures.length} failures`);
  for (const f of failures) console.log(`  - ${f.id}: ${f.error}`);
  const total = (await Promise.all(items.flatMap((a) => SIZES.map((s) => stat(path.join(OUT_DIR, `${a.id}-${s}.webp`)))))).reduce((n, s) => n + s.size, 0);
  console.log(`public/gallery total: ${(total / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
