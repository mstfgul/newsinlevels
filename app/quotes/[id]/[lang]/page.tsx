import { makeVariantPage } from "@/components/ArticlePage";
import { getQuote, getQuoteIndex } from "@/lib/data";

const variant = makeVariantPage({
  section: "quotes",
  getIndex: getQuoteIndex,
  getArticle: getQuote,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
