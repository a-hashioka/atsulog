"use client";

import { ChevronDown, ChevronUp, Search, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import { SearchFields } from "@/app/components/atoms/search-field";
import { Button } from "@/app/components/atoms/button";

type SearchParams = {
  keyword?: string | string[];
  tag?: string | string[];
  series?: string | string[];
  category?: string | string[];
};

type ArticleSearchFormProps = {
  searchParams: SearchParams;
  candidates?: {
    tags?: string[];
    category?: string[];
    series?: string[];
  };
  action?: string;
};

/**
 * A client-side component that renders a search and filter form for articles.
 * Uses next/form for automatic query parameter handling and prefetching.
 */
export function ArticleSearchForm({
  searchParams,
  candidates,
  action = "/articles",
}: ArticleSearchFormProps) {
  const router = useRouter();
  const hasActiveSearchParams = Object.entries(searchParams).some(
    ([key, value]) => {
      // Ignore pagination and sorting parameters for auto-opening
      if (key === "page" || key === "sortBy" || key === "order") return false;

      if (Array.isArray(value)) {
        return value.some((item) => item.trim().length > 0);
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      return false;
    },
  );
  const [isOpen, setIsOpen] = useState(hasActiveSearchParams);

  return (
    <section className={isOpen ? "mb-[4rem]" : "mb-[2rem]"}>
      <div className="flex items-center justify-between mb-[2rem]">
        <h2 className="text-3xl font-bold tracking-tight">Search & Filter</h2>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? "Hide search form" : "Show search form"}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          <span className="hidden md:inline">{isOpen ? "Hide" : "Show"}</span>
          {isOpen ? (
            <ChevronUp className="size-4.5 md:size-4" />
          ) : (
            <ChevronDown className="size-4.5 md:size-4" />
          )}
        </button>
      </div>
      {isOpen && (
        <Form action={action}>
          <SearchFields
            key={JSON.stringify(searchParams)}
            searchParams={searchParams}
            candidates={candidates}
          />

          <div className="flex items-center space-x-[1rem]">
            <Button type="submit" icon={Search} variant="primary">
              Search
            </Button>
            <Button
              type="button"
              onClick={() => router.push(action)}
              icon={RotateCcw}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </Form>
      )}
    </section>
  );
}
