import type { ArticleMetadata } from "./article-types";

/**
 * Raw search parameters from Next.js.
 */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * Helper to extract the first string value from search parameters.
 */
function getFirstValue(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] ?? "";
  return val ?? "";
}

/**
 * Filters an array of article metadata based on raw search parameters.
 * @param articles - The array of article metadata to filter.
 * @param params - The raw search parameters from the URL.
 * @returns The filtered array of article metadata.
 */
export function filterArticles(
  articles: ArticleMetadata[],
  params: RawSearchParams,
): ArticleMetadata[] {
  const lowKeyword = getFirstValue(params.keyword).toLowerCase();
  const lowTag = getFirstValue(params.tag).toLowerCase();
  const lowSeries = getFirstValue(params.series).toLowerCase();
  const lowCategory = getFirstValue(params.category).toLowerCase();

  if (!lowKeyword && !lowTag && !lowSeries && !lowCategory) {
    return articles;
  }

  return articles.filter((article) => {
    // Keyword search (All Metadata Fields)
    if (lowKeyword) {
      const matchesKeyword =
        article.title.toLowerCase().includes(lowKeyword) ||
        article.slug.toLowerCase().includes(lowKeyword) ||
        article.category.toLowerCase().includes(lowKeyword) ||
        (article.series?.toLowerCase().includes(lowKeyword) ?? false) ||
        article.tags.some((t) => t.toLowerCase().includes(lowKeyword));

      if (!matchesKeyword) return false;
    }

    // Tag filter
    if (lowTag && !article.tags.some((t) => t.toLowerCase() === lowTag)) {
      return false;
    }

    // Series filter
    if (lowSeries && article.series?.toLowerCase() !== lowSeries) {
      return false;
    }

    // Category filter
    if (lowCategory && article.category.toLowerCase() !== lowCategory) {
      return false;
    }

    return true;
  });
}
