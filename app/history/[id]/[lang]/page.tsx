import { makeVariantPage } from "@/components/ArticlePage";
import { getHistoryEvent, getHistoryIndex } from "@/lib/data";

const variant = makeVariantPage({
  section: "history",
  getIndex: getHistoryIndex,
  getArticle: getHistoryEvent,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
