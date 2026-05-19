import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ArticleMetadata } from "@/app/lib/article-types";

const ARTICLES_JSON_PATH = path.join(process.cwd(), "data", "articles.json");
const PROJECT_ROOT = process.cwd();

/**
 * Gets article metadata from data/articles.json.
 * @returns Parsed metadata array.
 */
export async function getArticleMetadata(): Promise<ArticleMetadata[]> {
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
      await mkdir(path.dirname(ARTICLES_JSON_PATH), { recursive: true });
      await writeFile(ARTICLES_JSON_PATH, "[]\n", "utf8");
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

// --- Content Loading ---

/**
 * Resolves an input path to an absolute path under the project root.
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

/**
 * Finds article metadata by slug.
 */
function readArticleMetadata(
  articles: ArticleMetadata[],
  slug: string,
): ArticleMetadata | null {
  return articles.find((article) => article.slug === slug) ?? null;
}

export type ArticleDetail = {
  metadata: ArticleMetadata;
  content: string;
};

/**
 * Gets both metadata and markdown content for the requested slug.
 */
export async function getArticleDetail(
  articles: ArticleMetadata[],
  slug: string,
): Promise<ArticleDetail | null> {
  const metadata = readArticleMetadata(articles, slug);

  if (!metadata) {
    return null;
  }

  const content = await readArticleContent(metadata.filePath);
  return { metadata, content };
}
