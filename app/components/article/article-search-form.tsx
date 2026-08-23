"use client";

import { Search, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import { SearchFields } from "@/app/components/article/search-fields";
import { Button } from "@/app/components/ui/button";
import type {
  ArticleSearchParams,
  TaxonomyCandidates,
} from "@/app/lib/article-types";

type ArticleSearchFormProps = {
  searchParams: ArticleSearchParams;
  candidates?: TaxonomyCandidates;
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

  return (
    <section className="mb-[4rem]">
      <div className="flex items-center justify-between mb-[2rem]">
        <h2 className="text-3xl font-bold tracking-tight">Search & Filter</h2>
      </div>
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
    </section>
  );
}
