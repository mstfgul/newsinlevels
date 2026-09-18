import type { ReactNode } from "react";

/** Kicker in mono, title in Instrument Serif, an optional lede in Bricolage. */
export function SectionHeading({
  kicker,
  title,
  children,
  align = "center",
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={`mx-auto max-w-3xl ${centered ? "text-center" : ""}`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
      <h2 className="editorial mt-3 text-[clamp(2rem,4.6vw,3.25rem)]">{title}</h2>
      {children && (
        <p className={`mt-4 text-[17px] leading-relaxed text-muted-foreground ${centered ? "mx-auto" : ""} max-w-2xl`}>
          {children}
        </p>
      )}
    </div>
  );
}
