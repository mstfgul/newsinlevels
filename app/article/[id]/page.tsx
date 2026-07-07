import Link from "next/link";
import { getArticle, getIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return recentWindow(getIndex()).map((entry) => ({ id: entry.id }));
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
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← All articles
      </Link>
      <ArticleReader article={article} />
    </div>
  );
}
