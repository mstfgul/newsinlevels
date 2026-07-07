import type { Metadata } from "next";
import Link from "next/link";
import { getHistoryEvent, getHistoryIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";
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
  return articleMetadata(getHistoryEvent(id), `/history/${id}/`);
}

export default async function HistoryEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const capsule = getHistoryEvent(id);

  return (
    <div>
      <Link
        href="/history/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← On This Day
      </Link>
      <ArticleReader article={capsule} />
    </div>
  );
}
