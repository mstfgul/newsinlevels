"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "News", prefix: null },
  { href: "/art/", label: "Daily Art", prefix: "/art" },
  { href: "/quotes/", label: "Quotes", prefix: "/quotes" },
  { href: "/history/", label: "On This Day", prefix: "/history" },
];

export function NavTabs() {
  const pathname = usePathname();
  const matched = TABS.find(
    (tab) => tab.prefix && pathname.startsWith(tab.prefix),
  );

  return (
    <nav className="flex flex-wrap items-center gap-1 font-mono text-xs uppercase tracking-widest">
      {TABS.map((tab) => {
        const active = matched ? matched === tab : tab.prefix === null;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded px-2 py-1 transition-colors ${
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
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
