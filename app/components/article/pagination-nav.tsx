"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { ArticleSearchParams } from "@/app/lib/article-types";
import { buildArticleSearchUrl } from "@/app/lib/article-utils";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: ArticleSearchParams;
};

/**
 * Renders pagination links that are valid for the current position.
 * Allows clicking on the page indicator to input a specific page number to jump to.
 */
export function PaginationNav({
  currentPage,
  totalPages,
  basePath = "/articles",
  searchParams = {},
}: PaginationNavProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const [prevPage, setPrevPage] = useState(currentPage);

  // Sync input when currentPage changes externally
  if (currentPage !== prevPage) {
    setPrevPage(currentPage);
    setInputPage(currentPage.toString());
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handleJump = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      router.push(buildArticleSearchUrl(basePath, searchParams, { page }));
      setIsEditing(false);
    } else {
      setInputPage(currentPage.toString());
      setIsEditing(false);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center mt-[3rem] py-[2rem] border-t border-gray-100"
    >
      <div className="flex items-center space-x-[0.5rem]">
        {hasPreviousPage ? (
          <>
            <Link
              href={buildArticleSearchUrl(basePath, searchParams, { page: 1 })}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              title="First Page"
            >
              <span className="sr-only">First</span>
              <ChevronsLeft className="size-4" />
            </Link>
            <Link
              href={buildArticleSearchUrl(basePath, searchParams, {
                page: currentPage - 1,
              })}
              className="p-2 px-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all flex items-center"
            >
              <ChevronLeft className="size-4 md:mr-1" />
              <span className="hidden md:inline">Prev</span>
            </Link>
          </>
        ) : (
          <>
            <span className="p-2 text-gray-200 cursor-not-allowed">
              <ChevronsLeft className="size-4" />
            </span>
            <span className="p-2 px-3 text-sm font-medium text-gray-200 cursor-not-allowed flex items-center">
              <ChevronLeft className="size-4 md:mr-1" />
              <span className="hidden md:inline">Prev</span>
            </span>
          </>
        )}

        {isEditing ? (
          <form
            onSubmit={handleJump}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg flex items-center"
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputPage}
              onChange={(e) =>
                setInputPage(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="w-6 bg-transparent border-none text-sm font-medium text-gray-900 text-center focus:ring-0 p-0 outline-none"
            />
            <span className="text-gray-400 font-normal mx-1">/</span>
            <span className="text-sm font-medium text-gray-900">
              {totalPages}
            </span>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 text-sm font-medium text-gray-900 bg-gray-50 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Jump to page"
          >
            {currentPage}{" "}
            <span className="text-gray-400 font-normal mx-1">/</span>{" "}
            {totalPages}
          </button>
        )}

        {hasNextPage ? (
          <>
            <Link
              href={buildArticleSearchUrl(basePath, searchParams, {
                page: currentPage + 1,
              })}
              className="p-2 px-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all flex items-center"
            >
              <span className="md:mr-1 hidden md:inline">Next</span>
              <ChevronRight className="size-4" />
            </Link>
            <Link
              href={buildArticleSearchUrl(basePath, searchParams, {
                page: totalPages,
              })}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              title="Last Page"
            >
              <span className="sr-only">Last</span>
              <ChevronsRight className="size-4" />
            </Link>
          </>
        ) : (
          <>
            <span className="p-2 px-3 text-sm font-medium text-gray-200 cursor-not-allowed flex items-center">
              <span className="md:mr-1 hidden md:inline">Next</span>
              <ChevronRight className="size-4" />
            </span>
            <span className="p-2 text-gray-200 cursor-not-allowed">
              <ChevronsRight className="size-4" />
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
