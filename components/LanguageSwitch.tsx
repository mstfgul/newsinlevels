"use client";

import { LANGUAGES } from "@/lib/types";
import { usePreferences } from "./Preferences";

const FLAGS: Record<string, string> = { en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷" };

export function LanguageSwitch() {
  const { language, setLanguage } = usePreferences();
  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`cursor-pointer rounded-md px-2.5 py-1.5 uppercase tracking-wide transition-colors ${
            language === lang
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="mr-1" aria-hidden>
            {FLAGS[lang]}
          </span>
          {lang}
        </button>
      ))}
    </div>
  );
}
