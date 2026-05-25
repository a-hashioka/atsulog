import { ArrowLeft, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/app/components/atoms/markdown-renderer";

import {
  getArticles,
  getArticleBySlug,
  incrementViewCount,
} from "@/app/lib/article-repository";
import { isAuthenticated } from "@/app/lib/auth";
import { ArticleMeta } from "@/app/components/atoms/article-meta";
import { Tag } from "@/app/components/atoms/tag";

/**
 * Renders an article detail page from markdown content.
 * Increments the view count on each render.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const articleDetail = await getArticleBySlug(articles, slug);

  if (!articleDetail) {
    notFound();
  }

  // Increment view count using the already loaded metadata list
  await incrementViewCount(articles, slug);

  const { metadata, content } = articleDetail;
  const authenticated = await isAuthenticated();

  // Find series navigation
  let previousInSeries = null;
  let nextInSeries = null;
  if (metadata.series && metadata.seriesOrder !== null) {
    const seriesArticles = articles
      .filter((a) => a.series === metadata.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

    const currentIndex = seriesArticles.findIndex((a) => a.slug === slug);
    if (currentIndex > 0) {
      previousInSeries = seriesArticles[currentIndex - 1];
    }
    if (currentIndex < seriesArticles.length - 1) {
      nextInSeries = seriesArticles[currentIndex + 1];
    }
  }

  return (
    <article className="py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {metadata.title}
        </h1>
        <ArticleMeta metadata={metadata} className="mb-6" />
        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map((tag) => (
              <Tag key={tag} label={tag} href={`/articles?tag=${tag}`} />
            ))}
          </div>
        )}
      </header>

      <div className="mb-16">
        <MarkdownRenderer content={content} />
      </div>

      {(previousInSeries || nextInSeries) && (
        <section className="bg-gray-50 rounded-xl p-8 mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            More from {metadata.series}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {previousInSeries ? (
              <Link
                href={`/articles/${previousInSeries.slug}`}
                className="group block p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-xs text-muted mb-1 flex items-center">
                  <ChevronLeft className="size-3 mr-1" /> Previous
                </div>
                <div className="font-medium group-hover:text-blue-600 transition-colors">
                  {previousInSeries.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextInSeries ? (
              <Link
                href={`/articles/${nextInSeries.slug}`}
                className="group block p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-colors text-right"
              >
                <div className="text-xs text-muted mb-1 flex items-center justify-end">
                  Next <ChevronRight className="size-3 ml-1" />
                </div>
                <div className="font-medium group-hover:text-blue-600 transition-colors">
                  {nextInSeries.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      <nav
        aria-label="Article detail navigation"
        className="border-t pt-10 flex items-center justify-between"
      >
        <Link
          href="/articles"
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Articles
        </Link>
        {authenticated && (
          <Link
            href={`/edit/${slug}`}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center"
          >
            <Pencil className="size-4 mr-2" />
            Edit this article
          </Link>
        )}
      </nav>
    </article>
  );
}
