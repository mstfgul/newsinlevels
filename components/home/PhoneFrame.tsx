import type { ReactNode } from "react";

/**
 * A phone drawn in CSS — bezel, rounded screen, Dynamic Island — so the
 * demo recordings sit in a device without shipping a photo of one. The
 * bezel is black on the paper desk and one step lighter on the black
 * gallery wall so the silhouette still reads at night.
 */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.5] rounded-[3.1rem] bg-[#0e0e0e] p-[10px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/60 dark:bg-[#1a1a1a] dark:ring-white/15 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-black">{children}</div>
      <span
        aria-hidden
        className="absolute left-1/2 top-[18px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black"
      />
    </div>
  );
}
