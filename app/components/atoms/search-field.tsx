import { useState, useCallback } from "react";
import { Search, Folder, BookOpen, Tag } from "lucide-react";
import { FormField } from "./form-field";
import type { ArticleSearchParams } from "@/app/lib/article-types";
import { getParam } from "@/app/lib/article-utils";

type SearchFieldsProps = {
  searchParams: ArticleSearchParams;
  candidates?: {
    tags?: string[];
    category?: string[];
    series?: string[];
  };
};

/**
 * Renders the full set of search fields as a block.
 */
export function SearchFields({ searchParams, candidates }: SearchFieldsProps) {
  const initialTagValue = getParam(searchParams.tag);
  const [tagValue, setTagValue] = useState(initialTagValue);
  const [tagCandidates, setTagCandidates] = useState<string[]>(
    candidates?.tags ?? [],
  );

  const tags = candidates?.tags;

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTagValue(value);

      if (!tags) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

      const filtered = tags.filter((c) =>
        c.toLowerCase().includes(lastPart.toLowerCase()),
      );

      setTagCandidates(
        filtered.map((c) => `${prefix}${prefix ? " " : ""}${c}`),
      );
    },
    [tags],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <FormField
        id="keyword"
        defaultValue={getParam(searchParams.keyword)}
        placeholder="Search articles..."
        required={false}
        icon={Search}
      />
      <FormField
        id="category"
        defaultValue={getParam(searchParams.category)}
        placeholder="e.g. Computer Science"
        candidates={candidates?.category}
        required={false}
        icon={Folder}
      />
      <FormField
        id="series"
        defaultValue={getParam(searchParams.series)}
        placeholder="e.g. My Dev"
        candidates={candidates?.series}
        required={false}
        icon={BookOpen}
      />
      <FormField
        id="tag"
        value={tagValue}
        onChange={handleTagsChange}
        candidates={tagCandidates}
        placeholder="tag1, tag2, ..."
        required={false}
        icon={Tag}
      />
    </div>
  );
}
