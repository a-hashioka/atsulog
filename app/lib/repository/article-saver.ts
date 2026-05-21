import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ArticleMetadata } from "@/app/lib/article-types";

import { ARTICLES_JSON_PATH } from "./article-common";

// --- Exported Functions ---

/**
 * Updates an article's metadata and optionally its markdown content.
 * @param articles - The current array of article metadata.
 * @param newArticle - The article metadata to update.
 * @param content - Optional markdown content to save.
 */
export async function saveArticleDetail(
  articles: ArticleMetadata[],
  newArticle: ArticleMetadata,
  content?: string,
): Promise<void> {
  const tasks: Promise<void>[] = [saveArticleMetadata(articles, newArticle)];

  if (content !== undefined) {
    tasks.push(saveArticleContent(newArticle.filePath, content));
  }

  await Promise.all(tasks);
}

// --- Helper Functions ---

/**
 * Updates an article's metadata in the list and saves to data/articles.json.
 * If the article exists in the provided list, it updates it; otherwise, it appends it.
 * @param articles - The current array of article metadata.
 * @param newArticle - The article metadata to add or update.
 */
async function saveArticleMetadata(
  articles: ArticleMetadata[],
  newArticle: ArticleMetadata,
): Promise<void> {
  const index = articles.findIndex(
    (article) => article.slug === newArticle.slug,
  );
  const newMetadataList = [...articles];

  if (index !== -1) {
    newMetadataList[index] = newArticle;
  } else {
    newMetadataList.push(newArticle);
  }

  try {
    await mkdir(path.dirname(ARTICLES_JSON_PATH), { recursive: true });

    // Format and save JSON with 2-space indentation
    const content = JSON.stringify(newMetadataList, null, 2);
    await writeFile(ARTICLES_JSON_PATH, `${content}\n`, "utf8");
  } catch (error: unknown) {
    throw new Error(
      `Failed to save article metadata to ${ARTICLES_JSON_PATH}`,
      {
        cause: error,
      },
    );
  }
}

/**
 * Saves markdown article content to a project-relative path.
 * @param filePath - The project-relative path to the markdown file.
 * @param content - The raw markdown content string to save.
 */
async function saveArticleContent(
  filePath: string,
  content: string,
): Promise<void> {
  const fullPath = path.resolve(process.cwd(), filePath);

  try {
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, "utf8");
  } catch (error: unknown) {
    throw new Error(`Failed to save article content to ${fullPath}`, {
      cause: error,
    });
  }
}
