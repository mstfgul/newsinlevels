"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * The masthead strip. It starts transparent, sitting over the hero, and
 * turns into a paper strip (92% background + hairline) once the reader has
 * scrolled past the first beat — a solid tint, not frosted glass: the design
 * language has no blur except the artwork backdrop.
 */
export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-[var(--m-page)] print:hidden ${
        scrolled ? "border-b border-border bg-background/92" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <img src="/icon.png" alt="" aria-hidden className="size-6 self-center" />
          <span className="editorial relative inline-block px-1 text-[1.4rem]">
            <span
              aria-hidden
              className="absolute inset-x-0 top-[0.34em] bottom-[0.16em] -rotate-1 rounded-sm"
              style={{ background: "var(--hl-strong)" }}
            />
            <span className="relative">AnyText</span>
          </span>
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
