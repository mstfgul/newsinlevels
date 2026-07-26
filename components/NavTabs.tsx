"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today", prefixes: [] as string[] },
  // News articles live under /article/, so both prefixes light this tab up.
  { href: "/news/", label: "News", prefixes: ["/news", "/article"] },
  { href: "/art/", label: "Daily Art", prefixes: ["/art"] },
  { href: "/films/", label: "Film Club", prefixes: ["/films"] },
  { href: "/books/", label: "Books", prefixes: ["/books"] },
  { href: "/quotes/", label: "Quotes", prefixes: ["/quotes"] },
  { href: "/history/", label: "On This Day", prefixes: ["/history"] },
];

/** Segment-boundary match, so /article/… never lights up /art. */
function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function NavTabs() {
  const pathname = usePathname();
  const matched = TABS.find((tab) =>
    tab.prefixes.some((prefix) => matchesPrefix(pathname, prefix)),
  );

  return (
    <nav className="flex flex-wrap items-center gap-1 font-mono text-xs font-medium uppercase tracking-widest">
      {TABS.map((tab) => {
        const active = matched ? matched === tab : tab.prefixes.length === 0;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            // Full-contrast text on every tab (the faint muted grey read as
            // washed out in both themes); the active one is marked by the
            // highlighter swipe behind it, not by dimming the rest.
            className={`rounded px-2 py-1 text-foreground transition-colors ${
              active ? "" : "hover:bg-foreground/5"
            }`}
            style={active ? { background: "var(--hl-strong)" } : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
