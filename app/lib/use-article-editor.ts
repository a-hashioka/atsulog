import { useState, useCallback } from "react";
import type { ArticleMetadata } from "@/app/lib/article-types";
import { useNavigationGuard } from "./use-navigation-guard";

/**
 * Hook to manage the state and logic for the article editor.
 */
export function useArticleEditor({
  metadata,
  initialContent,
  action,
  articles,
  candidates,
}: {
  metadata: ArticleMetadata;
  initialContent: string;
  action: (formData: FormData) => Promise<void>;
  articles: ArticleMetadata[];
  candidates?: {
    tags?: string[];
    category?: string[];
    series?: string[];
  };
}) {
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [title, setTitle] = useState(metadata.title);
  const [series, setSeries] = useState(metadata.series ?? "");
  const [category, setCategory] = useState(metadata.category);
  const [tags, setTags] = useState(metadata.tags.join(", "));
  const [tagCandidates, setTagCandidates] = useState<string[]>(
    candidates?.tags ?? [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the form is "dirty" (has unsaved changes)
  const isDirty =
    (currentContent !== initialContent ||
      title !== metadata.title ||
      series !== (metadata.series ?? "") ||
      category !== metadata.category ||
      tags !== metadata.tags.join(", ")) &&
    !isSubmitting;

  // Use the navigation guard hook
  useNavigationGuard(isDirty);

  const handleSubmitAction = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await action(formData);
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  const handleSeriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSeries = e.target.value;
      setSeries(newSeries);

      if (newSeries.trim() === "") return;

      const seriesArticles = articles
        .filter((a) => a.series === newSeries)
        .sort((a, b) => (b.seriesOrder ?? 0) - (a.seriesOrder ?? 0));

      const previousArticle = seriesArticles[0];
      const isTitleEmpty = title.trim() === "";
      const isTitleSeriesPattern = /#\d{3}$/.test(title);

      if (isTitleEmpty || isTitleSeriesPattern) {
        const nextOrder = previousArticle
          ? (previousArticle.seriesOrder ?? 0) + 1
          : 0;
        const formattedOrder = String(nextOrder).padStart(3, "0");
        setTitle(`${newSeries}#${formattedOrder}`);
      }

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

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTags(value);

      const tagsList = candidates?.tags;
      if (!tagsList) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

      const filtered = tagsList.filter((c) =>
        c.toLowerCase().includes(lastPart.toLowerCase()),
      );

      setTagCandidates(
        filtered.map((c) => `${prefix}${prefix ? " " : ""}${c}`),
      );
    },
    [candidates?.tags],
  );

  return {
    states: {
      currentContent,
      title,
      series,
      category,
      tags,
      tagCandidates,
      isSubmitting,
    },
    setters: {
      setCurrentContent,
      setTitle,
      setCategory,
    },
    handlers: {
      handleSeriesChange,
      handleTagsChange,
      handleSubmitAction,
    },
  };
}
