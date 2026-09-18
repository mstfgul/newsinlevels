/**
 * The brush-stroke "E" — the app icon's mark (mobile ST-55), transparent, in
 * the light and dark cuts the app itself ships as its launch motif. Used
 * loosely around the site: the masthead, a stamp by a signature, a bookend
 * on the shelf, a faint watermark behind a headline.
 */
export function BrandMark({
  size = 40,
  className = "",
  decorative = true,
}: {
  size?: number;
  className?: string;
  /** false = announces "AnyText" (the masthead); true = hidden from screen readers. */
  decorative?: boolean;
}) {
  const a11y = decorative ? { alt: "", "aria-hidden": true as const } : { alt: "AnyText" };
  return (
    <span className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img src="/brand/mark-light.png" width={size} height={size} className="block h-full w-full dark:hidden" {...a11y} />
      <img src="/brand/mark-dark.png" width={size} height={size} className="hidden h-full w-full dark:block" {...a11y} />
    </span>
  );
}
