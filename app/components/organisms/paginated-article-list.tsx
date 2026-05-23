import Link from "next/link";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Calendar,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { ArticleList } from "@/app/components/atoms/article-list";
import { PaginationNav } from "@/app/components/atoms/pagination-nav";
import type {
  ArticleMetadata,
  ArticleSearchParams,
} from "@/app/lib/article-types";
import { getParam, getSortConfig } from "@/app/lib/article-utils";

// --- Constants ---

export const ARTICLES_PER_PAGE = 6;

// --- Types ---

type PaginatedArticleListProps = {
  articles: ArticleMetadata[];
  searchParams: ArticleSearchParams;
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
  const rawPage = Number.parseInt(getParam(searchParams.page, "1"), 10);
  const requestedPage = rawPage > 0 ? rawPage : 1;

  // Get current sort configuration
  const { sortBy, order: currentOrder } = getSortConfig(searchParams);
  const isCreated = sortBy === "created";
  const isModified = sortBy === "modified";
  const isViews = sortBy === "views";
  const isAsc = currentOrder === "asc";

  // Cycle: Created -> Modified -> Views -> Created
  let nextSortBy = "created";
  if (isCreated) nextSortBy = "modified";
  else if (isModified) nextSortBy = "views";

  // Calculate pagination window
  const totalPages = Math.max(
    1,
    Math.ceil(articles.length / ARTICLES_PER_PAGE),
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pagedArticles = articles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE,
  );

  /**
   * Generates a URL with updated parameters, preserving others.
   */
  const getUpdateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    return `${basePath}?${params.toString()}`;
  };

  return (
    <section className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>

        <div className="flex items-center space-x-2">
          {/* Sort By Toggle */}
          <Link
            href={getUpdateUrl({
              sortBy: nextSortBy,
              // When switching to modified or views, force desc order
              ...(nextSortBy === "modified" || nextSortBy === "views"
                ? { order: "desc" }
                : {}),
            })}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all border ${
              isViews
                ? "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100"
                : isModified
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100"
            }`}
            title={`Sort by ${nextSortBy.charAt(0).toUpperCase() + nextSortBy.slice(1)}`}
          >
            {isViews ? (
              <>
                <BarChart3 size={14} />
                <span>Views</span>
              </>
            ) : isModified ? (
              <>
                <RotateCcw size={14} />
                <span>Modified</span>
              </>
            ) : (
              <>
                <Calendar size={14} />
                <span>Created</span>
              </>
            )}
          </Link>

          {/* Order Toggle - Only show if sorting by created (Modified and Views are desc-only) */}
          {isCreated && (
            <Link
              href={getUpdateUrl({ order: isAsc ? "desc" : "asc" })}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-lg transition-all"
              title={isAsc ? "Sort Descending" : "Sort Ascending"}
            >
              {isAsc ? (
                <>
                  <ArrowUpNarrowWide size={14} />
                  <span>Asc</span>
                </>
              ) : (
                <>
                  <ArrowDownWideNarrow size={14} />
                  <span>Desc</span>
                </>
              )}
            </Link>
          )}
        </div>
      </div>

      <ArticleList articles={pagedArticles} basePath={basePath} />
      <PaginationNav
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        searchParams={searchParams}
      />
    </section>
  );
}
