import { Calendar, Folder, RotateCcw, Eye } from "lucide-react";
import { formatDate } from "@/app/lib/article-utils";
import type { ArticleMetadata } from "@/app/lib/article-types";

type ArticleMetaProps = {
  metadata: ArticleMetadata;
  className?: string;
};

/**
 * A reusable component to display article metadata (dates, category, views).
 */
export function ArticleMeta({ metadata, className = "" }: ArticleMetaProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted ${className}`}
    >
      <div className="flex items-center" title="Created At">
        <Calendar className="size-3.5 mr-1.5" />
        <span>{formatDate(metadata.createdAt)}</span>
      </div>
      <div className="flex items-center" title="Modified At">
        <RotateCcw className="size-3.5 mr-1.5" />
        <span>{formatDate(metadata.modifiedAt)}</span>
      </div>

      <div className="flex items-center" title="View Count">
        <Eye className="size-3.5 mr-1.5" />
        <span>{metadata.viewCount.toLocaleString()} views</span>
      </div>

      <span className="size-1 rounded-full bg-gray-300" aria-hidden="true" />
      <div className="flex items-center">
        <Folder className="size-3.5 mr-1.5" />
        <span>{metadata.category}</span>
      </div>
    </div>
  );
}
