"use client";

import { useState } from "react";

const BUTTON =
  "cursor-pointer rounded-md border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground";

/**
 * Share strip for a quote page. "Share" hands the page link to the native
 * share sheet (where the OG card renders the preview) and falls back to
 * copying the link; "Card" downloads the generated 1200×630 share image.
 */
export function ShareQuote({
  url,
  cardUrl,
  quote,
  author,
}: {
  url: string;
  cardUrl: string;
  quote: string;
  author: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = author ? `“${quote}” — ${author}` : `“${quote}”`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Any Text in Levels", text, url });
        return;
      } catch {
        // User dismissed the sheet, or share failed — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — nothing more we can do silently.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Share this quote
      </span>
      <button type="button" onClick={share} className={BUTTON}>
        {copied ? "✓ Link copied" : "↗ Share"}
      </button>
      <a href={cardUrl} download={`quote-${author || "anytext"}.png`} className={BUTTON}>
        ⬇ Card
      </a>
    </div>
  );
}
