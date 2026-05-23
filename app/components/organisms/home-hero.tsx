import Image from "next/image";
import { ArticleCount } from "@/app/components/atoms/article-count";
import { siteConfig } from "@/app/lib/site-config";

type HomeHeroProps = {
  counts: {
    articles: number;
    series: number;
    categories: number;
    tags: number;
  };
};

/**
 * A hero component for the home page that displays the site icon and article statistics.
 */
export function HomeHero({ counts }: HomeHeroProps) {
  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <Image
          src={siteConfig.icon}
          alt={siteConfig.title}
          width={200}
          height={200}
          priority
        />
      </div>
      <ArticleCount counts={counts} />
    </div>
  );
}
