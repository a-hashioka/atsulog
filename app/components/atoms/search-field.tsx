type SearchFieldProps = {
  name: string;
  defaultValue: string;
  placeholder?: string;
  candidates?: string[];
};

/**
 * A reusable search input field with a label and optional autocomplete candidates.
 */
function SearchField({
  name,
  defaultValue,
  placeholder,
  candidates,
}: SearchFieldProps) {
  const listId = `${name}-list`;

  return (
    <div>
      <label htmlFor={name}>
        {name.charAt(0).toUpperCase() + name.slice(1)}:
      </label>
      <input
        type="text"
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        list={candidates ? listId : undefined}
        autoComplete="off"
      />
      {candidates && candidates.length > 0 && (
        <datalist id={listId}>
          {candidates.map((candidate) => (
            <option key={candidate} value={candidate} />
          ))}
        </datalist>
      )}
    </div>
  );
}

const SEARCH_FIELDS = [
  { name: "keyword", placeholder: "Search articles..." },
  { name: "tag", placeholder: "e.g. Linux" },
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

  return (
    <>
      {SEARCH_FIELDS.map(({ name, placeholder }) => (
        <SearchField
          key={name}
          name={name}
          defaultValue={getFirstValue(searchParams[name])}
          placeholder={placeholder}
          candidates={candidates?.[name as keyof typeof candidates]}
        />
      ))}
    </>
  );
}
