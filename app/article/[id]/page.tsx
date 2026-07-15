import type { Metadata } from "next";
import { getArticle, getIndex, recentWindow } from "@/lib/data";
import { ArticlePageBody } from "@/components/ArticlePage";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getArticle(id), "article");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePageBody article={getArticle(id)} section="article" />;
}
