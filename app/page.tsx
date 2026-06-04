import { siteConfig } from "@/app/lib/site-config";
import { getArticles } from "@/app/lib/article-repository";
import { RecentArticles } from "@/app/components/organisms/recent-articles";
import { HomeHero } from "@/app/components/organisms/home-hero";
import { getTaxonomies } from "@/app/lib/article-utils";
import type { Metadata } from "next";

const siteTitle = siteConfig.title[0].toUpperCase() + siteConfig.title.slice(1);

export const metadata: Metadata = {
  title: `Home | ${siteTitle}`,
};

export default async function Home() {
  const allArticles = await getArticles();
  const articles = allArticles.filter((a) => a.published);
  const taxonomies = getTaxonomies(articles);

  const counts = {
    articles: articles.length,
    series: taxonomies.series.length,
    categories: taxonomies.category.length,
    tags: taxonomies.tags.length,
  };

  return (
    <div className="space-y-24">
      <HomeHero counts={counts} />
      <RecentArticles articles={articles} />
    </div>
  );
}
