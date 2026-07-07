"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DURATIONS = [10, 15, 25, 60] as const;
const DEFAULT_MINUTES = 25;
const STORAGE_KEY = "nil-pomodoro-minutes";

/** Kitchen-timer wedge: from 12 o'clock, sweeping `deg` degrees clockwise. */
function wedgePath(deg: number): string {
  const rad = ((Math.min(deg, 359.9) - 90) * Math.PI) / 180;
  const x = 50 + 38 * Math.cos(rad);
  const y = 50 + 38 * Math.sin(rad);
  return `M 50 50 L 50 12 A 38 38 0 ${deg > 180 ? 1 : 0} 1 ${x} ${y} Z`;
}

/**
 * A little analog timer floating at the right edge of the desk (large
 * screens only, everywhere except the homepage). It rests with both hands
 * on twelve; picking a duration (10/15/25/60 min, remembered across visits)
 * and pressing start winds a red wedge onto the dial that drains as you
 * read, the long hand tracking its edge.
 */
export function PomodoroClock() {
  const pathname = usePathname();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [minutes, setMinutes] = useState<number>(DEFAULT_MINUTES);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (DURATIONS.includes(stored as (typeof DURATIONS)[number])) setMinutes(stored);
  }, []);

  function selectMinutes(value: number) {
    setMinutes(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  const durationMs = minutes * 60 * 1000;
  const running = endsAt !== null;

  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const remaining = running ? Math.max(0, endsAt - now) : 0;

  useEffect(() => {
    if (running && now >= endsAt) {
      setEndsAt(null);
      setIsDone(true);
    }
  }, [running, now, endsAt]);

  if (pathname === "/") return null;

  // At rest both hands point at twelve; wound up, the long hand walks the
  // wedge's edge back to twelve while the red one ticks the seconds away.
  // The wedge always sweeps `minutes` of the 60-minute dial (e.g. 25 min = 150°).
  const fullWedgeDeg = (minutes / 60) * 360;
  const wedgeDeg = (remaining / durationMs) * fullWedgeDeg;
  const secDeg = running ? (60 - Math.ceil(remaining / 1000) % 60) % 60 * 6 : 0;

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden w-36 -translate-y-1/2 flex-col items-center gap-1.5 lg:flex print:hidden">
      <svg
        viewBox="0 0 100 100"
        className="h-24 w-24 rotate-[1.5deg] text-foreground/85 drop-shadow-sm"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="var(--print-paper)"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* hour ticks, drawn in with the fine pen */}
        {Array.from({ length: 12 }, (_, i) => {
          const rad = (i * 30 * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return (
            <line
              key={i}
              x1={50 + 40 * sin}
              y1={50 - 40 * cos}
              x2={50 + 43.5 * sin}
              y2={50 - 43.5 * cos}
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {/* the pomodoro: 25 red minutes that melt away */}
        {running && (
          <path d={wedgePath(wedgeDeg)} fill="var(--margin-red)" opacity="0.3" />
        )}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="21"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          transform={`rotate(${wedgeDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="17"
          stroke="var(--margin-red)"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={`rotate(${secDeg} 50 50)`}
        />
        <circle cx="50" cy="50" r="2.4" fill="var(--margin-red)" />
      </svg>

      {running ? (
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {mm}:{ss}
          </span>
          <button
            onClick={() => setEndsAt(null)}
            className="hand-note cursor-pointer transition-colors hover:text-foreground"
            style={{ fontSize: "1.05rem" }}
          >
            stop
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
            {DURATIONS.map((value) => (
              <button
                key={value}
                onClick={() => selectMinutes(value)}
                className={`cursor-pointer tabular-nums transition-colors hover:text-foreground ${
                  value === minutes
                    ? "text-foreground underline decoration-dotted underline-offset-2"
                    : ""
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setIsDone(false);
              setEndsAt(Date.now() + durationMs);
              setNow(Date.now());
            }}
            className="hand-note cursor-pointer rotate-[-1deg] text-center leading-tight transition-colors hover:text-foreground"
            style={{ fontSize: "1.15rem" }}
          >
            {isDone ? (
              <>
                <span style={{ color: "var(--margin-red)" }}>
                  well done — take a break
                </span>
                <br />
                once more →
              </>
            ) : (
              <>{minutes} min of reading →</>
            )}
          </button>
        </>
      )}
    </div>
  );
}
