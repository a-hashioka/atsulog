import { siteConfig } from "@/app/lib/site-config";
import type { ArticleMetadata } from "./article-types";

export type ArticleDateField = "createdAt" | "modifiedAt";

/**
 * Sorts articles by a date field in descending order (newest first).
 * @param articles Article-like items that include createdAt and modifiedAt.
 * @param field Date field used for sorting.
 * @returns A new array sorted by the selected field in descending order.
 */
export function sortArticlesByDateDesc<
  T extends { createdAt: string; modifiedAt: string },
>(articles: T[], field: ArticleDateField): T[] {
  return [...articles].sort(
    (left, right) => Date.parse(right[field]) - Date.parse(left[field]),
  );
}

/**
 * Formats an article metadata date string for display using the site locale and time zone.
 * @param value An ISO 8601 date string.
 * @returns A localized date-time string.
 */
export function formatDate(value: string): string {
  return new Date(value).toLocaleString(siteConfig.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: siteConfig.timeZone,
  });
}

/**
 * Extracts unique candidates (tags, categories, series) from a list of article metadata.
 * @param metadata List of article metadata.
 * @returns An object containing sorted unique tags, categories, and series.
 */
export function extractArticleCandidates(metadata: ArticleMetadata[]) {
  return {
    tag: Array.from(new Set(metadata.flatMap((a) => a.tags))).sort(),
    category: Array.from(new Set(metadata.map((a) => a.category))).sort(),
    series: Array.from(
      new Set(metadata.map((a) => a.series).filter((s): s is string => !!s)),
    ).sort(),
  };
}
