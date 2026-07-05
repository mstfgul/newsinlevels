import fs from "node:fs";
import path from "node:path";
import type { ArtIndexEntry, Article, IndexEntry } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export function getIndex(): IndexEntry[] {
  const file = path.join(DATA_DIR, "index.json");
  if (!fs.existsSync(file)) return [];
  const entries: IndexEntry[] = JSON.parse(fs.readFileSync(file, "utf8"));
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(id: string): Article {
  const file = path.join(DATA_DIR, "articles", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getArtIndex(): ArtIndexEntry[] {
  const file = path.join(DATA_DIR, "art-index.json");
  if (!fs.existsSync(file)) return [];
  const entries: ArtIndexEntry[] = JSON.parse(fs.readFileSync(file, "utf8"));
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getArtwork(id: string): Article {
  const file = path.join(DATA_DIR, "art", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
