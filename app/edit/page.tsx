import { loadArticleMetadata } from "@/app/lib/repository/article-loader";
import {
  PaginatedArticleList,
  type ArticlesPageProps,
} from "@/app/components/organisms/paginated-article-list";
import {
  sortArticlesByDateDesc,
  extractArticleCandidates,
} from "@/app/lib/article-display";
import Link from "next/link";
import { LogoutButton } from "@/app/components/atoms/logout-button";
import { ArticleSearchForm } from "@/app/components/organisms/article-search-form";
import { filterArticles } from "@/app/lib/article-filter";

/**
 * Renders the page for article management with search and filtering.
 * @param props - Route props including async search parameters.
 * @returns The article management page element.
 */
export default async function NewArticlePage({
  searchParams,
}: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;

  // 1. Data Fetching
  const allMetadata = await loadArticleMetadata();

  // 2. Prepare Form Candidates
  const candidates = extractArticleCandidates(allMetadata);

  // 3. Filtering & Sorting (Using shared libraries)
  const filteredArticles = filterArticles(allMetadata, resolvedSearchParams);
  const sortedArticles = sortArticlesByDateDesc(filteredArticles, "createdAt");

  return (
    <main>
      <header>
        <LogoutButton />
        <Link href="/edit/create">Create New Article</Link>
      </header>
      <ArticleSearchForm
        searchParams={resolvedSearchParams}
        candidates={candidates}
      />
      <PaginatedArticleList
        articles={sortedArticles}
        searchParams={resolvedSearchParams}
        basePath="/edit"
      />
    </main>
  );
}
