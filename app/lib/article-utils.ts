import { siteConfig } from "@/app/lib/site-config";
import type {
  ArticleMetadata,
  ArticleSearchParams,
  SortBy,
  SortOrder,
} from "./article-types";

/**
 * Extracts the first string value from a search parameter.
 */
export function getParam(
  param: string | string[] | undefined,
  defaultValue: string = "",
): string {
  if (Array.isArray(param)) return param[0] ?? defaultValue;
  return param ?? defaultValue;
}

/**
 * Calculates the sorting configuration based on search parameters.
 * Defaults to "createdAt" descending, or "seriesOrder" ascending if a series is selected.
 */
export function getSortConfig(params: ArticleSearchParams): {
  field: keyof ArticleMetadata;
  order: SortOrder;
  sortBy: SortBy;
} {
  const sortByParam = getParam(params.sortBy) as SortBy;
  const orderParam = getParam(params.order) as SortOrder;
  const hasSeries = !!getParam(params.series);

  let field: keyof ArticleMetadata = "createdAt";
  let sortBy: SortBy = "created";

  // Map sortBy parameter to metadata fields
  if (sortByParam === "modified") {
    field = "modifiedAt";
    sortBy = "modified";
  } else if (sortByParam === "views") {
    field = "viewCount";
    sortBy = "views";
  } else if (hasSeries && !sortByParam) {
    // Optimization: Default to seriesOrder for series filtering
    field = "seriesOrder";
    sortBy = "created";
  }

  // Determine sort order
  // - Modified and Views always default to descending
  // - Series filtering defaults to ascending (oldest first)
  // - Otherwise, default to descending (newest first)
  const order =
    field === "modifiedAt" || field === "viewCount"
      ? "desc"
      : orderParam
        ? orderParam
        : hasSeries
          ? "asc"
          : "desc";

  return { field, order, sortBy };
}

/**
 * Sorts an array of article metadata.
 * Supports dates, numbers, and string-based fields.
 */
export function sortArticles(
  articles: ArticleMetadata[],
  field: keyof ArticleMetadata = "createdAt",
  order: SortOrder = "desc",
): ArticleMetadata[] {
  return [...articles].sort((left, right) => {
    let leftVal = left[field];
    let rightVal = right[field];

    // Handle date strings
    if (field === "createdAt" || field === "modifiedAt") {
      leftVal = Date.parse(leftVal as string);
      rightVal = Date.parse(rightVal as string);
    }

    // Handle null/undefined values
    if (leftVal === null || leftVal === undefined) return 1;
    if (rightVal === null || rightVal === undefined) return -1;

    // Standard comparison
    if (leftVal < rightVal) return order === "asc" ? -1 : 1;
    if (leftVal > rightVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Formats an ISO date string into a localized, user-friendly format.
 */
export function formatDate(value: string): string {
  return new Date(value).toLocaleString(siteConfig.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: siteConfig.timeZone,
  });
}

/**
 * Extracts unique taxonomy values (tags, categories, series) from a list of articles.
 */
export function getTaxonomies(articles: ArticleMetadata[]) {
  return {
    tags: Array.from(new Set(articles.flatMap((a) => a.tags))).sort(),
    category: Array.from(new Set(articles.map((a) => a.category))).sort(),
    series: Array.from(
      new Set(articles.map((a) => a.series).filter((s): s is string => !!s)),
    ).sort(),
  };
}

/**
 * Determines the next seriesOrder index for a new article in a given series.
 */
export function getNextSeriesOrder(
  seriesName: string,
  articles: ArticleMetadata[],
): number {
  const seriesArticles = articles.filter(
    (article) => article.series === seriesName,
  );
  const maxOrder = seriesArticles.reduce(
    (max, a) => Math.max(max, a.seriesOrder ?? -1),
    -1,
  );
  return maxOrder + 1;
}

/**
 * Filters article metadata based on the provided search parameters.
 */
export function filterArticles(
  articles: ArticleMetadata[],
  params: ArticleSearchParams,
): ArticleMetadata[] {
  const query = getParam(params.keyword).toLowerCase();
  const tag = getParam(params.tag).toLowerCase();
  const series = getParam(params.series).toLowerCase();
  const category = getParam(params.category).toLowerCase();

  if (!query && !tag && !series && !category) {
    return articles;
  }

  return articles.filter((article) => {
    // Keyword search across multiple fields
    if (query) {
      const matches =
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.series?.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query));
      if (!matches) return false;
    }

    // Tag filtering (supports comma-separated tags)
    if (tag) {
      const searchTags = tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const articleTags = article.tags.map((t) => t.toLowerCase());
      if (!searchTags.every((st) => articleTags.includes(st))) return false;
    }

    // Series and Category filtering
    if (series && article.series?.toLowerCase() !== series) return false;
    if (category && article.category.toLowerCase() !== category) return false;

    return true;
  });
}
