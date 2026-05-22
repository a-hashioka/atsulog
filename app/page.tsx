import { getArticles } from "@/app/lib/article-repository";
import { RecentArticles } from "@/app/components/organisms/recent-articles";

export default async function Home() {
  const articles = await getArticles();
  return (
    <>
      <RecentArticles articles={articles} />
    </>
  );
}
