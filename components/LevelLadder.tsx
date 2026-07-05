"use client";

import type { Level } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { LEVEL_COLORS } from "@/lib/levels";

export function LevelLadder({
  level,
  onSelect,
}: {
  level: Level;
  onSelect: (level: Level) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Reading level"
      className="flex items-center font-mono text-sm"
    >
      {LEVELS.map((l, i) => (
        <div key={l} className="flex flex-1 items-center last:flex-none">
          <button
            type="button"
            onClick={() => onSelect(l)}
            aria-pressed={l === level}
            className="grid size-10 cursor-pointer place-items-center rounded-full border-2 font-semibold transition-all"
            style={
              l === level
                ? {
                    borderColor: LEVEL_COLORS[l],
                    backgroundColor: LEVEL_COLORS[l],
                    color: "var(--background)",
                    transform: "scale(1.12)",
                  }
                : {
                    borderColor: "var(--border)",
                    color:
                      LEVELS.indexOf(l) < LEVELS.indexOf(level)
                        ? LEVEL_COLORS[l]
                        : "var(--muted-foreground)",
                  }
            }
          >
            {l}
          </button>
          {i < LEVELS.length - 1 && (
            <div
              aria-hidden
              className="mx-1 h-0.5 flex-1"
              style={{
                backgroundColor:
                  LEVELS.indexOf(l) < LEVELS.indexOf(level)
                    ? LEVEL_COLORS[level]
                    : "var(--border)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
