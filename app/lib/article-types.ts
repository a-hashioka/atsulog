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
