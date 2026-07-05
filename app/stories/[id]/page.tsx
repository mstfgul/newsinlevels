import Link from "next/link";
import { getStoryIndex, getStoryPart } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return getStoryIndex().map((entry) => ({ id: entry.id }));
}

export default async function StoryPartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = getStoryPart(id);

  // Previous/next part of the same story, for serial reading.
  const siblings = getStoryIndex().filter(
    (entry) => entry.story === chapter.story?.title,
  );
  const previous = siblings.find(
    (entry) => entry.part === (chapter.story?.part ?? 0) - 1,
  );
  const next = siblings.find(
    (entry) => entry.part === (chapter.story?.part ?? 0) + 1,
  );

  return (
    <div>
      <Link
        href="/stories/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Stories
      </Link>
      <ArticleReader article={chapter} />

      {(previous || next) && (
        <nav className="mt-10 flex justify-between font-mono text-sm">
          {previous ? (
            <Link
              href={`/stories/${previous.id}/`}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Part {previous.part}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/stories/${next.id}/`}
              className="text-muted-foreground hover:text-foreground"
            >
              Part {next.part} →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
