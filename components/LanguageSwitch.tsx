"use client";

import { LANGUAGES } from "@/lib/types";
import { usePreferences } from "./Preferences";

export function LanguageSwitch() {
  const { language, setLanguage } = usePreferences();
  return (
    <div className="flex items-center font-mono text-sm">
      {LANGUAGES.map((lang) => {
        const active = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={active}
            className={`relative cursor-pointer px-2.5 py-1.5 uppercase tracking-wide transition-colors ${
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang}
            {/* The teacher's red pen, circling today's language. */}
            {active && (
              <svg
                aria-hidden
                viewBox="0 0 64 36"
                preserveAspectRatio="none"
                className="pen-circle pointer-events-none absolute inset-0 h-full w-full"
              >
                <path
                  d="M14,29 C4,26 3,15 12,9 C22,3 46,3 55,9 C63,15 61,26 50,30 C40,33 20,33 12,28"
                  fill="none"
                  stroke="var(--margin-red)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={100}
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
