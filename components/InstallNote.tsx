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
      className="postit fixed left-1/2 top-24 z-50 w-72 -translate-x-1/2 rotate-[-2deg] p-5 pb-6 opacity-90 transition-opacity hover:opacity-100 print:hidden"
    >
      {/* A strip of washi tape holding the note to the screen. */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-[-4deg]"
        style={{
          background: "var(--tape)",
          boxShadow: "0 1px 2px rgba(20, 30, 45, 0.1)",
        }}
      />
      <p
        className="mb-1 pr-6 rotate-[-0.5deg]"
        style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.5rem", lineHeight: 1.15 }}
      >
        take this notebook with you ✏️
      </p>
      <p
        className="text-sm leading-snug opacity-80"
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        <strong>Share → Add to Home Screen</strong> — it opens like an app and
        works offline.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-1 top-0.5 flex h-9 w-9 cursor-pointer items-center justify-center text-2xl leading-none opacity-60 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
