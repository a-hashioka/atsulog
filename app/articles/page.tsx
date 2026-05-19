import Link from "next/link";

import { ArticleList } from "@/app/components/article-list";
import { getArticleMetadata } from "@/app/lib/article-repository";
import { sortArticlesByDateDesc } from "@/app/lib/article-display";

const articlesPerPage = 12;

type ArticleSearchParams = {
  page?: string | string[];
};

/**
 * Parses and normalizes the current page number from URL search parameters.
 * @param searchParams URL search parameters for the articles route.
 * @returns A positive page number. Returns 1 when the value is missing or invalid.
 */
function parseCurrentPage(searchParams: ArticleSearchParams): number {
  const pageParam = searchParams.page;
  const parsedPage = Number.parseInt(
    Array.isArray(pageParam) ? (pageParam[0] ?? "1") : (pageParam ?? "1"),
    10,
  );

  return parsedPage > 0 ? parsedPage : 1;
}

type PaginationWindow = {
  totalPages: number;
  safeCurrentPage: number;
  startIndex: number;
  endIndex: number;
};

/**
 * Computes pagination boundaries and list slice indices.
 * @param totalArticleCount The total number of available articles.
 * @param currentPage The requested page number.
 * @returns Pagination metadata including bounded page and slice indices.
 */
function getPaginationWindow(
  totalArticleCount: number,
  currentPage: number,
): PaginationWindow {
  const totalPages = Math.max(
    1,
    Math.ceil(totalArticleCount / articlesPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;

  return { totalPages, safeCurrentPage, startIndex, endIndex };
}

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
};

/**
 * Renders pagination links that are valid for the current position.
 * @param props Pagination state for rendering navigation links.
 * @returns A pagination element.
 */
function PaginationNav({ currentPage, totalPages }: PaginationNavProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <>
      {hasPreviousPage ? (
        <>
          <Link href="/articles?page=1">First</Link>{" "}
          <Link href={`/articles?page=${currentPage - 1}`}>Previous</Link>{" "}
        </>
      ) : null}
      <span>Current: {currentPage}</span>
      {hasNextPage ? (
        <>
          {" "}
          <Link href={`/articles?page=${currentPage + 1}`}>Next</Link>{" "}
          <Link href={`/articles?page=${totalPages}`}>Last</Link>
        </>
      ) : null}
    </>
  );
}

type ArticlesPageProps = {
  searchParams: Promise<ArticleSearchParams>;
};

/**
 * Renders the paginated articles list page.
 * @param props Route props including async search parameters.
 * @returns The articles page element.
 */
export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const currentPage = parseCurrentPage(await searchParams);

  const allArticles = sortArticlesByDateDesc(
    await getArticleMetadata(),
    "createdAt",
  );
  const { totalPages, safeCurrentPage, startIndex, endIndex } =
    getPaginationWindow(allArticles.length, currentPage);
  const pagedArticles = allArticles.slice(startIndex, endIndex);

  return (
    <main>
      <h1>Articles</h1>
      <ArticleList articles={pagedArticles} />
      <PaginationNav currentPage={safeCurrentPage} totalPages={totalPages} />
    </main>
  );
}
