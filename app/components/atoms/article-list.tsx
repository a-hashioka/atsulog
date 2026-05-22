import Link from "next/link";
import { formatDate } from "@/app/lib/article-utils";
import type { ArticleMetadata } from "@/app/lib/article-types";

export type ArticleListProps = {
  articles: ArticleMetadata[];
  basePath?: string;
};

/**
 * Displays a list of articles with their metadata.
 */
export function ArticleList({
  articles,
  basePath = "/articles",
}: ArticleListProps) {
  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <ul className="article-list">
      {articles.map((article) => (
        <ArticleListItem
          key={article.slug}
          article={article}
          basePath={basePath}
        />
      ))}
    </ul>
  );
}

function ArticleListItem({
  article,
  basePath,
}: {
  article: ArticleMetadata;
  basePath: string;
}) {
  return (
    <li className="article-item">
      <Link href={`${basePath}/${article.slug}`} className="article-link">
        {article.title}
      </Link>
      <div className="article-metadata">
        <span>Category: {article.category}</span>
        <br />
        <span>Created: {formatDate(article.createdAt)}</span>
        <br />
        <span>Modified: {formatDate(article.modifiedAt)}</span>
      </div>
      {article.tags.length > 0 && (
        <div className="article-tags">
          {article.tags.map((tag) => (
            <span key={tag} className="tag-item">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
