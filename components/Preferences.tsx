"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Language, Level } from "@/lib/types";
import { LANGUAGES, LEVELS } from "@/lib/types";

interface Preferences {
  language: Language;
  level: Level;
  setLanguage: (language: Language) => void;
  setLevel: (level: Level) => void;
}

const PreferencesContext = createContext<Preferences>({
  language: "en",
  level: "B1",
  setLanguage: () => {},
  setLevel: () => {},
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [level, setLevel] = useState<Level>("B1");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("nil-language") as Language;
    const storedLevel = localStorage.getItem("nil-level") as Level;
    if (LANGUAGES.includes(storedLanguage)) setLanguage(storedLanguage);
    if (LEVELS.includes(storedLevel)) setLevel(storedLevel);
  }, []);

  const update = {
    setLanguage: (value: Language) => {
      setLanguage(value);
      localStorage.setItem("nil-language", value);
    },
    setLevel: (value: Level) => {
      setLevel(value);
      localStorage.setItem("nil-level", value);
    },
  };

  return (
    <PreferencesContext.Provider value={{ language, level, ...update }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
