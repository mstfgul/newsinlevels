import { makeVariantPage } from "@/components/ArticlePage";
import { getBook, getBookIndex } from "@/lib/data";

const variant = makeVariantPage({
  section: "books",
  getIndex: getBookIndex,
  getArticle: getBook,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
