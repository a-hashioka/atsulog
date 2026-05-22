import Link from "next/link";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string | string[] | undefined>;
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
  searchParams = {},
}: PaginationNavProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  /**
   * Generates a URL for a specific page, preserving other search parameters.
   * @param page - The page number.
   * @returns The formatted URL string.
   */
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page" || value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });

    // Set the new page
    params.set("page", page.toString());

    return `${basePath}?${params.toString()}`;
  };

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
