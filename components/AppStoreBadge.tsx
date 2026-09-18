import { APP_STORE_URL } from "@/lib/site";

/**
 * Apple's official "Download on the App Store" badge — the artwork itself
 * comes from Apple's App Store Marketing Tools (black and white variants,
 * public/badges/), never redrawn, as the marketing guidelines require. Black
 * on the paper desk, white on the gallery wall at night.
 *
 * Until APP_STORE_URL is set the badge is a plain image (no dead link).
 */
export function AppStoreBadge({
  className = "",
  height = 48,
}: {
  className?: string;
  /** Badge height in px — Apple asks for at least 40. */
  height?: number;
}) {
  const width = Math.round(height * (119.66407 / 40));
  const picture = (
    <span className={`inline-block ${className}`} style={{ height, width }}>
      <img
        src="/badges/app-store-black.svg"
        alt="Download on the App Store"
        width={width}
        height={height}
        className="block h-full w-auto dark:hidden"
      />
      <img
        src="/badges/app-store-white.svg"
        alt="Download on the App Store"
        width={width}
        height={height}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
  if (!APP_STORE_URL) return picture;
  return (
    <a
      href={APP_STORE_URL}
      className="inline-block transition-transform duration-[var(--m-swift)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      {picture}
    </a>
  );
}
