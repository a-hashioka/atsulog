import { notFound, redirect } from "next/navigation";

import {
  loadArticleDetail,
  loadArticleMetadata,
} from "@/app/lib/repository/article-loader";
import { saveArticleDetail } from "@/app/lib/repository/article-saver";
import { EditArticleForm } from "@/app/components/organisms/edit-article-form";
import { extractArticleCandidates } from "@/app/lib/article-display";

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
  const articles = await loadArticleMetadata();
  const detail = await loadArticleDetail(articles, slug);

  if (!detail) {
    notFound();
  }

  const candidates = extractArticleCandidates(articles);

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
    await saveArticleDetail(
      await loadArticleMetadata(),
      updatedMetadata,
      raw.content,
    );

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
        candidates={candidates}
      />
    </main>
  );
}
