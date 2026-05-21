"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

// --- Types ---

/**
 * Valid modes for the editor.
 */
type EditMode = "edit" | "preview";

/**
 * Props for the MarkdownField component.
 */
export type MarkdownFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  rows?: number;
};

// --- Main Component ---

/**
 * A composite component that provides a Markdown editor with a live preview toggle.
 * Handles its own edit/preview mode state.
 * @param props - Component props.
 * @returns The Markdown field component.
 */
export function MarkdownField({
  value,
  onChange,
  label = "Content (Markdown)",
  rows = 20,
}: MarkdownFieldProps) {
  const [mode, setMode] = useState<EditMode>("edit");

  return (
    <>
      <div>
        <ModeToggle mode={mode} onToggle={setMode} />
      </div>

      {mode === "edit" ? (
        <Editor value={value} onChange={onChange} label={label} rows={rows} />
      ) : (
        <Preview content={value} />
      )}
    </>
  );
}

// --- Internal Sub-components ---

/**
 * A toggle button to switch between Edit and Preview modes.
 */
function ModeToggle({
  mode,
  onToggle,
}: {
  mode: EditMode;
  onToggle: (mode: EditMode) => void;
}) {
  const isEdit = mode === "edit";

  return (
    <button type="button" onClick={() => onToggle(isEdit ? "preview" : "edit")}>
      {isEdit ? "Preview" : "Edit"}
    </button>
  );
}

/**
 * The actual textarea for editing Markdown.
 */
function Editor({
  value,
  onChange,
  label,
  rows,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  rows: number;
}) {
  return (
    <>
      <label htmlFor="content">{label}</label>
      <br />
      <textarea
        id="content"
        name="content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        rows={rows}
      />
    </>
  );
}

/**
 * The preview display for rendered Markdown.
 */
function Preview({ content }: { content: string }) {
  return (
    <>
      <ReactMarkdown>{content}</ReactMarkdown>
      {/* Hidden textarea to ensure the form still submits the content even in preview mode */}
      <textarea name="content" value={content} readOnly hidden />
    </>
  );
}
