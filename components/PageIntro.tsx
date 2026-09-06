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
  size = "default",
}: {
  title: string;
  children: ReactNode;
  /** "display" for the homepage/story mastheads, "default" for privacy/support. */
  size?: "default" | "display";
}) {
  return (
    <div className="mb-8">
      <h1
        className={
          size === "display"
            ? "editorial text-[2.5rem] sm:text-[3.25rem]"
            : "editorial text-[1.75rem] sm:text-[2rem]"
        }
      >
        {title}
      </h1>
      <p
        className="hand-note mt-1.5 rotate-[-0.4deg]"
        style={{ fontSize: "1.35rem" }}
      >
        {children}
      </p>
    </div>
  );
}
