import { DICTIONARY_LANGUAGES, READING_LANGUAGES } from "@/lib/languages";

/**
 * The languages, as a slow marquee — the site's one piece of continuous
 * motion (globals.css `.marquee`; pauses under the pointer, wraps into a
 * static list under reduced motion). Two tracks: the seven reading
 * languages in Instrument Serif, the fifteen dictionary languages in mono
 * running the other way. Each track is duplicated once so the loop is
 * seamless; the copy is aria-hidden and a plain sentence carries the
 * meaning for screen readers.
 */
function Track({
  items,
  className,
  reverse = false,
}: {
  items: readonly string[];
  className: string;
  reverse?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden" aria-hidden>
      <div className={`marquee ${className}`} style={reverse ? { animationDirection: "reverse" } : undefined}>
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 sm:px-8">{item}</span>
            <span className="text-margin-red">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function LanguageMarquee() {
  return (
    <section className="border-y border-border py-10 sm:py-14">
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        read in seven languages · translate into fifteen
      </p>
      <Track items={READING_LANGUAGES.map((l) => l.endonym)} className="editorial text-[2rem] sm:text-[2.75rem]" />
      <Track
        items={DICTIONARY_LANGUAGES.map((l) => l.endonym)}
        className="mt-4 font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground"
        reverse
      />
      <p className="sr-only">
        Read in {READING_LANGUAGES.map((l) => l.english).join(", ")}. Word and sentence translations in{" "}
        {DICTIONARY_LANGUAGES.map((l) => l.english).join(", ")}.
      </p>
    </section>
  );
}
