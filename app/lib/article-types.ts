export type ArticleMetadata = {
  slug: string;
  title: string;
  filePath: string;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  series: string | null;
  seriesOrder: number | null;
  category: string;
  viewCount: number;
};

export type ArticleDetail = {
  metadata: ArticleMetadata;
  content: string;
};

/**
 * Raw search parameters from Next.js.
 */
export type RawSearchParams = Record<string, string | string[] | undefined>;
