import { loadArticleMetadata } from "@/app/lib/repository/article-loader";
import { RecentArticles } from "@/app/components/organisms/recent-articles";

export default async function Home() {
  const articles = await loadArticleMetadata();
  return (
    <>
      <RecentArticles articles={articles} />
    </>
  );
}
