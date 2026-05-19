import Link from "next/link";
import { getArticleMetadata } from "@/app/lib/article-repository";
import { sortArticlesByDateDesc } from "@/app/lib/article-display";
import { ArticleList, ArticleListProps } from "@/app/components/article-list";

const numberOfArticlesToShow = 3;

function RecentArticles({ articles }: ArticleListProps) {
  const recentArticles = sortArticlesByDateDesc(articles, "createdAt").slice(
    0,
    numberOfArticlesToShow,
  );

  return (
    <>
      <div>
        <h1>Recent Articles</h1>
        <ArticleList articles={recentArticles} />
        <Link href="/articles">For More</Link>
      </div>
    </>
  );
}

export default async function Home() {
  const articles = await getArticleMetadata();
  return (
    <>
      <RecentArticles articles={articles} />
    </>
  );
}
