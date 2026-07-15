import type { Metadata } from "next";
import { getQuote, getQuoteIndex, recentWindow } from "@/lib/data";
import { ArticlePageBody } from "@/components/ArticlePage";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getQuoteIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getQuote(id), "quotes");
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePageBody article={getQuote(id)} section="quotes" />;
}
