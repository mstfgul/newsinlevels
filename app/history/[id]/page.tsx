import Link from "next/link";
import { getHistoryEvent, getHistoryIndex } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return getHistoryIndex().map((entry) => ({ id: entry.id }));
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
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← On This Day
      </Link>
      <ArticleReader article={capsule} />
    </div>
  );
}
