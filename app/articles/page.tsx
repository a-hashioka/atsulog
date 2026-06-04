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

export const metadata: Metadata = {
  title: "Articles",
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
