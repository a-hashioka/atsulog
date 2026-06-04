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
import { ArticleTaxonomies } from "@/app/components/atoms/article-taxonomies";

/**
 * Renders an individual article detail page.
 * Increments the view count on every render.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const articleDetail = await getArticleBySlug(articles, slug);

  if (!articleDetail || !articleDetail.metadata.published) {
    notFound();
  }

  const { metadata, content } = articleDetail;

  // Record a view for this article
  await incrementViewCount(articles, slug);

  const authenticated = await isAuthenticated();

  // Handle series-based navigation if the article belongs to one
  let previousInSeries = null;
  let nextInSeries = null;
  if (metadata.series && metadata.seriesOrder !== null) {
    const seriesArticles = articles
      .filter((a) => a.series === metadata.series && a.published)
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

        {/* Article Metadata (Dates, Views) */}
        <ArticleMeta metadata={metadata} className="mb-6" />

        {/* Taxonomy Links (Category, Series, Tags) */}
        <ArticleTaxonomies metadata={metadata} />
      </header>

      {/* Main Article Content */}
      <div className="mb-16">
        <MarkdownRenderer content={content} />
      </div>

      {/* Series Navigation (Previous/Next) */}
      {(previousInSeries || nextInSeries) && (
        <section className="bg-gray-50 rounded-xl p-8 mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 flex items-center justify-between">
            <span>More from {metadata.series}</span>
            <Link
              href={`/articles?series=${encodeURIComponent(metadata.series!)}`}
              className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              View all in series &rarr;
            </Link>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {previousInSeries && (
              <Link
                href={`/articles/${previousInSeries.slug}`}
                className="group block p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <ChevronLeft className="size-3 mr-1" />
                  Previous Part
                </div>
                <div className="font-medium group-hover:text-sky-600 transition-colors">
                  {previousInSeries.title}
                </div>
              </Link>
            )}
            {nextInSeries && (
              <Link
                href={`/articles/${nextInSeries.slug}`}
                className="group block p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center text-xs text-gray-400 mb-2 justify-end">
                  Next Part
                  <ChevronRight className="size-3 ml-1" />
                </div>
                <div className="font-medium group-hover:text-sky-600 transition-colors text-right">
                  {nextInSeries.title}
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Admin Actions and Navigation */}
      <footer className="border-t border-gray-100 pt-8 flex items-center justify-between">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Articles
        </Link>

        {authenticated && (
          <Link
            href={`/edit/${slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Pencil className="size-4 mr-2" />
            Edit this article
          </Link>
        )}
      </footer>
    </article>
  );
}
