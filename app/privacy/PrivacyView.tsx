"use client";

import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { PRIVACY_CONTENT } from "./content";

export function PrivacyView() {
  const [lang, setLang] = useState<LegalLang>("en");
  const copy = PRIVACY_CONTENT[lang];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <LegalLanguagePicker languages={LEGAL_LANGUAGES} active={lang} onSelect={setLang} />
      </div>

      <PageIntro title={copy.title}>{copy.intro}</PageIntro>

      <div className="space-y-10 text-[17px] leading-relaxed" style={{ fontFamily: "var(--font-literata)" }}>
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-bricolage)" }}>
              {section.heading}
            </h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className={i === 0 ? undefined : "mt-4"}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
