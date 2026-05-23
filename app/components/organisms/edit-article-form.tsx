"use client";

import { useState, useCallback } from "react";
import { Save, BookOpen, Type, Folder, Tag } from "lucide-react";
import type { ArticleMetadata } from "@/app/lib/article-types";
import { FormField } from "@/app/components/atoms/form-field";
import { MarkdownField } from "@/app/components/atoms/markdown-field";
import { Button } from "@/app/components/atoms/button";

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
  const [category, setCategory] = useState(metadata.category);
  const [tags, setTags] = useState(metadata.tags.join(", "));
  const [tagCandidates, setTagCandidates] = useState<string[]>(
    candidates?.tags ?? [],
  );

  const handleSeriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSeries = e.target.value;
      setSeries(newSeries);

      if (newSeries.trim() === "") return;

      // Find the latest article in this series to inherit metadata
      const seriesArticles = articles
        .filter((a) => a.series === newSeries)
        .sort((a, b) => (b.seriesOrder ?? 0) - (a.seriesOrder ?? 0));

      const previousArticle = seriesArticles[0];

      // Auto-generate title if it's currently empty or already looks like a series title
      const isTitleEmpty = title.trim() === "";
      const isTitleSeriesPattern = /#\d{3}$/.test(title);

      if (isTitleEmpty || isTitleSeriesPattern) {
        const nextOrder = previousArticle
          ? (previousArticle.seriesOrder ?? 0) + 1
          : 0;
        const formattedOrder = String(nextOrder).padStart(3, "0");
        setTitle(`${newSeries}#${formattedOrder}`);
      }

      // Inherit category and tags if they are currently default/empty
      if (previousArticle) {
        if (category === "" || category === "General") {
          setCategory(previousArticle.category);
        }
        if (tags.trim() === "") {
          setTags(previousArticle.tags.join(", "));
        }
      }
    },
    [title, articles, category, tags],
  );

  const tagsList = candidates?.tags;

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTags(value);

      if (!tagsList) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

      // Filter and then map with prefix so the browser's datalist matches the full input
      const filtered = tagsList.filter((c) =>
        c.toLowerCase().includes(lastPart.toLowerCase()),
      );

      setTagCandidates(
        filtered.map((c) => `${prefix}${prefix ? " " : ""}${c}`),
      );
    },
    [tagsList],
  );

  return (
    <form action={action} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="series"
          value={series}
          onChange={handleSeriesChange}
          required={false}
          candidates={candidates?.series}
          placeholder="Optional series name"
          icon={BookOpen}
        />
        <FormField
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          icon={Type}
        />
        <FormField
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          candidates={candidates?.category}
          placeholder="e.g. Technology"
          icon={Folder}
        />
        <FormField
          id="tags"
          name="tags"
          value={tags}
          onChange={handleTagsChange}
          required={false}
          candidates={tagCandidates}
          placeholder="tag1, tag2, ..."
          icon={Tag}
        />
      </div>

      <MarkdownField value={currentContent} onChange={setCurrentContent} />

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button
          type="submit"
          icon={Save}
          variant="primary"
          className="px-10 py-3"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
