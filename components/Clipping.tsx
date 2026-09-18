import type { CSSProperties, ReactNode } from "react";

/**
 * A clipping taped to the desk — the web twin of the iOS app's
 * `ClippingFrame` (DesignSystem/ClippingFrame.swift), value for value:
 * a surface-sunken mat, an 8px print margin, a 1px square-cornered border,
 * the e2 shadow, and two 46×16 strips of tape rotated ∓35° at the top
 * corners.
 *
 * The tilt lives on this component (the Swift version deliberately leaves it
 * to the caller, because a phone screen has a one-tilt-per-screen budget).
 * The web is a desk — design-language.md § 1 — so several tilted clippings
 * sitting together is the intended look here, not a violation of that rule.
 *
 * Two rooms, one markup (ST-103): in the light theme the default "taped"
 * variant is a clipping on the paper desk; at night globals.css removes the
 * tape and zeroes the tilt (`.clipping--taped`), so the same figure hangs as
 * a flat frame on the gallery wall. variant="frame" is that flat frame in
 * both themes.
 *
 * Tape overhangs the frame by 14px on each side and 5px above: no ancestor
 * may set `overflow-hidden`, and the figure carries `pt-3` so the overhang
 * has room (mirrors ClippingView's `.padding(.top, Space.x3)`).
 */
export function Clipping({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  caption,
  captionStyle = "hand",
  rotate = -1.1,
  aspect,
  variant = "taped",
  priority = false,
  className = "",
}: {
  src: string;
  /** Responsive candidates, e.g. from lib/gallery.ts `artworkSrcSet`. */
  srcSet?: string;
  sizes?: string;
  /** "Artist, Title (year)". Pass "" for purely decorative use. */
  alt: string;
  /** Intrinsic pixel size of the exported file — reserves the box, kills CLS. */
  width: number;
  height: number;
  caption?: ReactNode;
  /** "hand" = Caveat (story page). "label" = mono micro-label (homepage). */
  captionStyle?: "hand" | "label";
  /** Degrees. Keep |rotate| ≤ 2. Ignored by "frame" and by the dark theme. */
  rotate?: number;
  /** e.g. "4/3" to crop; omit to keep the file's own ratio. */
  aspect?: string;
  /** "taped": desk by day, frame by night. "frame": flat frame always. */
  variant?: "taped" | "frame";
  /** Above the fold: load eagerly instead of lazily. */
  priority?: boolean;
  /** Caller owns the width, e.g. "w-[8.5rem] sm:w-[12.5rem]". */
  className?: string;
}) {
  const taped = variant === "taped";
  return (
    <figure className={`clipping ${taped ? "clipping--taped" : "clipping--frame"} shrink-0 pt-3 ${className}`}>
      <div
        className="clipping-mount relative rotate-[var(--tilt)] border border-border bg-card p-2 print:rotate-0 print:shadow-none"
        style={
          {
            "--tilt": `${taped ? rotate : 0}deg`,
            boxShadow: "0 8px 20px var(--clipping-shadow)",
          } as CSSProperties
        }
      >
        <div className="bg-surface-sunken">
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            {...(alt === "" ? { "aria-hidden": true } : {})}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className={
              aspect ? "block h-full w-full object-cover" : "block h-auto w-full"
            }
            style={aspect ? { aspectRatio: aspect } : undefined}
          />
        </div>

        {/* Two strips of tape. Same geometry as ClippingFrame's overlays:
         * 46×16, ∓35°, offset ∓14 / −5 from the frame's top corners. */}
        {taped && (
          <>
            <span
              aria-hidden
              className="clipping-tape absolute left-[-14px] top-[-5px] h-4 w-[46px] -rotate-[35deg]"
              style={{ background: "var(--tape)" }}
            />
            <span
              aria-hidden
              className="clipping-tape absolute right-[-14px] top-[-5px] h-4 w-[46px] rotate-[35deg]"
              style={{ background: "var(--tape)" }}
            />
          </>
        )}
      </div>

      {caption && (
        <figcaption
          className={
            captionStyle === "hand"
              ? "hand-note mt-2 text-center"
              : "mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
          }
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
