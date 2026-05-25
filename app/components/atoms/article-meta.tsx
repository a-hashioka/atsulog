import { Calendar, RotateCcw, Eye } from "lucide-react";
import { formatDate } from "@/app/lib/article-utils";
import type { ArticleMetadata } from "@/app/lib/article-types";

/**
 * Props for the ArticleMeta component.
 */
type ArticleMetaProps = {
  metadata: ArticleMetadata;
  className?: string;
};

/**
 * A reusable component to display non-linkable article metadata (dates and view counts).
 */
export function ArticleMeta({ metadata, className = "" }: ArticleMetaProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted ${className}`}
    >
      {/* Creation Date */}
      <div className="flex items-center" title="Created At">
        <Calendar className="size-3.5 mr-1.5" aria-hidden="true" />
        <span>{formatDate(metadata.createdAt)}</span>
      </div>

      {/* Modification Date */}
      <div className="flex items-center" title="Modified At">
        <RotateCcw className="size-3.5 mr-1.5" aria-hidden="true" />
        <span>{formatDate(metadata.modifiedAt)}</span>
      </div>

      {/* Total View Count */}
      <div className="flex items-center" title="View Count">
        <Eye className="size-3.5 mr-1.5" aria-hidden="true" />
        <span>{metadata.viewCount.toLocaleString()} views</span>
      </div>
    </div>
  );
}
