import type { Metadata } from "next";
import { getArtIndex } from "@/lib/data";
import { GalleryList } from "@/components/GalleryList";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Daily Art — famous paintings explained at your level (A1–C2)",
  description:
    "One famous public-domain painting a day, analysed in simple English, German, French and Spanish at CEFR levels A1–C2. Learn a language through art history, with vocabulary and exercises.",
  path: "/art/",
});

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
