import Link from "next/link";
import { getQuote, getQuoteIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return recentWindow(getQuoteIndex()).map((entry) => ({ id: entry.id }));
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getQuote(id);

  return (
    <div>
      <Link
        href="/quotes/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← Quotes
      </Link>
      <ArticleReader article={entry} />
    </div>
  );
}
