import { AppStoreBadge } from "@/components/AppStoreBadge";
import { BrandMark } from "@/components/BrandMark";
import { Reveal } from "@/components/Reveal";
import { artworkById, artworkSrc } from "@/lib/gallery";

/** The last word: the invitation, the badge, and at night one more painting glowing behind it. */
export function ClosingCta() {
  const backdrop = artworkById("the-kiss");
  return (
    <section className="relative isolate overflow-hidden px-5 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden dark:block">
        <img
          src={artworkSrc(backdrop, 640)}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-[var(--wash-backdrop)] blur-[var(--blur-hero)]"
        />
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
        />
      </div>
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="mb-4 flex justify-center">
          <BrandMark size={56} className="rotate-[7deg]" />
        </div>
        <p className="hand-note rotate-[-1deg]" style={{ fontSize: "2rem" }}>
          Learn with art.
        </p>
        <h2 className="editorial mt-4 text-[clamp(2rem,4.6vw,3.25rem)]">Your first page is waiting.</h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Any Text is on the App Store for iPhone. Pick a language, pick a level, and start with
          a painting today — tomorrow&apos;s page is already on its way.
        </p>
        <div className="mt-8 flex justify-center">
          <AppStoreBadge height={52} />
        </div>
      </Reveal>
    </section>
  );
}
