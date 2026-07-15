"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) that makes the site
 * installable and keeps previously read stories available offline.
 * Skipped in development so caching never fights hot reload.
 */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // A failed registration just means no offline support this visit.
    });
  }, []);
  return null;
}
