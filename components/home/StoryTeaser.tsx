import Link from "next/link";
import { Clipping } from "@/components/Clipping";
import { Reveal } from "@/components/Reveal";
import { STORY_CONTENT } from "@/app/story/content";
import { artworkAlt, artworkById, artworkSrc, artworkSrcSet } from "@/lib/gallery";

/** The turn in the argument, as a pull quote, with the door to the story. */
export function StoryTeaser() {
  const vermeer = artworkById("woman-reading-letter");
  const copy = STORY_CONTENT.en;
  const epigraph = copy.blocks.find((b) => b.type === "quote");
  const quote = epigraph && epigraph.type === "quote" ? epigraph : null;
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-14">
        <Reveal tilt={-1.1} className="w-[11rem] shrink-0 sm:w-[14rem]">
          <Clipping
            src={artworkSrc(vermeer, 640)}
            srcSet={artworkSrcSet(vermeer)}
            sizes="14rem"
            alt={artworkAlt(vermeer)}
            width={vermeer.w640}
            height={vermeer.h640}
            rotate={1.3}
            caption="a letter, read slowly"
          />
        </Reveal>
        <Reveal delay={0.1} className="text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">why art, why now</p>
          <blockquote className="pull-quote editorial mt-4 text-[1.6rem] italic sm:text-[2rem]">{quote?.text}</blockquote>
          {quote && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">— {quote.cite}</p>
          )}
          <Link
            href="/story/"
            className="editorial mt-6 inline-block text-[1.35rem] underline decoration-2 decoration-[var(--margin-red)] underline-offset-[6px] transition-colors hover:text-primary"
          >
            Read the story →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
