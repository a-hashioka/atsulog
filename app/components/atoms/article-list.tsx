import { SearchX } from "lucide-react";
import Link from "next/link";
import type { ArticleMetadata } from "@/app/lib/article-types";
import { Tag } from "@/app/components/atoms/tag";
import { ArticleMeta } from "@/app/components/atoms/article-meta";

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
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-6">
          <SearchX className="size-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-400">No articles found</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-[1.5rem]">
      {articles.map((article) => (
        <ArticleListItem
          key={article.slug}
          article={article}
          basePath={basePath}
        />
      ))}
    </div>
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
    <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-sky-200 transition-all duration-300 flex flex-col">
      <Link
        href={`${basePath}/${article.slug}`}
        className="p-[1.5rem] flex-1 flex flex-col space-y-[1rem]"
      >
        <h2 className="text-xl font-bold leading-tight transition-colors duration-300">
          {article.title}
        </h2>
        <ArticleMeta metadata={article} />
      </Link>
      {article.tags.length > 0 && (
        <div className="px-[1.5rem] pb-[1.5rem] flex flex-wrap gap-[0.5rem]">
          {article.tags.map((tag) => (
            <Tag key={tag} label={tag} href={`${basePath}?tag=${tag}`} />
          ))}
        </div>
      )}
    </div>
  );
}
