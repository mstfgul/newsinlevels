import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article, Language } from "@/lib/types";
import { recentWindow } from "@/lib/data";
import {
  articleJsonLd,
  articleMetadata,
  breadcrumbJsonLd,
  isVariantLang,
  SECTIONS,
  VARIANT_LANGS,
  type Section,
} from "@/lib/seo";
import { ArticleReader } from "./ArticleReader";
import { JsonLd } from "./JsonLd";

/**
 * Shared body for every content detail page: structured data, the back link
 * and the reader. `fixedLanguage` pins the page to one language edition (the
 * crawlable /…/de/ pages); without it the reader follows the visitor's
 * language preference.
 */
export function ArticlePageBody({
  article,
  section,
  fixedLanguage,
}: {
  article: Article;
  section: Section;
  fixedLanguage?: Language;
}) {
  const lang = fixedLanguage ?? "en";
  const { label, listPath } = SECTIONS[section];

  return (
    <div>
      <JsonLd data={articleJsonLd(article, section, lang)} />
      <JsonLd data={breadcrumbJsonLd(article, section, lang)} />
      <Link
        href={listPath}
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary print:hidden"
      >
        ← {section === "article" ? "All articles" : label}
      </Link>
      <ArticleReader article={article} fixedLanguage={fixedLanguage} />
    </div>
  );
}

/**
 * Builds the exports for a /section/[id]/[lang]/ page — the German, French
 * and Spanish editions of an article, each on its own indexable URL with
 * hreflang links back to its siblings (see articleMetadata).
 */
export function makeVariantPage({
  section,
  getIndex,
  getArticle,
}: {
  section: Section;
  getIndex: () => { id: string; date: string; titles: Partial<Record<Language, string>> }[];
  getArticle: (id: string) => Article;
}) {
  function generateStaticParams() {
    return recentWindow(getIndex()).flatMap((entry) =>
      VARIANT_LANGS.filter((lang) => entry.titles[lang]).map((lang) => ({
        id: entry.id,
        lang,
      })),
    );
  }

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ id: string; lang: string }>;
  }): Promise<Metadata> {
    const { id, lang } = await params;
    if (!isVariantLang(lang)) notFound();
    const article = getArticle(id);
    if (!article.languages[lang]) notFound();
    return articleMetadata(article, section, lang);
  }

  async function Page({
    params,
  }: {
    params: Promise<{ id: string; lang: string }>;
  }) {
    const { id, lang } = await params;
    if (!isVariantLang(lang)) notFound();
    const article = getArticle(id);
    if (!article.languages[lang]) notFound();
    return (
      <ArticlePageBody article={article} section={section} fixedLanguage={lang} />
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
