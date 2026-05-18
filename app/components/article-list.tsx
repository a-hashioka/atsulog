import Link from "next/link";

import { siteConfig } from "@/app/lib/site-config";
import { ArticleListItemProps } from "@/app/lib/article-utils";
import { ArticleListProps } from "@/app/lib/article-utils";

/**
 * Formats an article metadata date string for display using the site locale and time zone.
 * @param value An ISO 8601 date string.
 * @returns A localized date-time string.
 */
function formatDate(value: string): string {
  return new Date(value).toLocaleString(siteConfig.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: siteConfig.timeZone,
  });
}

function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <li>
      <h3>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
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

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p>No Articles</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleListItem key={article.slug} article={article} />
      ))}
    </ul>
  );
}
