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
    <div className="space-y-10 md:space-y-12">
      <div className="relative flex justify-center py-24 md:py-32 overflow-hidden">
        {/* Dot Grid Background - Simple outer fade mask only */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `radial-gradient(#9ca3af 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black, transparent 85%)",
          }}
        />

        {/* Text Wrapper with background color to 'block' dots - Tighter fit */}
        <div className="relative z-10 bg-white px-4 py-2 md:px-6 md:py-3">
          <div className="text-3xl font-normal text-center flex flex-wrap items-center justify-center gap-2.5 md:gap-3 cursor-default">
            <span className="whitespace-nowrap">
              Welcome to
            </span>
            <div className="relative">
              <Image
                src="/favicon.ico"
                alt=""
                width={48}
                height={48}
                className="w-8 h-8 md:w-10 md:h-10"
                priority
                unoptimized
              />
            </div>
            <span className="whitespace-nowrap">
              {siteConfig.title}
            </span>
          </div>
        </div>
      </div>
      <ArticleCount counts={counts} />
    </div>
  );
}
