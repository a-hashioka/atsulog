import { siteConfig } from "@/app/lib/site-config";
import { getArticles } from "@/app/lib/article-repository";
import { RecentArticles } from "@/app/components/organisms/recent-articles";
import { HeroTitle } from "@/app/components/organisms/hero-title";
import { SiteStats } from "@/app/components/organisms/site-stats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home | ${siteConfig.title}`,
  description: `${siteConfig.title} is a personal blog.`,
  openGraph: {
    title: `Home | ${siteConfig.title}`,
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
  twitter: {
    card: "summary",
    title: `Home`,
    description: `${siteConfig.title} is a personal blog.`,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.iconPng],
  },
};

export default async function Home() {
  const allArticles = await getArticles();
  const articles = allArticles.filter((a) => a.published);

  return (
    <div className="space-y-16">
      <HeroTitle />
      <SiteStats articles={articles} />
      <RecentArticles articles={articles} />
    </div>
  );
}
