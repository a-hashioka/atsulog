"use server";

import { writeFile, mkdir, access } from "node:fs/promises";
import { join, parse } from "node:path";
import { isAuthenticated } from "@/app/lib/auth";
import { formatDateCompact } from "./article-utils";

/**
 * Handles image upload from the Markdown editor.
 * Saves to data/images/YYYYMMDD/ with duplicate handling.
 * @param formData - The form data containing the 'image' file.
 * @returns An object with the final image URL or an error message.
 */
export async function uploadImageAction(formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("image") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 1. Prepare directory: data/images/YYYYMMDD
  const dateDir = formatDateCompact(new Date());
  const uploadDir = join(process.cwd(), "data", "images", dateDir);

  try {
    await mkdir(uploadDir, { recursive: true });
  } catch {
    // Already exists or other error
  }

  // 2. Handle duplicate names
  const { name, ext } = parse(file.name);
  let finalFileName = file.name;
  let counter = 1;

  while (true) {
    const filePath = join(uploadDir, finalFileName);
    try {
      await access(filePath);
      // If no error, file exists
      finalFileName = `${name}(${counter})${ext}`;
      counter++;
    } catch {
      // File does not exist, safe to use
      break;
    }
  }

  const finalPath = join(uploadDir, finalFileName);
  await writeFile(finalPath, buffer);

  // 3. Return the URL path
  return {
    url: `/images/${dateDir}/${finalFileName}`,
    name: finalFileName,
  };
}
