import type { Metadata } from "next";
import { getArtIndex } from "@/lib/data";
import { GalleryList } from "@/components/GalleryList";

export const metadata: Metadata = {
  title: "Daily Art — News in Levels",
  description:
    "One public-domain painting a day, analyzed at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function GalleryPage() {
  const entries = getArtIndex();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Daily Art</h1>
        <p className="mt-1 text-muted-foreground">
          One painting a day, read at your level — like a museum postcard
          taped into your notebook.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No artworks yet — the daily art pipeline will hang the first
          postcard soon.
        </p>
      ) : (
        <GalleryList entries={entries} />
      )}
    </div>
  );
}
