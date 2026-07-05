import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Literata, IBM_Plex_Mono } from "next/font/google";
import { PreferencesProvider } from "@/components/Preferences";
import { LanguageSwitch } from "@/components/LanguageSwitch";
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

export const metadata: Metadata = {
  title: "News in Levels — learn languages with real news",
  description:
    "Real daily news rewritten at CEFR levels A1–C2 in English, German and French.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${literata.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PreferencesProvider>
          <header className="border-b border-border">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
              <Link href="/" className="text-lg font-bold tracking-tight">
                News in{" "}
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
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Real news · A1–C2 · EN / DE / FR
          </footer>
        </PreferencesProvider>
      </body>
    </html>
  );
}
