import { makeVariantPage } from "@/components/ArticlePage";
import { getArtIndex, getArtwork } from "@/lib/data";

const variant = makeVariantPage({
  section: "art",
  getIndex: getArtIndex,
  getArticle: getArtwork,
});

export const generateStaticParams = variant.generateStaticParams;
export const generateMetadata = variant.generateMetadata;
export default variant.Page;
