import { loadArticleMetadata } from "@/app/lib/repository/article-loader";
import {
  PaginatedArticleList,
  type ArticlesPageProps,
} from "@/app/components/organisms/paginated-article-list";
import { sortArticlesByDateDesc } from "@/app/lib/article-display";
import Link from "next/link";
import { LogoutButton } from "@/app/components/atoms/logout-button";

/**
 * Renders the page for article management.
 * @param props - Route props including async search parameters.
 * @returns The article management page element.
 */
export default async function NewArticlePage({
  searchParams,
}: ArticlesPageProps) {
  const allArticles = sortArticlesByDateDesc(
    await loadArticleMetadata(),
    "createdAt",
  );

  const resolvedSearchParams = await searchParams;

  return (
    <main>
      <div>
        <LogoutButton />
        <Link href="/edit/create">Create New Article</Link>
      </div>
      <PaginatedArticleList
        articles={allArticles}
        searchParams={resolvedSearchParams}
        basePath="/edit"
      />
    </main>
  );
}
