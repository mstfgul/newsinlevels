"use client";

/**
 * Day / night switch. The visible icon is driven purely by the `data-theme`
 * attribute the inline script sets on <html> (see globals.css .theme-sun /
 * .theme-moon), so it is already correct on first paint — no hydration flip,
 * no state needed here. The click just flips the attribute, remembers the
 * choice, and nudges the browser-chrome colour to match.
 */
export function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement;
    const next = el.dataset.theme === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try {
      localStorage.setItem("nil-theme", next);
    } catch {
      // Private mode / storage disabled — the toggle still works this session.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#161f1b" : "#fcfbf7");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle day and night mode"
      title="Day / night"
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      {/* Sun — shown in day mode. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="theme-sun size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4.1" />
        <path d="M12 2.6v2.1M12 19.3v2.1M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.5 19.5l1.5-1.5M18 6l1.5-1.5" />
      </svg>
      {/* Moon — shown in night mode. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="theme-moon size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 14.6 A8 8 0 1 1 9.4 4 A6.2 6.2 0 0 0 20 14.6 Z" />
      </svg>
    </button>
  );
}
