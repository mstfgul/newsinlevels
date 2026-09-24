/**
 * Site-wide constants that are not SEO metadata (those live in lib/seo.ts).
 *
 * APP_STORE_URL: the app's App Store page (id6797324228, live 2026-09-19).
 * No storefront in the path, so Apple routes each visitor to their own store
 * (the Türkiye-only `/tr/` pin was dropped on 2026-09-24, once the app was
 * out in the other storefronts too). Set to `null` to render the badge
 * without a link again.
 */
export const APP_STORE_URL: string | null = "https://apps.apple.com/app/id6797324228";
