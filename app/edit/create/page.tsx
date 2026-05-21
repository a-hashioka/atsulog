import { redirect } from "next/navigation";
import { EditArticleForm } from "@/app/components/organisms/edit-article-form";
import { loadArticleMetadata } from "@/app/lib/repository/article-loader";
import { saveArticleDetail } from "@/app/lib/repository/article-saver";
import type { ArticleMetadata } from "@/app/lib/article-types";

/**
 * Page for creating a new article.
 * @returns The new article page component.
 */
export default async function NewArticlePage() {
  /**
   * Initial metadata for a brand new article.
   * slug is empty as it will be generated upon submission.
   */
  const initialMetadata: ArticleMetadata = {
    slug: "",
    title: "",
    category: "",
    series: null,
    tags: [],
    filePath: "",
    createdAt: "",
    modifiedAt: "",
    viewCount: 0,
  };

  /**
   * Server Action to handle the creation of a new article.
   * Generates a timestamp-based slug (YYYYMMDDHHMMSS) and saves the article.
   * @param formData - The submitted form data.
   */
  async function handleCreate(formData: FormData) {
    "use server";

    const raw = Object.fromEntries(formData) as Record<string, string>;
    const now = new Date();
    const isoString = now.toISOString();

    // Generate a timestamp-based slug (YYYYMMDDHHMMSS)
    // Example: 20231027153045
    const slug =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");

    const newMetadata: ArticleMetadata = {
      slug,
      title: raw.title,
      category: raw.category,
      series: raw.series.trim() || null,
      tags: raw.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      filePath: `data/articles/${slug}.md`,
      createdAt: isoString,
      modifiedAt: isoString,
      viewCount: 0,
    };

    const currentArticles = await loadArticleMetadata();
    await saveArticleDetail(currentArticles, newMetadata, raw.content);

    redirect(`/articles/${slug}`);
  }

  return (
    <main>
      <h1>Create New Article</h1>
      <EditArticleForm
        metadata={initialMetadata}
        content=""
        action={handleCreate}
      />
    </main>
  );
}
