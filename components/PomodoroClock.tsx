"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const POMODORO_MS = 25 * 60 * 1000;

/** Kitchen-timer wedge: from 12 o'clock, sweeping `deg` degrees clockwise. */
function wedgePath(deg: number): string {
  const rad = ((Math.min(deg, 359.9) - 90) * Math.PI) / 180;
  const x = 50 + 38 * Math.cos(rad);
  const y = 50 + 38 * Math.sin(rad);
  return `M 50 50 L 50 12 A 38 38 0 ${deg > 180 ? 1 : 0} 1 ${x} ${y} Z`;
}

/**
 * A little analog clock floating in the corner of the desk (large screens
 * only, everywhere except the homepage). It keeps real time until "start" —
 * then a red wedge of the dial marks the 25 pomodoro minutes left and drains
 * as you read.
 */
export function PomodoroClock() {
  const pathname = usePathname();
  // now stays null until mounted so the server and first client render match.
  const [now, setNow] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const running = endsAt !== null;
  const remaining = running && now !== null ? Math.max(0, endsAt - now) : 0;

  useEffect(() => {
    if (running && now !== null && now >= (endsAt ?? 0)) {
      setEndsAt(null);
      setIsDone(true);
    }
  }, [running, now, endsAt]);

  if (pathname === "/") return null;

  const date = now !== null ? new Date(now) : null;
  const hourDeg = date
    ? (date.getHours() % 12) * 30 + date.getMinutes() * 0.5
    : 302;
  const minDeg = date ? date.getMinutes() * 6 + date.getSeconds() * 0.1 : 60;
  const secDeg = date ? date.getSeconds() * 6 : 180;
  const wedgeDeg = (remaining / POMODORO_MS) * 150; // 25 of 60 minutes

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden w-36 flex-col items-center gap-1.5 lg:flex">
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
          y2="31"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="21"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${minDeg} 50 50)`}
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
        <button
          onClick={() => {
            setIsDone(false);
            setEndsAt(Date.now() + POMODORO_MS);
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
            <>25 min of reading →</>
          )}
        </button>
      )}
    </div>
  );
}
