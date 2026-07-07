import fs from "node:fs";
import path from "node:path";
import type {
  ArtIndexEntry,
  Article,
  BookIndexEntry,
  FilmIndexEntry,
  HistoryIndexEntry,
  IndexEntry,
  QuoteIndexEntry,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

// Every deploy pre-renders every path returned by generateStaticParams, so a
// site with years of daily content would make each build slower forever.
// Content never changes once published, so only the recent window needs to
// be built up front — older pages render on-demand on their first visit
// (Next's default dynamicParams=true) and are then cached just like any
// other static page.
const STATIC_WINDOW_DAYS = 30;

export function recentWindow<T extends { date: string }>(entries: T[]): T[] {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - STATIC_WINDOW_DAYS);
  const cutoffDate = cutoff.toISOString().slice(0, 10);
  return entries.filter((entry) => entry.date >= cutoffDate);
}

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

export function getHistoryIndex(): HistoryIndexEntry[] {
  const file = path.join(DATA_DIR, "history-index.json");
  if (!fs.existsSync(file)) return [];
  const entries: HistoryIndexEntry[] = JSON.parse(
    fs.readFileSync(file, "utf8"),
  );
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getHistoryEvent(id: string): Article {
  const file = path.join(DATA_DIR, "history", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getQuoteIndex(): QuoteIndexEntry[] {
  const file = path.join(DATA_DIR, "quotes-index.json");
  if (!fs.existsSync(file)) return [];
  const entries: QuoteIndexEntry[] = JSON.parse(fs.readFileSync(file, "utf8"));
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getQuote(id: string): Article {
  const file = path.join(DATA_DIR, "quotes", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getFilmIndex(): FilmIndexEntry[] {
  const file = path.join(DATA_DIR, "films-index.json");
  if (!fs.existsSync(file)) return [];
  const entries: FilmIndexEntry[] = JSON.parse(fs.readFileSync(file, "utf8"));
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getFilm(id: string): Article {
  const file = path.join(DATA_DIR, "films", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function getBookIndex(): BookIndexEntry[] {
  const file = path.join(DATA_DIR, "books-index.json");
  if (!fs.existsSync(file)) return [];
  const entries: BookIndexEntry[] = JSON.parse(fs.readFileSync(file, "utf8"));
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export function getBook(id: string): Article {
  const file = path.join(DATA_DIR, "books", `${id}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
