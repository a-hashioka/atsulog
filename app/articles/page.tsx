import {
  PaginatedArticleList,
  ArticlesPageProps,
} from "@/app/components/organisms/paginated-article-list";
import { getArticles } from "@/app/lib/article-repository";
import {
  sortArticlesByDate,
  getTaxonomies,
  filterArticles,
} from "@/app/lib/article-utils";
import { ArticleSearchForm } from "@/app/components/organisms/article-search-form";

/**
 * Renders the paginated articles list page with search and filtering.
 * @param props Route props including async search parameters.
 * @returns The articles page element.
 */
export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;

  // 1. Data Fetching
  const allMetadata = await getArticles();

  // 2. Prepare Form Candidates
  const candidates = getTaxonomies(allMetadata);

  // 3. Filtering & Sorting (Logic encapsulated in libraries)
  const filteredArticles = filterArticles(allMetadata, resolvedSearchParams);
  const sortedArticles = sortArticlesByDate(filteredArticles, "createdAt");

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
