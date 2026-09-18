"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { BrandMark } from "@/components/BrandMark";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * The masthead — no strip, no border, no box (ST-105: "the bar was crude and
 * sat on top of the phone"). Just the mark, the name, "story" and the
 * day/night switch floating over the page. It slides away as soon as the
 * reader scrolls down and comes back the moment they scroll up, so it is
 * never in the way of the hero, the phone or a painting.
 */
export function SiteHeader() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (y < 80) setHidden(false);
    else if (y > previous + 4) setHidden(true);
    else if (y < previous - 4) setHidden(false);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-[var(--m-page)] ease-out print:hidden ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="AnyText — home">
          <BrandMark size={34} decorative={false} className="rotate-[-4deg]" />
          <span className="editorial text-[1.45rem]">AnyText</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/story/"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground underline-offset-[6px] transition-colors hover:text-foreground hover:underline hover:decoration-2 hover:decoration-[var(--margin-red)]"
          >
            story
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
