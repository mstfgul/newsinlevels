import type { Metadata } from "next";
import Link from "next/link";
import { getFilm, getFilmIndex, recentWindow } from "@/lib/data";
import { ArticleReader } from "@/components/ArticleReader";
import { articleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return recentWindow(getFilmIndex()).map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return articleMetadata(getFilm(id), `/films/${id}/`);
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
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← Film Club
      </Link>
      <ArticleReader article={film} />
    </div>
  );
}
