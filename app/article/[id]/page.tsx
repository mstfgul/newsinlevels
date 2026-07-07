import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";
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
  return articleMetadata(getArticle(id), `/article/${id}/`);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(id);

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← All articles
      </Link>
      <ArticleReader article={article} />
    </div>
  );
}
