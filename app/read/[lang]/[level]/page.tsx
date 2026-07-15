import type { Metadata } from "next";
import Link from "next/link";
import {
  getArtIndex,
  getBookIndex,
  getFilmIndex,
  getHistoryIndex,
  getIndex,
  getQuoteIndex,
} from "@/lib/data";
import type { Language, Level } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { articlePath, pageMetadata, SECTIONS, SITE_URL, type Section } from "@/lib/seo";

/**
 * Landing pages for the searches learners actually type — "A1 German reading
 * texts", "lecture facile en français", "textos en español B1" — one page per
 * language × level, each linking into the freshest real content. These pages
 * exist for organic discovery; the reading itself happens on the article
 * pages.
 */

const LANG_PAGES = {
  english: {
    code: "en" as Language,
    name: "English",
    titleTail: "easy real texts, new every day",
    nativeLine: null,
  },
  german: {
    code: "de" as Language,
    name: "German",
    titleTail: "Deutsch lesen üben mit echten Texten",
    nativeLine:
      "Jeden Tag neue, einfache deutsche Texte zum Lesen — Nachrichten, Kunst, Filme, Bücher, Zitate und Geschichte.",
  },
  french: {
    code: "fr" as Language,
    name: "French",
    titleTail: "lire en français avec de vrais textes",
    nativeLine:
      "Chaque jour de nouveaux textes faciles à lire en français — actualités, art, cinéma, livres, citations et histoire.",
  },
  spanish: {
    code: "es" as Language,
    name: "Spanish",
    titleTail: "leer en español con textos reales",
    nativeLine:
      "Cada día textos nuevos y fáciles de leer en español — noticias, arte, cine, libros, citas e historia.",
  },
} as const;

type LangSlug = keyof typeof LANG_PAGES;

const LEVEL_PAGES: Record<
  Level,
  { name: string; audience: string; blurb: string; guidance: string }
> = {
  A1: {
    name: "Beginner",
    audience: "complete beginners",
    blurb: "Very short sentences, present tense, and only the most common words of the language.",
    guidance:
      "Read one story a day and don't translate every word — A1 texts here are written so the story carries you. Tap a highlighted word when you're stuck, and reread yesterday's story before starting today's.",
  },
  A2: {
    name: "Elementary",
    audience: "elementary learners",
    blurb: "Simple past and future appear, sentences stay short, and every rare word is made clear from context.",
    guidance:
      "This is the level where reading starts to feel like reading. Watch how the past tense is used, and try retelling each story in two or three sentences after you finish it.",
  },
  B1: {
    name: "Intermediate",
    audience: "intermediate learners",
    blurb: "Relative clauses, present perfect and everyday news vocabulary — the level most learners should start at.",
    guidance:
      "Read the B1 text first, then open the same story at B2 with the Compare button. Seeing the same sentences said in a richer way is the fastest vocabulary lesson there is.",
  },
  B2: {
    name: "Upper intermediate",
    audience: "upper-intermediate learners",
    blurb: "The full grammar of the language — passive voice, reported speech, conditionals — in a real news register.",
    guidance:
      "At B2 the texts stop simplifying grammar, so focus on idioms and connectors. The vocabulary notebook under each text is where the most useful phrases land.",
  },
  C1: {
    name: "Advanced",
    audience: "advanced learners",
    blurb: "Rich, precise vocabulary and sophisticated sentence structure, written like genuine journalism.",
    guidance:
      "Read for style, not just meaning: notice sentence rhythm, inversion and nuanced connectors. Compare C1 against B2 to see exactly what 'advanced' adds.",
  },
  C2: {
    name: "Mastery",
    audience: "near-native readers",
    blurb: "No simplification at all — the text a skilled native writer would produce, idioms, irony and all.",
    guidance:
      "C2 is the destination: real texts with nothing softened. If a line stops you, that line is your lesson — chase the idiom, then compare with C1 to see the seam.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LANG_PAGES).flatMap((lang) =>
    LEVELS.map((level) => ({ lang, level: level.toLowerCase() })),
  );
}

function pagePath(lang: LangSlug, level: Level): string {
  return `/read/${lang}/${level.toLowerCase()}/`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; level: string }>;
}): Promise<Metadata> {
  const { lang, level: levelParam } = await params;
  const langPage = LANG_PAGES[lang as LangSlug];
  const level = levelParam.toUpperCase() as Level;
  const levelPage = LEVEL_PAGES[level];

  return pageMetadata({
    title: `${level} ${langPage.name} reading practice — ${langPage.titleTail}`,
    description: `Free ${level} ${langPage.name} reading texts for ${levelPage.audience}: real news, art, film, book, quote and history stories rewritten at CEFR ${level} (${levelPage.name.toLowerCase()}), with vocabulary and comprehension questions — new texts every day.${langPage.nativeLine ? ` ${langPage.nativeLine}` : ""}`,
    path: pagePath(lang as LangSlug, level),
  });
}

export default async function ReadingPracticePage({
  params,
}: {
  params: Promise<{ lang: string; level: string }>;
}) {
  const { lang, level: levelParam } = await params;
  const slug = lang as LangSlug;
  const { code, name, nativeLine } = LANG_PAGES[slug];
  const level = levelParam.toUpperCase() as Level;
  const levelPage = LEVEL_PAGES[level];

  // The freshest two entries per section that exist in this language.
  const sources: [Section, { id: string; date: string; titles: Partial<Record<Language, string>> }[]][] = [
    ["article", getIndex()],
    ["art", getArtIndex()],
    ["films", getFilmIndex()],
    ["books", getBookIndex()],
    ["quotes", getQuoteIndex()],
    ["history", getHistoryIndex()],
  ];
  const shelves = sources
    .map(([section, entries]) => ({
      section,
      entries: entries.filter((entry) => entry.titles[code]).slice(0, 2),
    }))
    .filter(({ entries }) => entries.length > 0);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${level} ${name} reading practice`,
          url: `${SITE_URL}${pagePath(slug, level)}`,
          description: `Real texts rewritten at CEFR ${level} for ${name} learners, updated daily.`,
          inLanguage: code,
          isAccessibleForFree: true,
          learningResourceType: "Graded reading",
          educationalLevel: `CEFR ${level}`,
        }}
      />

      <PageIntro title={`${name} reading practice · ${level}`}>
        real texts, rewritten for <Highlight>{level} readers</Highlight> — new
        pages every morning
      </PageIntro>

      <div className="space-y-10 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        <section>
          <p>
            <strong>
              {level} · {levelPage.name}:
            </strong>{" "}
            {levelPage.blurb} Every story below also exists at the other five
            CEFR levels, so when {level} starts to feel easy, the next level of
            the <em>same</em> text is one tap away.
          </p>
          {nativeLine && <p className="mt-3 text-muted-foreground" lang={code}>{nativeLine}</p>}
          <p className="hand-note mt-4 rotate-[-0.5deg]" style={{ fontSize: "1.3rem" }}>
            {levelPage.guidance}
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
            Fresh off the desk
          </h2>
          <p className="mb-4 text-muted-foreground">
            Open any story, then pick <strong>{level}</strong> on the level
            ladder at the top of the page.
          </p>
          <ul className="ruled">
            {shelves.flatMap(({ section, entries }) =>
              entries.map((entry) => (
                <li key={`${section}-${entry.id}`} className="flex flex-wrap items-baseline gap-x-3 py-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {SECTIONS[section].label}
                  </span>
                  <Link
                    href={articlePath(section, entry.id, code)}
                    lang={code}
                    className="font-semibold underline underline-offset-4 hover:text-primary"
                  >
                    {entry.titles[code]}
                  </Link>
                </li>
              )),
            )}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Other levels ·{" "}
            {LEVELS.filter((l) => l !== level).map((l, i) => (
              <span key={l}>
                {i > 0 && " · "}
                <Link href={pagePath(slug, l)} className="underline underline-offset-4 hover:text-foreground">
                  {l}
                </Link>
              </span>
            ))}
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Same level, other languages ·{" "}
            {(Object.keys(LANG_PAGES) as LangSlug[])
              .filter((l) => l !== slug)
              .map((l, i) => (
                <span key={l}>
                  {i > 0 && " · "}
                  <Link href={pagePath(l, level)} className="underline underline-offset-4 hover:text-foreground">
                    {LANG_PAGES[l].name}
                  </Link>
                </span>
              ))}
          </p>
        </section>
      </div>
    </div>
  );
}
