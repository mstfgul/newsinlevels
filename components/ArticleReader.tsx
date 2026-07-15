"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article, Language, Level } from "@/lib/types";
import { LANGUAGE_LABELS, LEVELS, resolveLanguage } from "@/lib/types";
import { LEVEL_DESCRIPTIONS } from "@/lib/levels";
import { usePreferences } from "./Preferences";
import { LevelLadder } from "./LevelLadder";
import { HighlightedText } from "./HighlightedText";
import { MiniQuiz } from "./MiniQuiz";

function bodyClass(level: Level): string {
  return level === "A1" || level === "A2"
    ? "article-body article-body--easy"
    : "article-body";
}

function ComparePicker<T extends string>({
  options,
  value,
  onSelect,
  label,
}: {
  options: readonly T[];
  value: T;
  onSelect: (value: T) => void;
  label: string;
}) {
  return (
    <span role="group" aria-label={label} className="flex gap-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          aria-pressed={option === value}
          className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[11px] uppercase transition-colors ${
            option === value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </span>
  );
}

export function ArticleReader({
  article,
  fixedLanguage,
  basePath,
}: {
  article: Article;
  // Pins the reader to one language edition (the /…/de/ pages); without it
  // the reader follows the visitor's language preference.
  fixedLanguage?: Language;
  // The article's canonical path, used to link the language editions.
  basePath?: string;
}) {
  const { language, level, setLevel } = usePreferences();
  const lang = fixedLanguage ?? resolveLanguage(article.languages, language);
  const version = article.languages[lang]![level];
  const wordCount = version.text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 160));

  const availableLanguages = (
    Object.keys(LANGUAGE_LABELS) as Language[]
  ).filter((l) => article.languages[l]);

  const [compare, setCompare] = useState(false);
  const [compareLang, setCompareLang] = useState<Language>(lang);
  const [compareLevel, setCompareLevel] = useState<Level>(level);

  const toggleCompare = () => {
    if (!compare) {
      // Default to the same story one level up (or down, from C2).
      const i = LEVELS.indexOf(level);
      setCompareLang(lang);
      setCompareLevel(LEVELS[i + 1] ?? LEVELS[i - 1]);
    }
    setCompare(!compare);
  };

  const compareVersion = article.languages[compareLang]?.[compareLevel];

  return (
    <article>
      <div className="sticky top-0 z-20 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm print:hidden">
        <LevelLadder level={level} onSelect={setLevel} />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {level} · {LEVEL_DESCRIPTIONS[level]} · {wordCount} words · ~{minutes}{" "}
          min
        </p>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-md border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            ⎙ Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={toggleCompare}
            aria-pressed={compare}
            className={`cursor-pointer rounded-md border px-2.5 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
              compare
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {compare ? "✕ Close compare" : "⇄ Compare"}
          </button>
        </div>
      </div>

      {!fixedLanguage && lang !== language && (
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-margin-red">
          {LANGUAGE_LABELS[language]} version coming soon — showing English
        </p>
      )}

      {/* Crawlable links between the language editions of this story. */}
      {basePath && availableLanguages.length > 1 && (
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Read in:{" "}
          {availableLanguages.map((l, i) => (
            <span key={l}>
              {i > 0 && " · "}
              {l === lang ? (
                <span className="text-foreground underline underline-offset-4">
                  {LANGUAGE_LABELS[l]}
                </span>
              ) : (
                <Link
                  href={l === "en" ? basePath : `${basePath}${l}/`}
                  className="transition-colors hover:text-foreground"
                >
                  {LANGUAGE_LABELS[l]}
                </Link>
              )}
            </span>
          ))}
        </p>
      )}

      <div className="level-swap mt-6 rounded-lg border border-border bg-card">
        {/* Red margin line, like a ruled exercise book. */}
        <div className="border-l-2 border-margin-red p-6 pl-7 sm:p-9 sm:pl-11">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {article.art ? (
              <>
                {article.art.artist} · {article.art.year} ·{" "}
                {article.art.medium} ·{" "}
              </>
            ) : article.history ? (
              <>On this day · {article.history.year} · </>
            ) : article.quote ? (
              <>Quote of the day · {article.quote.author} · </>
            ) : article.film ? (
              <>
                {article.film.director} · {article.film.year} ·{" "}
                {article.film.genres} ·{" "}
              </>
            ) : article.book ? (
              <>
                {article.book.author} · {article.book.year} ·{" "}
              </>
            ) : (
              <>{article.date} · </>
            )}
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {article.source.name}
            </a>
            {!article.art &&
              !article.history &&
              !article.quote &&
              !article.film &&
              !article.book &&
              article.category && <> · {article.category}</>}
          </p>

          {article.image && (
            <figure
              className={`clipping mx-auto mb-8 mt-7 w-full rotate-[-1.1deg] ${
                article.film || article.book ? "max-w-xs" : "max-w-lg"
              }`}
            >
              <img
                src={article.image}
                alt={article.originalTitle}
                loading="eager"
              />
              <figcaption className="hand-note px-1 pt-1.5 pb-0.5">
                {article.art
                  ? `${article.art.title} — ${article.art.artist}, ${article.art.year}`
                  : article.quote
                    ? article.quote.author
                    : article.film
                      ? `${article.film.title} — ${article.film.director}, ${article.film.year}`
                      : article.book
                        ? `${article.book.title} — ${article.book.author}, ${article.book.year}`
                        : `${article.source.name} · ${article.date}`}
              </figcaption>
            </figure>
          )}

          {!compare || !compareVersion ? (
            <div key={`${lang}-${level}`} lang={lang} className="level-swap">
              {article.quote ? (
                <blockquote className="pull-quote">
                  <p>{version.title}</p>
                  <cite>— {article.quote.author}</cite>
                </blockquote>
              ) : (
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  {version.title}
                </h1>
              )}
              <div className={`${bodyClass(level)} mt-6`}>
                <HighlightedText
                  text={version.text}
                  vocabulary={version.vocabulary}
                  lang={lang}
                />
              </div>
            </div>
          ) : (
            /* Two facing pages of the open notebook. */
            <div className="grid gap-10 md:grid-cols-2 md:gap-0">
              <div
                key={`${lang}-${level}`}
                lang={lang}
                className="level-swap md:pr-7"
              >
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {lang} · {level}
                </p>
                <h2 className="text-xl font-bold leading-tight tracking-tight">
                  {version.title}
                </h2>
                <div className={`${bodyClass(level)} mt-4`}>
                  <HighlightedText
                    text={version.text}
                    vocabulary={version.vocabulary}
                    lang={lang}
                  />
                </div>
              </div>

              <div className="border-dashed border-border max-md:border-t-2 max-md:pt-8 md:border-l-2 md:pl-7">
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <ComparePicker
                    options={availableLanguages}
                    value={compareLang}
                    onSelect={setCompareLang}
                    label="Compare language"
                  />
                  <ComparePicker
                    options={LEVELS}
                    value={compareLevel}
                    onSelect={setCompareLevel}
                    label="Compare level"
                  />
                </div>
                <div
                  key={`${compareLang}-${compareLevel}`}
                  lang={compareLang}
                  className="level-swap"
                >
                  <h2 className="text-xl font-bold leading-tight tracking-tight">
                    {compareVersion.title}
                  </h2>
                  <div className={`${bodyClass(compareLevel)} mt-4`}>
                    <HighlightedText
                      text={compareVersion.text}
                      vocabulary={compareVersion.vocabulary}
                      lang={compareLang}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!compare && version.vocabulary.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Word notebook · {level}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Tap a highlighted word in the text, or study the list below.
          </p>
          <dl className="ruled">
            {version.vocabulary.map((item) => (
              <div
                key={item.word}
                className="flex flex-col gap-0.5 py-3 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-0"
              >
                <dt
                  className="font-semibold sm:pr-4"
                  style={{ fontFamily: "var(--font-literata)" }}
                >
                  <mark className="vocab" style={{ cursor: "text" }}>
                    {item.word}
                  </mark>
                </dt>
                {/* The red centre rule of a two-column vocabulary notebook. */}
                <dd className="text-[15px] leading-relaxed text-muted-foreground sm:border-l sm:border-margin-red/50 sm:pl-4">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {!compare && version.questions && version.questions.length > 0 && (
        <section className="mt-10 print:hidden">
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Comprehension check · {level}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Finished reading? See how much stuck.
          </p>
          <div className="rounded-lg border border-border bg-card p-5 sm:p-6" lang={lang}>
            <MiniQuiz key={`${lang}-${level}`} questions={version.questions} />
          </div>
        </section>
      )}
    </article>
  );
}
