import Link from "next/link";
import { formatDate } from "@/app/lib/article-display";
import type { ArticleMetadata } from "@/app/lib/article-types";

// --- Types ---

export type ArticleListProps = {
  articles: ArticleMetadata[];
  basePath?: string;
};

type ArticleListItemProps = {
  article: ArticleMetadata;
  basePath: string;
};

// --- Main Component ---

/**
 * Renders a list of articles.
 * @param props - Component props.
 * @returns An unordered list of article items or a message if empty.
 */
export function ArticleList({
  articles,
  basePath = "/articles",
}: ArticleListProps) {
  if (articles.length === 0) {
    return <p>No Articles</p>;
  }

  return (
    <ul>
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

// --- Sub-components ---

/**
 * A single item in the article list.
 * @param props - Component props.
 * @returns A list item displaying article details.
 */
function ArticleListItem({ article, basePath }: ArticleListItemProps) {
  return (
    <li>
      <span>
        <Link href={`${basePath}/${article.slug}`}>{article.title}</Link>
      </span>
      <p>
        Category: {article.category}
        <br />
        Created at {formatDate(article.createdAt)}
        <br />
        Modified at {formatDate(article.modifiedAt)}
      </p>
      {article.tags.length > 0 ? (
        <div>
          {article.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      ) : null}
    </li>
  );
}
