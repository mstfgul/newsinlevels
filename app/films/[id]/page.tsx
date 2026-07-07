import Link from "next/link";
import { getFilm, getFilmIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";

export function generateStaticParams() {
  return recentWindow(getFilmIndex()).map((entry) => ({ id: entry.id }));
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const film = getFilm(id);

  return (
    <div>
      <Link
        href="/films/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
      >
        ← Film Club
      </Link>
      <ArticleReader article={film} />
    </div>
  );
}
