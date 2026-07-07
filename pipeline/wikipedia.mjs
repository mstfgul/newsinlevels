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
