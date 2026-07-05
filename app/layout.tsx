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

export const metadata: Metadata = {
  title: "Any Text in Levels — learn languages with real content",
  description:
    "Real news, art, quotes and history rewritten at CEFR levels A1–C2 in English, German, French and Turkish.",
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
          <header className="border-b border-border">
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
          <footer className="border-t border-border py-6 text-center">
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
            </a>
          </footer>
        </PreferencesProvider>
      </body>
    </html>
  );
}
