import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ArticleMetadata } from "@/app/lib/article-types";

import { ARTICLES_JSON_PATH, PROJECT_ROOT } from "./article-common";

// --- Types ---

export type ArticleDetail = {
  metadata: ArticleMetadata;
  content: string;
};

// --- Exported Functions ---

/**
 * Loads article metadata from data/articles.json.
 * @returns A promise that resolves to an array of article metadata. Returns an empty array if the file does not exist.
 */
export async function loadArticleMetadata(): Promise<ArticleMetadata[]> {
  try {
    const content = await readFile(ARTICLES_JSON_PATH, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      throw new TypeError("data/articles.json must contain an array.");
    }

    return parsed as ArticleMetadata[];
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in ${ARTICLES_JSON_PATH}`, {
        cause: error,
      });
    }

    throw new Error(
      `Failed to read article metadata from ${ARTICLES_JSON_PATH}`,
      {
        cause: error,
      },
    );
  }
}

/**
 * Loads both metadata and markdown content for the requested slug.
 * @param articles - The full array of article metadata to search within.
 * @param slug - The unique slug of the article to load.
 * @returns A promise that resolves to the article detail (metadata and content) or null if not found.
 */
export async function loadArticleDetail(
  articles: ArticleMetadata[],
  slug: string,
): Promise<ArticleDetail | null> {
  const metadata = articles.find((article) => article.slug === slug) ?? null;

  if (!metadata) {
    return null;
  }

  const content = await readArticleContent(metadata.filePath);
  return { metadata, content };
}

// --- Helper Functions ---

/**
 * Resolves an input path to an absolute path under the project root.
 * @param filePath - The project-relative path to resolve.
 * @returns The absolute path to the file.
 */
function resolveProjectPath(filePath: string): string {
  const resolvedPath = path.resolve(PROJECT_ROOT, filePath);
  const relativePath = path.relative(PROJECT_ROOT, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new TypeError("Path must point to a file inside the project.");
  }

  return resolvedPath;
}

/**
 * Reads markdown article content from a project-relative path.
 * @param filePath - The project-relative path to the markdown file.
 * @returns A promise that resolves to the raw markdown content string.
 */
async function readArticleContent(filePath: string): Promise<string> {
  const fullPath = resolveProjectPath(filePath);

  if (path.extname(fullPath) !== ".md") {
    throw new TypeError("Path must point to a markdown (.md) file.");
  }

  try {
    return await readFile(fullPath, "utf8");
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new Error(`Article content file not found: ${fullPath}`, {
        cause: error,
      });
    }

    throw new Error(`Failed to read article content from ${fullPath}`, {
      cause: error,
    });
  }
}
