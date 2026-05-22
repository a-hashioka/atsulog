import { useState, useCallback, useEffect } from "react";
import { FormField } from "./form-field";

const SEARCH_FIELDS = [
  { name: "keyword", placeholder: "Search articles..." },
  { name: "category", placeholder: "e.g. Computer Science" },
  { name: "series", placeholder: "e.g. My Dev" },
] as const;

type SearchFieldsProps = {
  searchParams: Record<string, string | string[] | undefined>;
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
  const getFirstValue = (val: string | string[] | undefined) => {
    if (Array.isArray(val)) return val[0] ?? "";
    return val ?? "";
  };

  const initialTagValue = getFirstValue(searchParams.tag);
  const [tagValue, setTagValue] = useState(initialTagValue);
  const [tagCandidates, setTagCandidates] = useState<string[]>(
    candidates?.tags ?? [],
  );

  // Synchronize state with searchParams if they change (e.g. Clear button)
  useEffect(() => {
    setTagValue(initialTagValue);
  }, [initialTagValue]);

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTagValue(value);

      if (!candidates?.tags) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

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
    <>
      <FormField
        id="keyword"
        defaultValue={getFirstValue(searchParams.keyword)}
        placeholder="Search articles..."
        required={false}
      />
      <FormField
        id="category"
        defaultValue={getFirstValue(searchParams.category)}
        placeholder="e.g. Computer Science"
        candidates={candidates?.category}
        required={false}
      />
      <FormField
        id="series"
        defaultValue={getFirstValue(searchParams.series)}
        placeholder="e.g. My Dev"
        candidates={candidates?.series}
        required={false}
      />
      <FormField
        id="tag"
        value={tagValue}
        onChange={handleTagsChange}
        candidates={tagCandidates}
        placeholder="tag1, tag2, ..."
        required={false}
      />
    </>
  );
}
