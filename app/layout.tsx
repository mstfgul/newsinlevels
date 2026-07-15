import type { Metadata } from "next";
import Link from "next/link";
import {
  Bricolage_Grotesque,
  Literata,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google";
import { PreferencesProvider } from "@/components/Preferences";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { NavTabs } from "@/components/NavTabs";
import { PomodoroClock } from "@/components/PomodoroClock";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const DEFAULT_TITLE =
  "Any Text in Levels — daily news, art & stories at your level (CEFR A1–C2)";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${SITE_NAME} — daily feed` },
      ],
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${literata.variable} ${plexMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PreferencesProvider>
          <header className="border-b border-border print:hidden">
            <div className="mx-auto max-w-3xl px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight"
                >
                  <img src="/icon.svg" alt="" aria-hidden className="size-6" />
                  <span className="hidden sm:inline">Any Text in </span>
                  <span className="relative inline-block px-1">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0.5 top-1.5 -rotate-1 rounded-sm"
                      style={{ background: "var(--hl-strong)" }}
                    />
                    <span className="relative">Levels</span>
                  </span>
                </Link>
                <LanguageSwitch />
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <NavTabs />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
            {children}
          </main>
          <PomodoroClock />
          <footer className="border-t border-border py-6 text-center print:hidden">
            {/* Crawlable entry points into the reading-practice landing pages. */}
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              reading practice ·{" "}
              <Link href="/read/english/b1/" className="underline underline-offset-4 hover:text-foreground">
                English
              </Link>{" "}
              ·{" "}
              <Link href="/read/german/b1/" className="underline underline-offset-4 hover:text-foreground">
                Deutsch
              </Link>{" "}
              ·{" "}
              <Link href="/read/french/b1/" className="underline underline-offset-4 hover:text-foreground">
                Français
              </Link>{" "}
              ·{" "}
              <Link href="/read/spanish/b1/" className="underline underline-offset-4 hover:text-foreground">
                Español
              </Link>
            </p>
            <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-3">
              <Link
                href="/about/"
                className="hand-note inline-flex items-baseline gap-1.5 rotate-[-0.5deg] transition-colors hover:text-foreground"
                style={{ fontSize: "1.35rem" }}
              >
                about this notebook
              </Link>
              <a
                href="/feed.xml"
                className="hand-note inline-flex items-baseline gap-1.5 rotate-[1.2deg] transition-colors hover:text-foreground"
                style={{ fontSize: "1.35rem" }}
              >
                rss
              </a>
              <a
                href="https://www.linkedin.com/in/mustafa-gul00/"
                target="_blank"
                rel="noopener noreferrer"
                className="hand-note inline-flex items-baseline gap-1.5 rotate-[-1deg] transition-colors hover:text-foreground"
                style={{ fontSize: "1.35rem" }}
              >
                created by Musti
                {/* A heart doodled in the margin, in the teacher's red pen. */}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 self-center"
                  fill="none"
                  stroke="var(--margin-red)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12,20 C6,15 2.5,10.5 4.5,6.5 C6.5,3 11,4 12,8 C13,4 17.5,3 19.5,6.5 C21.5,10.5 18,15 12.5,19.5" />
                </svg>
                {/* The LinkedIn badge, redrawn with the blue ink pen. */}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-[1.15rem] w-[1.15rem] rotate-[3deg] self-center"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7,3.5 C13,3 17,3 20,3.8 C20.8,7 21,13 20.2,20 C14,20.8 9,20.8 4,20.2 C3.2,14 3.2,9 3.8,4.2 C4.8,3.8 5.8,3.6 7,3.5" />
                  <circle cx="8" cy="8.3" r="1.2" fill="var(--primary)" stroke="none" />
                  <path d="M8,11.4 L8,16.6" />
                  <path d="M12,16.6 L12,11.6 M12,13.6 C12.5,11.8 16.2,11 16.2,14 L16.2,16.6" />
                </svg>
              </a>
              <a
                href="https://buymeacoffee.com/mstfgul00q"
                target="_blank"
                rel="noopener noreferrer"
                className="hand-note inline-flex items-baseline gap-1.5 rotate-[1deg] transition-colors hover:text-foreground"
                style={{ fontSize: "1.35rem" }}
              >
                buy me a coffee
                {/* A to-go cup, redrawn with steam curling off it. */}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-[1.15rem] w-[1.15rem] rotate-[-2deg] self-center"
                  fill="none"
                  stroke="#ffd60a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5,10 L5,17 C5,19.2 7.2,20.5 10,20.5 L13,20.5 C15.8,20.5 18,19.2 18,17 L18,10 Z" />
                  <path d="M18,11 C21,11 21,15.5 18,15.5" />
                  <path d="M8.5,7.5 C8.5,6.3 9.5,6.3 9.5,5 C9.5,3.7 8.5,3.7 8.5,2.5" />
                  <path d="M13,7.5 C13,6.3 14,6.3 14,5 C14,3.7 13,3.7 13,2.5" />
                </svg>
              </a>
            </div>
          </footer>
        </PreferencesProvider>
      </body>
    </html>
  );
}
