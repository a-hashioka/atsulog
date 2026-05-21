import { ArticleList } from "@/app/components/atoms/article-list";
import { PaginationNav } from "@/app/components/atoms/pagination-nav";
import type { ArticleMetadata } from "@/app/lib/article-types";

// --- Constants ---

export const ARTICLES_PER_PAGE = 12;

// --- Types ---

type SearchParams = {
  page?: string | string[];
};

export type ArticlesPageProps = {
  searchParams: Promise<SearchParams>;
};

type PaginatedArticleListProps = {
  articles: ArticleMetadata[];
  searchParams: SearchParams;
  basePath?: string;
};

// --- Main Component ---

/**
 * Organism component that renders a list of articles with pagination navigation and a title.
 * @param props - Component props.
 * @returns A section containing the title, article list, and pagination controls.
 */
export function PaginatedArticleList({
  articles,
  searchParams,
  basePath = "/articles",
}: PaginatedArticleListProps) {
  // Parse current page
  const pageParam = searchParams.page;
  const rawPage = Number.parseInt(
    Array.isArray(pageParam) ? (pageParam[0] ?? "1") : (pageParam ?? "1"),
    10,
  );
  const requestedPage = rawPage > 0 ? rawPage : 1;

  // Calculate pagination window
  const totalPages = Math.max(1, Math.ceil(articles.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pagedArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  return (
    <section>
      <h1>Articles</h1>
      <ArticleList articles={pagedArticles} basePath={basePath} />
      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </section>
  );
}
