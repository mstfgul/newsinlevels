"use client";

import type { Article } from "@/lib/types";
import { LEVEL_DESCRIPTIONS } from "@/lib/levels";
import { usePreferences } from "./Preferences";
import { LevelLadder } from "./LevelLadder";
import { HighlightedText } from "./HighlightedText";

export function ArticleReader({ article }: { article: Article }) {
  const { language, level, setLevel } = usePreferences();
  const version = article.languages[language][level];
  const wordCount = version.text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 160));

  return (
    <article>
      <LevelLadder level={level} onSelect={setLevel} />
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {level} · {LEVEL_DESCRIPTIONS[level]} · {wordCount} words · ~{minutes}{" "}
        min
      </p>

      <div
        key={`${language}-${level}`}
        className="level-swap mt-6 rounded-lg border border-border bg-card"
      >
        {/* Red margin line, like a ruled exercise book. */}
        <div className="border-l-2 border-margin-red p-6 pl-7 sm:p-9 sm:pl-11">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {article.date} ·{" "}
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {article.source.name}
            </a>
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {version.title}
          </h1>
          <div className="article-body mt-6">
            <HighlightedText
              text={version.text}
              vocabulary={version.vocabulary}
            />
          </div>
        </div>
      </div>

      {version.vocabulary.length > 0 && (
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
                className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <dt
                  className="shrink-0 font-semibold sm:w-48"
                  style={{ fontFamily: "var(--font-literata)" }}
                >
                  <mark className="vocab" style={{ cursor: "text" }}>
                    {item.word}
                  </mark>
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
