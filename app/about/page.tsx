import type { Metadata } from "next";
import Link from "next/link";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About — free graded reading for language learners",
  description:
    "Any Text in Levels rewrites real news, art, films, books, quotes and history at CEFR levels A1–C2 in English, German, French and Spanish. How it works, what the levels mean, and how to use it to learn a language by reading.",
  path: "/about/",
});

const LEVELS: [string, string][] = [
  ["A1", "Beginner — very short sentences, only the most common words."],
  ["A2", "Elementary — simple past and future appear, sentences stay short."],
  ["B1", "Intermediate — relative clauses and everyday news vocabulary."],
  ["B2", "Upper intermediate — full grammar, common idioms, real news register."],
  ["C1", "Advanced — rich vocabulary and sophisticated sentence structure."],
  ["C2", "Mastery — the text a skilled native writer would produce."],
];

const SECTIONS: [string, string, string][] = [
  ["/news/", "News", "three real stories from the world's news, every day"],
  ["/art/", "Daily Art", "one famous painting, looked at closely"],
  ["/films/", "Film Club", "one great film, discussed without spoilers"],
  ["/books/", "Book Club", "one great book, introduced invitingly"],
  ["/quotes/", "Quotes", "one famous line, translated and explained"],
  ["/history/", "On This Day", "one historical event from today's date"],
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `About ${SITE_NAME}`,
          url: `${SITE_URL}/about/`,
          about: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <PageIntro title="About this notebook">
        the same real text, rewritten <Highlight>at your level</Highlight> —
        that&apos;s the whole idea
      </PageIntro>

      <div className="space-y-10 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        <section>
          <p>
            <strong>Any Text in Levels</strong> is a free reading room for
            language learners. Every day it takes real material — news from the
            BBC, a painting from the Met&apos;s open collection, a classic
            film, a great book, a famous quote, a historical event — and
            rewrites it at all six CEFR levels, from A1 (beginner) to C2
            (mastery), in <strong>English, German, French and Spanish</strong>.
          </p>
          <p className="mt-4">
            Reading things you actually care about is the most reliable way to
            grow a language. The problem is that real texts are usually too
            hard, and learner texts are usually too boring. This site removes
            that trade-off: you read <em>today&apos;s</em> stories, at a
            difficulty you can genuinely handle, and move up a level whenever
            you&apos;re ready — the story stays the same, only the language
            grows with you.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
            What the levels mean
          </h2>
          <p className="mb-4">
            The levels follow the{" "}
            <strong>Common European Framework of Reference (CEFR)</strong>, the
            scale used by language schools and exams across Europe:
          </p>
          <dl className="ruled">
            {LEVELS.map(([level, description]) => (
              <div key={level} className="flex gap-4 py-3">
                <dt className="w-8 shrink-0 font-mono text-sm font-semibold">{level}</dt>
                <dd className="text-muted-foreground">{description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4">
            Not sure where you stand? Open any story at B1. If it feels
            effortless, go up; if you stop more than a few times per paragraph,
            go down. The <em>Compare</em> button shows two levels side by side,
            which is the quickest way to feel the difference. There&apos;s also
            a practice page for every language and level — start from{" "}
            <Link href="/read/english/b1/" className="underline underline-offset-4 hover:text-primary">
              English
            </Link>
            ,{" "}
            <Link href="/read/german/b1/" className="underline underline-offset-4 hover:text-primary">
              German
            </Link>
            ,{" "}
            <Link href="/read/french/b1/" className="underline underline-offset-4 hover:text-primary">
              French
            </Link>{" "}
            or{" "}
            <Link href="/read/spanish/b1/" className="underline underline-offset-4 hover:text-primary">
              Spanish
            </Link>{" "}
            and pick your level from there.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
            What&apos;s in the notebook
          </h2>
          <ul className="ruled">
            {SECTIONS.map(([href, label, blurb]) => (
              <li key={href} className="flex flex-wrap gap-x-3 py-3">
                <Link href={href} className="font-semibold underline underline-offset-4 hover:text-primary">
                  {label}
                </Link>
                <span className="text-muted-foreground">{blurb}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
            How to work with a text
          </h2>
          <p>
            Every story comes with the tools of a good exercise book:{" "}
            <strong>tap any word</strong> for a dictionary definition, study
            the <strong>word notebook</strong> under the text, then test
            yourself with the <strong>comprehension questions</strong>. You can
            also print any story as a clean worksheet, compare two levels side
            by side, or read the same story in another of the four languages.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
            Who makes this
          </h2>
          <p>
            The site is built and maintained by{" "}
            <a
              href="https://www.linkedin.com/in/mustafa-gul00/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              Mustafa Gül
            </a>
            , a language learner himself. The rewriting is done with AI under
            strict level constraints, from real, credited sources — every story
            links back to where it came from. It&apos;s free, has no ads and no
            sign-up; if it helps you, you can{" "}
            <a
              href="https://buymeacoffee.com/mstfgul00q"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              buy me a coffee
            </a>
            . New texts arrive every morning — also via the{" "}
            <a href="/feed.xml" className="underline underline-offset-4 hover:text-primary">
              RSS feed
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
