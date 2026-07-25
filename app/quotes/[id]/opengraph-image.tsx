import { ImageResponse } from "next/og";
import { getQuote, getQuoteIndex, recentWindow } from "@/lib/data";
import { loadGoogleFont } from "@/lib/og";

export const alt = "A quote of the day, translated and explained at your level";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOMAIN = "anytext.art";

/** Prebuild cards for the recent window; older ones render on first request. */
export function generateStaticParams() {
  return recentWindow(getQuoteIndex()).map((entry) => ({ id: entry.id }));
}

/** Longer lines get a smaller face so the quote always fits the card. */
function quoteSize(length: number): number {
  if (length <= 55) return 62;
  if (length <= 110) return 52;
  if (length <= 180) return 43;
  if (length <= 260) return 35;
  return 29;
}

/**
 * The social-share card for a single quote: the line itself in the site's
 * serif, the author signed underneath, on the notebook paper the rest of the
 * site is made of. This doubles as the downloadable card behind the share
 * button on the page.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getQuote(id);
  const quote = article.languages.en.B1.title;
  const author = article.quote?.author ?? "";

  const [literata, caveat, bricolage] = await Promise.all([
    loadGoogleFont({ family: "Literata", weight: 500, italic: true, text: quote }),
    loadGoogleFont({ family: "Caveat", weight: 700, text: author }),
    loadGoogleFont({
      family: "Bricolage Grotesque",
      weight: 700,
      text: `Any Text in Levels ${DOMAIN}`,
    }),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 90px 64px 96px",
          background: "#fcfbf7",
          position: "relative",
        }}
      >
        {/* The red margin rule of a ruled exercise book. */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#e0503a",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {/* An oversized opening quotation mark, set into the margin. */}
          <div
            style={{
              display: "flex",
              fontFamily: "Literata",
              fontStyle: "italic",
              fontSize: 150,
              lineHeight: 1,
              color: "#e0503a",
              marginBottom: -30,
              marginLeft: -8,
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Literata",
              fontStyle: "italic",
              fontSize: quoteSize(quote.length),
              lineHeight: 1.32,
              color: "#212e3e",
              letterSpacing: "-0.01em",
            }}
          >
            {quote}
          </div>
          {author && (
            <div
              style={{
                display: "flex",
                fontFamily: "Caveat",
                fontSize: 48,
                color: "#5c6b7a",
                marginTop: 34,
              }}
            >
              — {author}
            </div>
          )}
        </div>

        {/* The wordmark, matching the header on the real site. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Bricolage Grotesque",
              fontSize: 34,
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
                  left: -5,
                  right: -5,
                  bottom: 3,
                  top: 14,
                  background: "#ffd84d",
                  borderRadius: 3,
                  transform: "rotate(-1deg)",
                }}
              />
              <span style={{ display: "flex", position: "relative" }}>Levels</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Bricolage Grotesque",
              fontSize: 26,
              fontWeight: 700,
              color: "#e0503a",
            }}
          >
            {DOMAIN}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Literata", data: literata, style: "italic", weight: 500 },
        { name: "Caveat", data: caveat, style: "normal", weight: 700 },
        { name: "Bricolage Grotesque", data: bricolage, style: "normal", weight: 700 },
      ],
    },
  );
}
