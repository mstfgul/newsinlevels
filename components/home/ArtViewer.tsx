"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { artworkAlt, artworkSrc, type Artwork } from "@/lib/gallery";

/**
 * Full-screen artwork viewer — the web twin of the app's ReaderImageViewer
 * (ST-66) and of DailyArt's lightbox: black backdrop in both themes, the
 * painting uncropped, the credit line beneath, and the one call to action.
 *
 * The image shares a `layoutId` with the tile that opened it, so it grows
 * out of the wall (or grid) instead of popping in. A modal dialog: Esc and
 * the backdrop close it, focus moves to the close button and is trapped
 * inside, the page behind stops scrolling.
 */
export function ArtViewer({
  artwork,
  layoutPrefix,
  onClose,
}: {
  artwork: Artwork | null;
  /** Must match the tile's layoutId prefix, e.g. "wall" → "wall-<id>". */
  layoutPrefix: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Portal target: the viewer must escape the hero's own stacking context
  // (`isolate`) or the sections below it paint over the dialog. document
  // only exists on the client, so the portal mounts after hydration.
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  useEffect(() => setPortal(document.body), []);

  useEffect(() => {
    if (!artwork) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [artwork, onClose]);

  if (!portal) return null;
  return createPortal(
    <AnimatePresence>
      {artwork && (
        <motion.div
          key={artwork.id}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={artworkAlt(artwork)}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "var(--viewer-backdrop)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* The backdrop closes; the content below stops the click. */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-zoom-out"
            tabIndex={-1}
          />

          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-14 pb-3 sm:px-10">
            <motion.div
              layoutId={`${layoutPrefix}-${artwork.id}`}
              className="flex max-h-full max-w-full items-center justify-center"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <img
                src={artworkSrc(artwork, 1400)}
                alt={artworkAlt(artwork)}
                width={artwork.w1400}
                height={artwork.h1400}
                className="max-h-[68vh] w-auto max-w-full object-contain sm:max-h-[74vh]"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}
              />
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 pb-8 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 0.9, 0.24, 1] }}
          >
            <div>
              <p className="editorial text-[1.5rem] sm:text-[1.75rem]" style={{ color: "var(--on-photo)" }}>
                {artwork.title}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#b9b3a4]">
                {artwork.artist} · {artwork.year} · {artwork.museum}
              </p>
              <a
                href={artwork.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8f8a7d] underline-offset-4 hover:underline"
              >
                public domain · wikimedia commons
              </a>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
              <p className="hand-note" style={{ color: "#d8d2c3", fontSize: "1.25rem" }}>
                read about it, at your level
              </p>
              <AppStoreBadge height={40} />
            </div>
          </motion.div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    portal,
  );
}
