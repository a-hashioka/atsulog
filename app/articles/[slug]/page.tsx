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
            <br />
          </p>
          {metadata.tags.length > 0 ? (
            <p>{metadata.tags.map((tag) => `#${tag}`).join(" ")}</p>
          ) : null}
        </header>
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
      <nav aria-label="Article detail navigation">
        <Link href="/articles">Back to Articles</Link>
      </nav>
    </main>
  );
}
