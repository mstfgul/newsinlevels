import type { Metadata } from "next";
import Link from "next/link";
import { getBook, getBookIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getBookIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getBook(id), `/books/${id}/`);
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBook(id);

  return (
    <div>
      <Link
        href="/books/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← Book Club
      </Link>
      <ArticleReader article={book} />
    </div>
  );
}
