import Link from "next/link";
import { sortArticlesByDate } from "@/app/lib/article-utils";
import {
  ArticleList,
  type ArticleListProps,
} from "@/app/components/atoms/article-list";

const numberOfArticlesToShow = 3;

/**
 * Renders a list of the most recent articles.
 * @param props - Component props containing the full list of articles.
 * @returns A section displaying the latest articles and a link to the archive.
 */
export function RecentArticles({ articles }: ArticleListProps) {
  const recentArticles = sortArticlesByDate(articles, "createdAt").slice(
    0,
    numberOfArticlesToShow,
  );

  return (
    <section>
      <div>
        <h1>Recent Articles</h1>
        <ArticleList articles={recentArticles} />
        <Link href="/articles">For More</Link>
      </div>
    </section>
  );
}
