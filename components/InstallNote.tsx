"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "nil-install-note";

/**
 * A floating, dismissible post-it stuck to the top corner of the home page,
 * pointing out that the site installs to the home screen. Hidden once
 * dismissed (localStorage) and never shown when already running as an
 * installed app.
 */
export function InstallNote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari's non-standard flag for installed web apps.
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone);
    if (!standalone) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      role="note"
      className="postit fixed right-3 top-16 z-50 w-52 rotate-[2deg] p-3 pr-8 pb-4 text-sm leading-snug opacity-80 transition-opacity hover:opacity-100 sm:right-6 sm:top-20 print:hidden"
      style={{ fontFamily: "var(--font-bricolage)" }}
    >
      📌 this notebook installs: <strong>Share → Add to Home Screen</strong> —
      opens like an app, works offline
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-1.5 top-1 cursor-pointer px-1 text-base opacity-60 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
