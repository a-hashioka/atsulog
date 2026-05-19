import Link from "next/link";
import { formatDate } from "@/app/lib/article-display";
import type { ArticleMetadata } from "@/app/lib/article-types";

type ArticleListItemProps = {
  article: ArticleMetadata;
};

function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <li>
      <span>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
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

export type ArticleListProps = {
  articles: ArticleMetadata[];
};

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
