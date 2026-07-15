import { makeVariantPage } from "@/components/ArticlePage";
import { getArticle, getIndex } from "@/lib/data";

const variant = makeVariantPage({
  section: "article",
  getIndex,
  getArticle,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
