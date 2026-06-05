import { PaginatedArticleList } from "@/app/components/organisms/paginated-article-list";
import type { Metadata } from "next";
import { getArticles } from "@/app/lib/article-repository";
import {
  sortArticles,
  getTaxonomies,
  filterArticles,
  getSortConfig,
} from "@/app/lib/article-utils";
import { ArticleSearchForm } from "@/app/components/organisms/article-search-form";
import type { ArticleSearchParams } from "@/app/lib/article-types";
import { siteConfig } from "@/app/lib/site-config";

const siteTitle = siteConfig.title[0].toUpperCase() + siteConfig.title.slice(1);

export const metadata: Metadata = {
  title: "Articles",
  description: `Browse all articles on ${siteTitle}.`,
  openGraph: {
    title: "Articles",
    description: `Browse all articles on ${siteTitle}.`,
    type: "website",
    images: [
      {
        url: siteConfig.iconPng,
        width: 600,
        height: 600,
        alt: siteConfig.title,
      },
    ],
  },
};

/**
 * Renders the paginated articles list page with search and filtering.
 * @param props Route props including async search parameters.
 * @returns The articles page element.
 */
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<ArticleSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  // 1. Data Fetching
  const allMetadata = await getArticles();
  const publishedMetadata = allMetadata.filter((a) => a.published);

  // 2. Prepare Form Candidates
  const candidates = getTaxonomies(publishedMetadata);

  // 3. Filtering & Sorting
  const filteredArticles = filterArticles(
    publishedMetadata,
    resolvedSearchParams,
  );
  const { field, order } = getSortConfig(resolvedSearchParams);
  const sortedArticles = sortArticles(filteredArticles, field, order);

  // 4. Rendering
  return (
    <main>
      <ArticleSearchForm
        searchParams={resolvedSearchParams}
        candidates={candidates}
      />
      <PaginatedArticleList
        articles={sortedArticles}
        searchParams={resolvedSearchParams}
      />
    </main>
  );
}
