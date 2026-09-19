/**
 * Site-wide constants that are not SEO metadata (those live in lib/seo.ts).
 *
 * APP_STORE_URL: the app's App Store page (id6797324228, live 2026-09-19).
 * Pinned to the Türkiye storefront (`/tr/`) while the app is released there
 * only, so every visitor lands on the page where it actually exists. Once
 * it is released elsewhere, drop the `/tr/` so Apple routes each visitor
 * to their own store: `https://apps.apple.com/app/id6797324228`. Set to
 * `null` to render the badge without a link again.
 */
export const APP_STORE_URL: string | null = "https://apps.apple.com/tr/app/id6797324228";
