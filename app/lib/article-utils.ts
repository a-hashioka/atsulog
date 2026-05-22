import { siteConfig } from "@/app/lib/site-config";
import type { ArticleMetadata, RawSearchParams } from "./article-types";

export type DateKey = "createdAt" | "modifiedAt";

/**
 * Sorts articles by a date field in descending order (newest first).
 */
export function sortArticlesByDate<
  T extends { createdAt: string; modifiedAt: string },
>(articles: T[], field: DateKey = "createdAt"): T[] {
  return [...articles].sort(
    (left, right) => Date.parse(right[field]) - Date.parse(left[field]),
  );
}

/**
 * Formats a date string for localized display.
 */
export function formatDate(value: string): string {
  return new Date(value).toLocaleString(siteConfig.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: siteConfig.timeZone,
  });
}

/**
 * Extracts unique taxonomies (tags, categories, series) from a list of articles.
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
 * Calculates the next seriesOrder for a given series name.
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
 * Filters articles based on search parameters.
 */
export function filterArticles(
  articles: ArticleMetadata[],
  params: RawSearchParams,
): ArticleMetadata[] {
  const getVal = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v)?.toLowerCase() ?? "";

  const query = getVal(params.keyword);
  const tag = getVal(params.tag);
  const series = getVal(params.series);
  const category = getVal(params.category);

  if (!query && !tag && !series && !category) {
    return articles;
  }

  return articles.filter((article) => {
    if (query) {
      const matches =
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.series?.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query));
      if (!matches) return false;
    }

    if (tag) {
      const searchTags = tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const articleTags = article.tags.map((t) => t.toLowerCase());
      if (!searchTags.every((st) => articleTags.includes(st))) return false;
    }

    if (series && article.series?.toLowerCase() !== series) return false;
    if (category && article.category.toLowerCase() !== category) return false;

    return true;
  });
}
