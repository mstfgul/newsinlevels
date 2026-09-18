"use client";

/**
 * Language picker — the teacher's red pen circling the chosen language.
 * A pure controlled component: any string codes (the 7 legal-page languages
 * on privacy/support/story, the 14 dictionary languages in the homepage
 * word demo), no dependency on content data. `labels` overrides the
 * uppercase code (e.g. an endonym).
 */
export function LegalLanguagePicker<T extends string>({
  languages,
  active,
  onSelect,
  labels,
}: {
  languages: readonly T[];
  active: T;
  onSelect: (lang: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 font-mono text-sm">
      {languages.map((lang) => {
        const isActive = active === lang;
        const label = labels?.[lang];
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onSelect(lang)}
            aria-pressed={isActive}
            aria-label={label ? `${label} (${lang})` : undefined}
            className={`relative cursor-pointer px-2.5 py-1.5 tracking-wide transition-colors ${label ? "" : "uppercase"} ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label ?? lang}
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
