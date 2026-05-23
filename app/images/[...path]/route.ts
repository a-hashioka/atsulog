import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Route handler to serve images stored in the data directory.
 * URL pattern: /images/[dateDir]/[filename]
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path;

  if (!pathParts || pathParts.length < 2) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const [dateDir, filename] = pathParts;
  const filePath = join(process.cwd(), "data", "images", dateDir, filename);

  try {
    const buffer = await readFile(filePath);

    // Determine content type based on extension
    const ext = filename.split(".").pop()?.toLowerCase();
    let contentType = "image/png";
    if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    if (ext === "gif") contentType = "image/gif";
    if (ext === "webp") contentType = "image/webp";
    if (ext === "svg") contentType = "image/svg+xml";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image Not Found", { status: 404 });
  }
}
