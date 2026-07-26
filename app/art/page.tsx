import type { Metadata } from "next";
import { getArtIndex, getArtwork } from "@/lib/data";
import { GalleryList } from "@/components/GalleryList";
import { HomeHero } from "@/components/HomeHero";
import { Highlight, PageIntro } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { collectionJsonLd, pageMetadata } from "@/lib/seo";

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
      {entries.length > 0 && (
        <JsonLd data={collectionJsonLd("art", entries)} />
      )}
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
        <>
          <HomeHero
            article={getArtwork(entries[0].id)}
            href={`/art/${entries[0].id}/`}
          />
          {entries.length > 1 && (
            <section className="mt-10">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                More paintings
              </h2>
              <GalleryList entries={entries.slice(1)} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
