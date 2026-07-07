/**
 * Shared Wikipedia helpers for the fetch-*.mjs scripts that ground generated
 * text in real facts (art, book, history, quote).
 */

export async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "news-in-levels (daily learner pipeline)" },
  });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

/**
 * The REST summary endpoint (/page/summary/*) is a link-preview API — its
 * "extract" is just the first paragraph, often truncated to a couple of
 * sentences (well under 100 words). That's too little grounded material for
 * the model to legitimately reach a 380-560 word C1/C2 text without either
 * padding or inventing. This fetches the FULL lead section instead (still
 * only the intro, not the whole article, but uncut) via the action API.
 * Returns "" on any failure so callers can fall back to the short extract.
 */
export async function wikipediaIntroExtract(title) {
  try {
    const data = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(
        title,
      )}&format=json`,
    );
    const page = Object.values(data?.query?.pages ?? {})[0];
    return page?.extract?.trim() || "";
  } catch {
    return "";
  }
}

// The lead section (wikipediaIntroExtract) is mostly "what happened" —
// premise, production, release. The actual "why it matters" — themes,
// interpretation, critical debate, legacy — lives further down the article,
// in its own section. This pulls just that section's plain text so the
// model can draw on real critical discussion instead of only its own
// training-data memory of the work.
const ANALYSIS_SECTION_NAMES = [
  "themes and interpretations",
  "themes",
  "analysis",
  "critical analysis",
  "interpretation",
  "legacy",
];

function parseWikiHeadings(text) {
  const regex = /^(={2,6})\s*(.+?)\s*\1$/gm;
  const headings = [];
  let match;
  while ((match = regex.exec(text))) {
    headings.push({
      level: match[1].length,
      name: match[2].trim(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return headings;
}

export async function wikipediaAnalysisSection(title, maxWords = 700) {
  try {
    const data = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(
        title,
      )}&format=json`,
    );
    const page = Object.values(data?.query?.pages ?? {})[0];
    const text = page?.extract;
    if (!text) return "";

    const headings = parseWikiHeadings(text);
    for (const wanted of ANALYSIS_SECTION_NAMES) {
      const found = headings.find((h) => h.name.toLowerCase() === wanted);
      if (!found) continue;
      const next = headings.find((h) => h.start > found.start && h.level <= found.level);
      const section = text.slice(found.end, next ? next.start : text.length).trim();
      if (!section) continue;
      const words = section.split(/\s+/);
      return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}…` : section;
    }
  } catch {
    // No section found or fetch failed — caller just skips this fact.
  }
  return "";
}
