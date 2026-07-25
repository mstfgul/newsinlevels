/**
 * Font loading for next/og ImageResponse cards (server-side only).
 *
 * Satori (the renderer behind ImageResponse) has no browser font stack to fall
 * back on — without an explicit font it silently substitutes glyphs from a
 * different fallback with different metrics, which shows up as inconsistent
 * gaps around short words. Loading the site's real display fonts sidesteps
 * that and matches the live wordmark.
 *
 * Google Fonts serves TTF (which Satori can read, unlike WOFF2) only to
 * old/legacy user agents — hence the spoofed UA. We subset with `&text=` so
 * each card only downloads the glyphs it actually paints.
 */

const LEGACY_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";

export async function loadGoogleFont({
  family,
  weight = 400,
  italic = false,
  text,
}: {
  family: string;
  weight?: number;
  italic?: boolean;
  text: string;
}): Promise<ArrayBuffer> {
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:${axis}&text=${encodeURIComponent(text)}`;

  const css = await (
    await fetch(url, { headers: { "User-Agent": LEGACY_UA } })
  ).text();

  const fontUrl = css.match(
    /src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/,
  )?.[1];
  if (!fontUrl) {
    throw new Error(`${family} font URL not found in Google Fonts CSS`);
  }
  return (await fetch(fontUrl)).arrayBuffer();
}
