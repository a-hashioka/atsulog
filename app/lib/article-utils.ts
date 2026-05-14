import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

export type ArticleMetadata = {
  slug: string;
  title: string;
  filePath: string;
  createdAt: string;
  modifiedAt: string;
  tags: string[];
  series: string | null;
  category: string;
  viewCount: number;
};

const ARTICLES_JSON_PATH = path.join(process.cwd(), "data", "articles.json");
const PROJECT_ROOT = process.cwd();

/**
 * Resolves an input path to an absolute path under the project root.
 * Throws when the resolved target points outside of the project directory.
 * @param filePath Project-relative path from metadata (for example: "posts/hello.md").
 * @returns Absolute path that is guaranteed to stay inside PROJECT_ROOT.
 */
function resolveProjectPath(filePath: string): string {
  // Normalize user input to an absolute path rooted at the project.
  const resolvedPath = path.resolve(PROJECT_ROOT, filePath);
  // Re-express it from PROJECT_ROOT to detect path traversal/out-of-root access.
  const relativePath = path.relative(PROJECT_ROOT, resolvedPath);

  // Error if the resolved path is outside the project directory or if it is absolute.
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new TypeError("Path must point to a file inside the project.");
  }

  return resolvedPath;
}

/**
 * Loads article metadata from data/articles.json.
 * The JSON root must be an array.
 * @returns Parsed metadata array from data/articles.json.
 */
export async function loadArticleMetadata(): Promise<ArticleMetadata[]> {
  const content = await readFile(ARTICLES_JSON_PATH, "utf8");
  // Parse as unknown first, then validate structure before casting.
  const parsed = JSON.parse(content) as unknown;

  if (!Array.isArray(parsed)) {
    throw new TypeError("data/articles.json must contain an array.");
  }

  return parsed as ArticleMetadata[];
}

/**
 * Loads markdown article content from a project-relative path.
 * Only .md files are accepted.
 * @param filePath Project-relative markdown file path.
 * @returns UTF-8 text content of the markdown file.
 */
export async function loadArticleContent(filePath: string): Promise<string> {
  const fullPath = resolveProjectPath(filePath);

  if (path.extname(fullPath) !== ".md") {
    throw new TypeError("Path must point to a markdown (.md) file.");
  }

  return readFile(fullPath, "utf8");
}
