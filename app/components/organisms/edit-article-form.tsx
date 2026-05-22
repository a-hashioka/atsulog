"use client";

import { useState, useCallback } from "react";
import type { ArticleMetadata } from "@/app/lib/article-types";
import { FormField } from "@/app/components/atoms/form-field";
import { MarkdownField } from "@/app/components/atoms/markdown-field";
import { getNextSeriesOrder } from "@/app/lib/article-utils";

// --- Types ---

/**
 * Props for the EditArticleForm component.
 */
type EditArticleFormProps = {
  metadata: ArticleMetadata;
  content: string;
  action: (formData: FormData) => Promise<void>;
  articles: ArticleMetadata[];
  candidates?: {
    tags?: string[];
    category?: string[];
    series?: string[];
  };
};

// --- Main Component ---

/**
 * Form component for editing article details with preview support.
 * @param props - Component props.
 * @returns The form element.
 */
export function EditArticleForm({
  metadata,
  content: initialContent,
  action,
  articles,
  candidates,
}: EditArticleFormProps) {
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [title, setTitle] = useState(metadata.title);
  const [series, setSeries] = useState(metadata.series ?? "");
  const [tags, setTags] = useState(metadata.tags.join(", "));
  const [tagCandidates, setTagCandidates] = useState<string[]>(
    candidates?.tags ?? [],
  );

  const handleSeriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSeries = e.target.value;
      setSeries(newSeries);

      // Only auto-generate title if it's currently empty or already looks like a series title
      const isTitleEmpty = title.trim() === "";
      const isTitleSeriesPattern = /#\d{3}$/.test(title);

      if (newSeries.trim() !== "" && (isTitleEmpty || isTitleSeriesPattern)) {
        const nextOrder = getNextSeriesOrder(newSeries, articles);
        const formattedOrder = String(nextOrder).padStart(3, "0");
        setTitle(`${newSeries}#${formattedOrder}`);
      }
    },
    [title, articles],
  );

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTags(value);

      if (!candidates?.tags) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

      // Filter and then map with prefix so the browser's datalist matches the full input
      const filtered = candidates.tags.filter((c) =>
        c.toLowerCase().includes(lastPart.toLowerCase()),
      );

      setTagCandidates(
        filtered.map((c) => `${prefix}${prefix ? " " : ""}${c}`),
      );
    },
    [candidates?.tags],
  );

  return (
    <form action={action}>
      <FormField
        id="series"
        value={series}
        onChange={handleSeriesChange}
        required={false}
        candidates={candidates?.series}
      />
      <FormField
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormField
        id="category"
        defaultValue={metadata.category}
        candidates={candidates?.category}
      />
      <FormField
        id="tags"
        name="tags"
        value={tags}
        onChange={handleTagsChange}
        required={false}
        candidates={tagCandidates}
        placeholder="tag1, tag2, ..."
      />

      <MarkdownField value={currentContent} onChange={setCurrentContent} />

      <div>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
}
