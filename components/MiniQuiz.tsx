"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

const LETTERS = ["a", "b", "c", "d"];

/**
 * Comprehension check, marked like a teacher would: pick an answer, get an
 * immediate red-pen tick or cross, and a score note once every question is
 * answered.
 */
export function MiniQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const done = answered === questions.length;

  return (
    <div>
      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi}>
              <p className="mb-2 font-semibold" style={{ fontFamily: "var(--font-literata)" }}>
                <span className="mr-2 font-mono text-xs text-muted-foreground">
                  {qi + 1}.
                </span>
                {q.question}
              </p>
              <div className="space-y-1.5">
                {q.options.map((option, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = q.answer === oi;
                  const showRight = chosen !== null && isRight;
                  const showWrong = isChosen && !isRight;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={chosen !== null}
                      onClick={() =>
                        setAnswers((prev) =>
                          prev.map((a, i) => (i === qi ? oi : a)),
                        )
                      }
                      className={`flex w-full cursor-pointer items-baseline gap-2 rounded-md border px-3 py-1.5 text-left text-[15px] transition-colors disabled:cursor-default ${
                        showRight
                          ? "border-foreground/40 bg-[var(--hl)]"
                          : showWrong
                            ? "border-margin-red/60"
                            : "border-border hover:enabled:bg-foreground/5"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {LETTERS[oi]})
                      </span>
                      <span
                        className={showWrong ? "line-through opacity-60" : undefined}
                        style={{ fontFamily: "var(--font-literata)" }}
                      >
                        {option}
                      </span>
                      {showRight && (
                        <span aria-hidden className="ml-auto text-margin-red">
                          ✓
                        </span>
                      )}
                      {showWrong && (
                        <span aria-hidden className="ml-auto text-margin-red">
                          ✗
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {done && (
        <p className="hand-note mt-5 rotate-[-1deg]" style={{ fontSize: "1.3rem" }}>
          {correct}/{questions.length}
          {correct === questions.length
            ? " — perfect, you really read it!"
            : correct >= questions.length / 2
              ? " — good, read once more and try the gaps"
              : " — read the text again, slowly"}
        </p>
      )}
    </div>
  );
}
