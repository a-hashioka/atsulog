"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import { SearchFields } from "@/app/components/atoms/search-field";

type SearchParams = {
  keyword?: string | string[];
  tag?: string | string[];
  series?: string | string[];
  category?: string | string[];
};

type ArticleSearchFormProps = {
  searchParams: SearchParams;
  candidates?: {
    tag?: string[];
    category?: string[];
    series?: string[];
  };
};

/**
 * A client-side component that renders a search and filter form for articles.
 * Uses next/form for automatic query parameter handling and prefetching.
 */
export function ArticleSearchForm({
  searchParams,
  candidates,
}: ArticleSearchFormProps) {
  const router = useRouter();

  return (
    <section>
      <h1>Search & Filter Articles</h1>
      <Form action="/articles">
        <SearchFields searchParams={searchParams} candidates={candidates} />

        <div className="form-actions">
          <button type="submit">Search</button>
          <button type="button" onClick={() => router.push("/articles")}>
            Clear
          </button>
        </div>
      </Form>
    </section>
  );
}
