import type { Metadata } from "next";
import { getHistoryEvent, getHistoryIndex, recentWindow } from "@/lib/data";
import { ArticlePageBody } from "@/components/ArticlePage";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getHistoryIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getHistoryEvent(id), "history");
}

export default async function HistoryEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePageBody article={getHistoryEvent(id)} section="history" />;
}
