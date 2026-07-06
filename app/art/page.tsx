import type { Metadata } from "next";
import { getArtIndex } from "@/lib/data";
import { GalleryList } from "@/components/GalleryList";
import { Highlight, PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Daily Art — Any Text in Levels",
  description:
    "One public-domain painting a day, analyzed at CEFR levels A1–C2 in English, German, French and Turkish.",
};

export default function GalleryPage() {
  const entries = getArtIndex();

  return (
    <div>
      <PageIntro title="Daily Art">
        one painting a day, read <Highlight>at your level</Highlight> — like a
        museum postcard taped into your notebook
      </PageIntro>

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
