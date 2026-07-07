import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Any Text in Levels — learn languages with real content";

const LEVELS: { label: string; color: string }[] = [
  { label: "A1", color: "#2f7d4f" },
  { label: "A2", color: "#1e8a70" },
  { label: "B1", color: "#2b6cb0" },
  { label: "B2", color: "#6d4fa3" },
  { label: "C1", color: "#b93f76" },
  { label: "C2", color: "#c03a2b" },
];

const TITLE = "Any Text in Levels";
const TAGLINE_LINE_1 = "Real news, art, film & history — every day,";
const TAGLINE_LINE_2 = "rewritten at your level, from A1 to C2.";
const DOMAIN = "anytext.art";

/**
 * Satori (the renderer behind ImageResponse) has no real browser font stack
 * to fall back on — without an explicit font it silently substitutes glyphs
 * for some words from a different fallback font with different metrics,
 * which showed up as inconsistent gaps around short words ("in", "at").
 * Loading the site's own display font sidesteps that entirely and matches
 * the real site's wordmark. Google Fonts serves TTF (which Satori can read,
 * unlike WOFF2) only to old/legacy user agents — hence the spoofed UA.
 */
async function loadFont(text: string, weight: number): Promise<ArrayBuffer> {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}&text=${encodeURIComponent(text)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
        },
      },
    )
  ).text();
  const fontUrl = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/)?.[1];
  if (!fontUrl) throw new Error("Bricolage Grotesque font URL not found in Google Fonts CSS");
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

/**
 * Default social-share card (Facebook/Twitter/LinkedIn/etc. link previews)
 * for the homepage and any section page that doesn't set its own — content
 * pages (article/art/books/films/history/quotes) override this with their
 * own real image via lib/seo.ts's articleMetadata(), so this only covers
 * the general/landing pages.
 */
export default async function Image() {
  const allText = [TITLE, TAGLINE_LINE_1, TAGLINE_LINE_2, DOMAIN, ...LEVELS.map((l) => l.label)].join(
    " ",
  );
  const fontData = await loadFont(allText, 700);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: "#fcfbf7",
          fontFamily: "Bricolage Grotesque",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 76,
            fontWeight: 700,
            color: "#212e3e",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ display: "flex" }}>Any Text in&#160;</span>
          <span style={{ display: "flex", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                bottom: 6,
                top: 30,
                background: "#ffd84d",
                borderRadius: 4,
                transform: "rotate(-1deg)",
              }}
            />
            <span style={{ display: "flex", position: "relative" }}>
              Levels
            </span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 32,
            fontWeight: 700,
            color: "#5c6b7a",
            lineHeight: 1.5,
          }}
        >
          <span style={{ display: "flex" }}>{TAGLINE_LINE_1}</span>
          <span style={{ display: "flex" }}>{TAGLINE_LINE_2}</span>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 56 }}>
          {LEVELS.map(({ label, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: color,
                color: "#fdfcf8",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 24,
            fontWeight: 600,
            color: "#e0503a",
          }}
        >
          {DOMAIN}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: fontData, style: "normal", weight: 700 },
      ],
    },
  );
}
