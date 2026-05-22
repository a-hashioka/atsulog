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
    tag?: string[];
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
    candidates?.tag ?? [],
  );

  // Synchronize state with searchParams if they change (e.g. Clear button)
  useEffect(() => {
    setTagValue(initialTagValue);
  }, [initialTagValue]);

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTagValue(value);

      if (!candidates?.tag) return;

      const lastCommaIndex = value.lastIndexOf(",");
      const prefix = value.substring(0, lastCommaIndex + 1);
      const lastPart = value.substring(lastCommaIndex + 1).trim();

      const filtered = candidates.tag.filter((c) =>
        c.toLowerCase().includes(lastPart.toLowerCase()),
      );

      setTagCandidates(
        filtered.map((c) => `${prefix}${prefix ? " " : ""}${c}`),
      );
    },
    [candidates?.tag],
  );

  return (
    <>
      {SEARCH_FIELDS.map(({ name, placeholder }) => (
        <FormField
          key={name}
          id={name}
          defaultValue={getFirstValue(searchParams[name])}
          placeholder={placeholder}
          candidates={candidates?.[name as keyof typeof candidates]}
          required={false}
        />
      ))}{" "}
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
