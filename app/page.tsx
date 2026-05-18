import Link from "next/link";
import { loadArticleMetadata } from "@/app/lib/article-utils";
import { ArticleListProps } from "@/app/lib/article-utils";
import { sortArticlesByDateDesc } from "@/app/lib/article-sorting";
import { ArticleList } from "@/app/components/article-list";

const numberOfArticlesToShow = 3;

function RecentArticles({ articles }: ArticleListProps) {
  const recentArticles = sortArticlesByDateDesc(articles, "createdAt").slice(
    0,
    numberOfArticlesToShow,
  );

  return (
    <>
      <div>
        <h2>Recent Articles</h2>
        <ArticleList articles={recentArticles} />
        <Link href="/articles">For More</Link>
      </div>
    </>
  );
}

export default async function Home() {
  const articles = await loadArticleMetadata();
  return (
    <>
      <RecentArticles articles={articles} />
    </>
  );
}
