"use client";

import { ArticleCount } from "@/app/components/atoms/article-count";
import { HeroTitle } from "@/app/components/atoms/hero-title";

type HomeHeroProps = {
  counts: {
    articles: number;
    series: number;
    categories: number;
    tags: number;
  };
};

/**
 * A hero component for the home page that displays the site banner and article statistics.
 */
export function HomeHero({ counts }: HomeHeroProps) {
  return (
    <div className="space-y-10 md:space-y-12">
      <HeroTitle />
      <ArticleCount counts={counts} />
    </div>
  );
}
