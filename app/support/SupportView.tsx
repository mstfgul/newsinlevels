"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { LegalLanguagePicker } from "@/components/LegalLanguagePicker";
import { LEGAL_LANGUAGES, type LegalLang } from "@/lib/legal";
import { SUPPORT_CONTENT } from "./content";

// Content paragraphs may embed a `{{link:href|label}}` marker (used once,
// for the Privacy Policy mention) — this turns it into a real link,
// internal (next/link) or mailto (plain anchor), consistently styled with
// the rest of the site's inline links. Paragraphs without a marker render
// unchanged.
const LINK_MARKER = /\{\{link:([^|}]+)\|([^}]+)\}\}/g;

function renderParagraph(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_MARKER.lastIndex = 0;
  while ((match = LINK_MARKER.exec(text)) !== null) {
    const [full, href, label] = match;
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const linkClassName = "underline underline-offset-4 hover:text-primary";
    nodes.push(
      href.startsWith("mailto:") ? (
        <a key={key++} href={href} className={linkClassName}>
          {label}
        </a>
      ) : (
        <Link key={key++} href={href} className={linkClassName}>
          {label}
        </Link>
      ),
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function SupportView() {
  const [lang, setLang] = useState<LegalLang>("en");
  const copy = SUPPORT_CONTENT[lang];

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
                {renderParagraph(paragraph)}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
