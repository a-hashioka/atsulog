import {
  PaginatedArticleList,
  ArticlesPageProps,
} from "@/app/components/organisms/paginated-article-list";
import { loadArticleMetadata } from "@/app/lib/repository/article-loader";
import { sortArticlesByDateDesc } from "@/app/lib/article-display";

/**
 * Renders the paginated articles list page.
 * @param props Route props including async search parameters.
 * @returns The articles page element.
 */
export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;

  const allArticles = sortArticlesByDateDesc(
    await loadArticleMetadata(),
    "createdAt",
  );

  return (
    <main>
      <PaginatedArticleList
        articles={allArticles}
        searchParams={resolvedSearchParams}
      />
    </main>
  );
}
