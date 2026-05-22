import { notFound, redirect } from "next/navigation";

import {
  getArticleBySlug,
  getArticles,
  saveArticle,
} from "@/app/lib/article-repository";
import { EditArticleForm } from "@/app/components/organisms/edit-article-form";
import { getTaxonomies } from "@/app/lib/article-utils";

/**
 * Article Edit Page.
 * @param props - Route parameters containing the article slug.
 * @returns The edit page component.
 */
export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const detail = await getArticleBySlug(articles, slug);

  if (!detail) {
    notFound();
  }

  const taxonomies = getTaxonomies(articles);

  /**
   * Server Action to handle the update of an article.
   * Extracts form data, merges it with existing metadata, and saves.
   * @param formData - The submitted form data.
   */
  async function handleSave(formData: FormData) {
    "use server";

    const raw = Object.fromEntries(formData) as Record<string, string>;

    const updatedMetadata = {
      ...detail!.metadata,
      title: raw.title,
      category: raw.category,
      series: raw.series.trim() || null,
      tags: raw.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      modifiedAt: new Date().toISOString(),
    };

    // Use fresh metadata list for saving to prevent potential race conditions
    await saveArticle(await getArticles(), updatedMetadata, raw.content);

    // redirect(`/articles/${slug}`);
    redirect(`/edit/`);
  }

  return (
    <main>
      <h1>Edit Article: {detail.metadata.title}</h1>
      <EditArticleForm
        metadata={detail.metadata}
        content={detail.content}
        action={handleSave}
        articles={articles}
        candidates={taxonomies}
      />
    </main>
  );
}
