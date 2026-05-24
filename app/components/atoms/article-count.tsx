import { Newspaper, BookOpen, Folder, Tag } from "lucide-react";

/**
 * A display component for the site statistics (articles, series, categories, tags).
 * @param props - Component props containing counts.
 * @returns A centered section displaying site statistics.
 */
export function ArticleCount({
  counts,
}: {
  counts: {
    articles: number;
    series: number;
    categories: number;
    tags: number;
  };
}) {
  const statItems = [
    { label: "Articles", value: counts.articles, icon: Newspaper },
    { label: "Series", value: counts.series, icon: BookOpen },
    { label: "Categories", value: counts.categories, icon: Folder },
    { label: "Tags", value: counts.tags, icon: Tag },
  ];

  return (
    <section className="animate-fade-in-up text-center">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 md:mb-10 font-mono text-gray-900">
        # of Articles
      </h2>
      <div className="flex justify-center gap-6 md:gap-16">
        {statItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-bold font-mono leading-none mb-3 md:mb-4 text-gray-900">
              {item.value}
            </span>
            <div className="flex items-center text-gray-400">
              <item.icon className="size-3 md:size-4 mr-1 md:mr-1.5" />
              <span className="text-[0.625rem] md:text-xs font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
