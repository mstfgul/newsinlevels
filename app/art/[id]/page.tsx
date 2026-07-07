import type { Metadata } from "next";
import Link from "next/link";
import { getArtIndex, getArtwork, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getArtIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getArtwork(id), `/art/${id}/`);
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = getArtwork(id);

  return (
    <div>
      <Link
        href="/art/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← Daily Art
      </Link>
      <ArticleReader article={artwork} />
    </div>
  );
}
