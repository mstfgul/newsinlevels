import type { ReactNode } from "react";

/**
 * The narrow notebook column the story, privacy and support pages read in —
 * a sheet of paper laid on the squared desk (85% paper over the grid, side
 * rules from `sm`). The homepage does not use it: its sections run the full
 * width of the desk.
 */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-3xl bg-background/85 px-4 py-10 shadow-sm sm:border-x sm:border-border sm:px-8 print:bg-transparent print:shadow-none print:sm:border-none ${className}`}
    >
      {children}
    </div>
  );
}
