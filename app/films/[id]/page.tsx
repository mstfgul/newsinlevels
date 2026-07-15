import type { Metadata } from "next";
import { getFilm, getFilmIndex, recentWindow } from "@/lib/data";
import { ArticlePageBody } from "@/components/ArticlePage";
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
  return articleMetadata(getFilm(id), "films");
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticlePageBody article={getFilm(id)} section="films" />;
}
