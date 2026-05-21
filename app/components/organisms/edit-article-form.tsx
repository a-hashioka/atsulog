"use client";

import { useState } from "react";
import type { ArticleMetadata } from "@/app/lib/article-types";
import { FormField } from "@/app/components/atoms/form-field";
import { MarkdownField } from "@/app/components/atoms/markdown-field";

// --- Types ---

/**
 * Props for the EditArticleForm component.
 */
type EditArticleFormProps = {
  metadata: ArticleMetadata;
  content: string;
  action: (formData: FormData) => Promise<void>;
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
}: EditArticleFormProps) {
  const [currentContent, setCurrentContent] = useState(initialContent);

  return (
    <form action={action}>
      <FormField id="title" defaultValue={metadata.title} />
      <FormField id="category" defaultValue={metadata.category} />
      <FormField
        id="series"
        defaultValue={metadata.series ?? ""}
        required={false}
      />
      <FormField
        id="tags"
        defaultValue={metadata.tags.join(", ")}
        required={false}
      />

      <MarkdownField value={currentContent} onChange={setCurrentContent} />

      <div>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
}
