"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "News" },
  { href: "/art/", label: "Daily Art" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
      {TABS.map((tab) => {
        const active =
          tab.href === "/art/"
            ? pathname.startsWith("/art")
            : !pathname.startsWith("/art");
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
