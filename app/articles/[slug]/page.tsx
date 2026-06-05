import { ArrowLeft, Pencil } from "lucide-react";
import type { Metadata } from "next";
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
import { SeriesNavigation } from "@/app/components/atoms/series-navigation";
import { siteConfig } from "@/app/lib/site-config";

const siteTitle = siteConfig.title[0].toUpperCase() + siteConfig.title.slice(1);

/**
 * Generates dynamic metadata for the article page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = await getArticleBySlug(articles, slug);

  if (!article) {
    return {
      title: `Article Not Found | ${siteTitle}`,
    };
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${article.metadata.title} | ${siteTitle}`,
    description: `Read "${article.metadata.title}" on ${siteTitle}.`,
    openGraph: {
      title: article.metadata.title,
      description: `Read "${article.metadata.title}" on ${siteTitle}.`,
      type: "article",
      publishedTime: article.metadata.createdAt,
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
      title: `${article.metadata.title} | ${siteTitle}`,
      description: `Read "${article.metadata.title}" on ${siteTitle}.`,
      creator: siteConfig.twitterHandle,
      images: [siteConfig.iconPng],
    },
  };
}

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
      <SeriesNavigation articles={articles} metadata={metadata} />

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
