import type { Metadata } from "next";
import { getArtIndex, getArtwork, recentWindow } from "@/lib/data";
import { ArticlePageBody } from "@/components/ArticlePage";
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
  return articleMetadata(getArtwork(id), "art");
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePageBody article={getArtwork(id)} section="art" />;
}
