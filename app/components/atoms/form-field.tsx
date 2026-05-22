/**
 * Props for a single form field.
 */
export type FormFieldProps = {
  id: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
  required?: boolean;
  placeholder?: string;
  candidates?: string[];
};

/**
 * A reusable input field with a label derived from its id.
 * Supports optional autocomplete candidates via datalist.
 * @param props - Component props.
 * @returns The form field element.
 */
export function FormField({
  id,
  name,
  defaultValue,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
  candidates,
}: FormFieldProps) {
  const displayLabel = id.charAt(0).toUpperCase() + id.slice(1);
  const fieldName = name ?? id;
  const listId = `${id}-list`;

  return (
    <div>
      <label htmlFor={id}>{displayLabel}:</label>
      <input
        type={type}
        id={id}
        name={fieldName}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        list={candidates ? listId : undefined}
        autoComplete={candidates ? "off" : undefined}
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
