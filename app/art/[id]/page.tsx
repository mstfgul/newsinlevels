import Link from "next/link";
import { getArtIndex, getArtwork, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return recentWindow(getArtIndex()).map((entry) => ({ id: entry.id }));
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
