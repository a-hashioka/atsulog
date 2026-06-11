import { siteConfig } from "@/app/lib/site-config";
import { getArticles } from "@/app/lib/article-repository";
import { RecentArticles } from "@/app/components/organisms/recent-articles";
import { HomeHero } from "@/app/components/organisms/home-hero";
import { getTaxonomies } from "@/app/lib/article-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home | ${siteConfig.title}`,
  description: `${siteConfig.title} is a personal blog.`,
  openGraph: {
    title: "Home",
    description: `${siteConfig.title} is a personal blog.`,
    url: siteConfig.url,
    siteName: siteConfig.title,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.iconPng,
        width: 600,
        height: 600,
        alt: siteConfig.title,
      },
    ],
  },
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
