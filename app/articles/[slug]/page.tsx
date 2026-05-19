import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getArticleMetadata,
  getArticleDetail,
} from "@/app/lib/article-repository";
import { formatDate } from "@/app/lib/article-display";

type ArticlePageParams = {
  slug: string;
};

/**
 * Generates the list of static params for article detail pages.
 * @returns All article slug params for static generation.
 */
// export async function generateStaticParams(): Promise<ArticlePageParams[]> {
//   const allArticles = await getArticleMetadata();
//   return allArticles.map((article) => ({ slug: article.slug }));
// }

type ArticlePageProps = {
  params: Promise<ArticlePageParams>;
};

/**
 * Renders an article detail page from markdown content.
 * @param props Route props including async params.
 * @returns The article detail page element.
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articles = await getArticleMetadata();
  const articleDetail = await getArticleDetail(articles, slug);

  if (!articleDetail) {
    notFound();
  }

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
