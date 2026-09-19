/**
 * Site-wide constants that are not SEO metadata (those live in lib/seo.ts).
 *
 * APP_STORE_URL: the app's App Store page (id6797324228, live 2026-09-19).
 * The storefront-less URL lets Apple route each visitor to their own store;
 * while the app is only released in Türkiye, visitors elsewhere see Apple's
 * "not available in your country" page — the TR storefront form would be
 * `https://apps.apple.com/tr/app/id6797324228`. Set to `null` to render the
 * badge without a link again.
 */
export const APP_STORE_URL: string | null = "https://apps.apple.com/app/id6797324228";
