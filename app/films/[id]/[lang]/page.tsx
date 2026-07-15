import { makeVariantPage } from "@/components/ArticlePage";
import { getFilm, getFilmIndex } from "@/lib/data";

const variant = makeVariantPage({
  section: "films",
  getIndex: getFilmIndex,
  getArticle: getFilm,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
