import type { ReactNode } from "react";

/** A phrase swiped with the yellow highlighter, as in the homepage tagline. */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap px-1">
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-1 -rotate-1 rounded-sm"
        style={{ background: "var(--hl-strong)" }}
      />
      <span className="relative text-foreground">{children}</span>
    </span>
  );
}

/** Section header: the printed title with the intro penciled underneath. */
export function PageIntro({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p
        className="hand-note mt-1.5 rotate-[-0.4deg]"
        style={{ fontSize: "1.35rem" }}
      >
        {children}
      </p>
    </div>
  );
}
