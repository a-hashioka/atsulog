import { getArticles } from "@/app/lib/article-repository";
import { PaginatedArticleList } from "@/app/components/organisms/paginated-article-list";
import {
  sortArticles,
  getTaxonomies,
  filterArticles,
  getSortConfig,
} from "@/app/lib/article-utils";
import { ArticleSearchForm } from "@/app/components/organisms/article-search-form";
import { CreateArticleSection } from "@/app/components/organisms/create-article-section";
import type { ArticleSearchParams } from "@/app/lib/article-types";

/**
 * Renders the page for article management with search and filtering.
 * @param props - Route props including async search parameters.
 * @returns The article management page element.
 */
export default async function EditDashboardPage({
  searchParams,
}: {
  searchParams: Promise<ArticleSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  // 1. Data Fetching
  const allMetadata = await getArticles();

  // 2. Prepare Form Candidates
  const taxonomies = getTaxonomies(allMetadata);

  // 3. Filtering & Sorting
  const filteredArticles = filterArticles(allMetadata, resolvedSearchParams);
  const { field, order } = getSortConfig(resolvedSearchParams);
  const sortedArticles = sortArticles(filteredArticles, field, order);

  return (
    <main className="space-y-12">
      <CreateArticleSection />

      <ArticleSearchForm
        key={JSON.stringify(resolvedSearchParams)}
        searchParams={resolvedSearchParams}
        candidates={taxonomies}
        action="/edit"
      />

      <div className="space-y-10">
        <PaginatedArticleList
          articles={sortedArticles}
          searchParams={resolvedSearchParams}
          basePath="/edit"
        />
      </div>
    </main>
  );
}
