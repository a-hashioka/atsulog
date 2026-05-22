import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  loadArticleMetadata,
  loadArticleDetail,
} from "@/app/lib/repository/article-loader";
import { incrementViewCount } from "@/app/lib/repository/article-saver";
import { formatDate } from "@/app/lib/article-display";

type ArticlePageParams = {
  slug: string;
};

type ArticlePageProps = {
  params: Promise<ArticlePageParams>;
};

/**
 * Renders an article detail page from markdown content.
 * Increments the view count on each render.
 * @param props Route props including async params.
 * @returns The article detail page element.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articles = await loadArticleMetadata();
  const articleDetail = await loadArticleDetail(articles, slug);

  if (!articleDetail) {
    notFound();
  }

  // Increment view count using the already loaded metadata list
  await incrementViewCount(articles, slug);

  const { metadata, content } = articleDetail;

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
    <main>
      <article>
        <header>
          <h1>{metadata.title}</h1>
          <p>
            Created at {formatDate(metadata.createdAt)}
            <br />
            Modified at {formatDate(metadata.modifiedAt)}
            <br />
            Category: {metadata.category}
            {metadata.series && (
              <>
                <br />
                Series: {metadata.series}
              </>
            )}
            <br />
          </p>
          {metadata.tags.length > 0 ? (
            <p>{metadata.tags.map((tag) => `#${tag}`).join(" ")}</p>
          ) : null}
        </header>
        <ReactMarkdown>{content}</ReactMarkdown>

        {(previousInSeries || nextInSeries) && (
          <section className="series-navigation">
            <hr />
            <h3>Series: {metadata.series}</h3>
            <div>
              {previousInSeries ? (
                <Link href={`/articles/${previousInSeries.slug}`}>
                  ← Previous: {previousInSeries.title}
                </Link>
              ) : (
                <span />
              )}
              {nextInSeries ? (
                <Link href={`/articles/${nextInSeries.slug}`}>
                  Next: {nextInSeries.title} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </section>
        )}
      </article>
      <nav aria-label="Article detail navigation">
        <Link href="/articles">Back to Articles</Link>
      </nav>
    </main>
  );
}
