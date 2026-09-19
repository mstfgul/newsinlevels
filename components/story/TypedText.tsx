"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Text that types itself once `start` turns true — a red caret at the end
 * while it goes, gone when it is done. The full text is always present for
 * assistive tech; the typing is a visual on top of it. Reduced motion: the
 * whole text at once, no caret.
 */
export function TypedText({
  text,
  start,
  speed = 26,
  onDone,
}: {
  text: string;
  start: boolean;
  /** ms per character */
  speed?: number;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [shown, setShown] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setShown(text.length);
      doneRef.current?.();
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) {
        window.clearInterval(id);
        doneRef.current?.();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [start, reduce, text, speed]);

  const typing = start && !reduce && shown < text.length;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={typing ? "type-caret" : undefined}>
        {text.slice(0, shown) || "​"}
      </span>
    </>
  );
}
