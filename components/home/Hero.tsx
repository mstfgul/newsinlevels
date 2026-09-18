import { AppStoreBadge } from "@/components/AppStoreBadge";
import { BrandMark } from "@/components/BrandMark";
import { ArtWall } from "@/components/home/ArtWall";
import { artworkSrc, GALLERY } from "@/lib/gallery";

/**
 * The opening: the promise — learn a language through art — in Instrument
 * Serif italic over the desk, the
 * App Store badge, and the wall of art rising along the bottom edge. At
 * night a blurred copy of the first painting washes the black wall with its
 * own colours (the app's ReaderPageBackdrop idea, `Wash.backdrop`), fading
 * into the page below — an alpha fade of one colour, the only gradient the
 * design language allows.
 */
export function Hero() {
  const wall = GALLERY.filter((a) => a.wall);
  const backdrop = wall[0] ?? GALLERY[0];

  return (
    <section className="relative isolate overflow-x-clip pb-6 pt-8 sm:pt-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden dark:block">
        <img
          src={artworkSrc(backdrop, 640)}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-[var(--wash-backdrop)] blur-[var(--blur-hero)]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>

      {/* The mark, twice: a faint, tilted watermark behind the headline, and the stamp itself above it. */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-2 -z-10 -translate-x-1/2 rotate-[-9deg] opacity-[0.06] dark:opacity-[0.09]">
        <BrandMark size={520} />
      </div>
      <div className="mx-auto max-w-4xl px-5 text-center">
        <div className="rise mx-auto mb-5 flex justify-center" style={{ animationDelay: "0ms" }}>
          <BrandMark size={64} className="rotate-[-6deg] drop-shadow-[0_6px_14px_rgba(0,0,0,0.12)]" />
        </div>
        <p className="rise font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground" style={{ animationDelay: "60ms" }}>
          an iPhone app · learn a language through art
        </p>
        <h1
          className="rise editorial mx-auto mt-4 max-w-[14ch] text-[clamp(2.75rem,7.2vw,5.5rem)] italic"
          style={{ animationDelay: "140ms" }}
        >
          Learn a language
          <br />
          through art.
        </h1>
        <p
          className="rise mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]"
          style={{ animationDelay: "240ms" }}
        >
          Every day, a curated page: a painting first — then a film, a book, a story, a
          quote, an essay, and more — rewritten at six levels, from A1 to C2, in seven
          languages. Tap any word to see what it means in yours.
        </p>
        <div className="rise mt-8 flex flex-col items-center gap-3" style={{ animationDelay: "340ms" }}>
          <AppStoreBadge height={52} />
          <p className="hand-note rotate-[-0.6deg]" style={{ fontSize: "1.3rem" }}>
            art first, then everything else
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-2">
        <ArtWall artworks={wall} />
      </div>
    </section>
  );
}
