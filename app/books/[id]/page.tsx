import Link from "next/link";
import { getBook, getBookIndex } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return getBookIndex().map((entry) => ({ id: entry.id }));
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
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Book Club
      </Link>
      <ArticleReader article={book} />
    </div>
  );
}
