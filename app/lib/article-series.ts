import type { ArticleMetadata } from "./article-types";

/**
 * Calculates the next seriesOrder for a given series name.
 * @param seriesName - The name of the series.
 * @param articles - The list of article metadata.
 * @returns The next available seriesOrder (max + 1). Returns 0 if no articles exist in the series.
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
