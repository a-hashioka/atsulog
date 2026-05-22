/**
 * Props for a single form field.
 */
export type FormFieldProps = {
  id: string;
  defaultValue: string;
  type?: "text" | "password";
  required?: boolean;
};

/**
 * A reusable input field with a label derived from its id.
 * Defaults to being a required field.
 * @param props - Component props.
 * @returns The form field element.
 */
export function FormField({
  id,
  defaultValue,
  type = "text",
  required = true,
}: FormFieldProps) {
  const displayLabel = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <>
      <label htmlFor={id}>{displayLabel}:</label>
      <input
        type={type}
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
      />
      <br />
    </>
  );
}
