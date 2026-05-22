import { getArticles } from "@/app/lib/article-repository";
import {
  PaginatedArticleList,
  type ArticlesPageProps,
} from "@/app/components/organisms/paginated-article-list";
import {
  sortArticlesByDate,
  getTaxonomies,
  filterArticles,
} from "@/app/lib/article-utils";
import Link from "next/link";
import { LogoutButton } from "@/app/components/atoms/logout-button";
import { ArticleSearchForm } from "@/app/components/organisms/article-search-form";

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
  const allMetadata = await getArticles();

  // 2. Prepare Form Candidates
  const taxonomies = getTaxonomies(allMetadata);

  // 3. Filtering & Sorting
  const filteredArticles = filterArticles(allMetadata, resolvedSearchParams);
  const sortedArticles = sortArticlesByDate(filteredArticles, "createdAt");

  return (
    <main>
      <header>
        <LogoutButton />
        <Link href="/edit/create">Create New Article</Link>
      </header>
      <ArticleSearchForm
        searchParams={resolvedSearchParams}
        candidates={taxonomies}
        action="/edit"
      />
      <PaginatedArticleList
        articles={sortedArticles}
        searchParams={resolvedSearchParams}
        basePath="/edit"
      />
    </main>
  );
}
