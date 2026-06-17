"use server";

import { writeFile, mkdir, access } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";
import { isAuthenticated } from "@/app/lib/auth";
import { formatDateCompact } from "./article-utils";

/**
 * Handles image upload from the Markdown editor.
 * Saves to data/images/YYYYMMDD/ with duplicate handling and optimization.
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

  // 2. Optimize image if it's a standard raster format
  const { name, ext: originalExt } = parse(file.name);
  let finalBuffer: Uint8Array = buffer;
  let finalExt = originalExt;

  // We optimize most images to WebP, but skip SVGs to keep them as vectors
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    try {
      finalBuffer = await sharp(buffer)
        .resize(1200, undefined, {
          withoutEnlargement: true,
          fit: "inside",
        })
        .webp({ quality: 80 })
        .toBuffer();
      finalExt = ".webp";
    } catch (error) {
      console.error("Image optimization failed, using original file:", error);
      // Fallback to original buffer if optimization fails
    }
  }

  // 3. Handle duplicate names
  let finalFileName = `${name}${finalExt}`;
  let counter = 1;

  while (true) {
    const filePath = join(uploadDir, finalFileName);
    try {
      await access(filePath);
      // If no error, file exists
      finalFileName = `${name}(${counter})${finalExt}`;
      counter++;
    } catch {
      // File does not exist, safe to use
      break;
    }
  }

  const finalPath = join(uploadDir, finalFileName);
  await writeFile(finalPath, finalBuffer);

  // 4. Return the URL path
  return {
    url: `/images/${dateDir}/${finalFileName}`,
    name: finalFileName,
  };
}
