import Link from "next/link";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

/**
 * Renders pagination links that are valid for the current position.
 * @param props - Pagination state and optional base path for links.
 * @returns A pagination navigation element.
 */
export function PaginationNav({
  currentPage,
  totalPages,
  basePath = "/articles",
}: PaginationNavProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const connector = basePath.includes("?") ? "&" : "?";

  /**
   * Generates a URL for a specific page.
   * @param page - The page number.
   * @returns The formatted URL string.
   */
  const getPageUrl = (page: number) => `${basePath}${connector}page=${page}`;

  return (
    <nav aria-label="Pagination">
      {hasPreviousPage && (
        <>
          <Link href={getPageUrl(1)}>First</Link>{" "}
          <Link href={getPageUrl(currentPage - 1)}>Previous</Link>{" "}
        </>
      )}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {hasNextPage && (
        <>
          {" "}
          <Link href={getPageUrl(currentPage + 1)}>Next</Link>{" "}
          <Link href={getPageUrl(totalPages)}>Last</Link>
        </>
      )}
    </nav>
  );
}
