"use client";

import type { LegalLang } from "@/lib/legal";

/**
 * Language picker for the legal/informational pages (privacy, support).
 * Visually echoes LanguageSwitch's red pen-circle affordance, but is a pure
 * controlled component driven entirely by props — no dependency on
 * usePreferences/LANGUAGES, since those 4 languages are for the reading
 * content experience, not this 7-language legal content.
 */
export function LegalLanguagePicker({
  languages,
  active,
  onSelect,
}: {
  languages: readonly LegalLang[];
  active: LegalLang;
  onSelect: (lang: LegalLang) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 font-mono text-sm">
      {languages.map((lang) => {
        const isActive = active === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onSelect(lang)}
            aria-pressed={isActive}
            className={`relative cursor-pointer px-2.5 py-1.5 uppercase tracking-wide transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang}
            {/* The teacher's red pen, circling the chosen language. */}
            {isActive && (
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
