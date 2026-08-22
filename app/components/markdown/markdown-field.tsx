"use client";

import {
  MarkdownToolbar,
  ModeToggle,
} from "@/app/components/markdown/markdown-toolbar";
import { MarkdownRenderer } from "@/app/components/markdown/markdown-renderer";
import { useMarkdownField } from "@/app/lib/use-markdown-field";

// --- Types ---

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
 * A composite component that provides a Markdown editor with a live preview toggle and toolbar.
 * The editing behaviour lives in useMarkdownField; this assembles the pieces.
 * @param props - Component props.
 * @returns The Markdown field component.
 */
export function MarkdownField({
  value,
  onChange,
  label = "Content (Markdown)",
  rows = 20,
}: MarkdownFieldProps) {
  const { states, handlers, textareaRef, fileInputRef, markdownInputRef } =
    useMarkdownField({ value, onChange });

  return (
    <div className="flex flex-col space-y-[1rem]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-[0.5rem]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
        <ModeToggle mode={states.mode} onToggle={handlers.setMode} />
      </div>

      {states.mode === "edit" && (
        <div className="flex flex-col space-y-[0.5rem] animate-fade-in">
          <MarkdownToolbar
            onAction={handlers.insertMarkdown}
            onUploadClick={handlers.openImagePicker}
            onMarkdownUploadClick={handlers.openMarkdownPicker}
            isUploading={states.isUploading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlers.onFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={markdownInputRef}
            onChange={handlers.onMarkdownFileChange}
            accept=".md,.markdown,text/markdown,text/plain"
            className="hidden"
          />
        </div>
      )}

      <div
        className="w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handlers.onDrop}
      >
        {states.mode === "edit" ? (
          <Editor
            textareaRef={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handlers.handleKeyDown}
            rows={rows}
          />
        ) : (
          <Preview content={value} />
        )}
      </div>
    </div>
  );
}

// --- Internal Sub-components ---

/**
 * The actual textarea for editing Markdown.
 */
function Editor({
  textareaRef,
  value,
  onChange,
  onKeyDown,
  rows,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  rows: number;
}) {
  return (
    <textarea
      id="content"
      name="content"
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      required
      rows={rows}
      className="w-full p-[1rem] bg-gray-50/50 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition-all overflow-hidden"
    />
  );
}

/**
 * The preview display for rendered Markdown.
 */
function Preview({ content }: { content: string }) {
  return (
    <div className="p-[1rem] bg-white">
      <MarkdownRenderer content={content} />
      {/* Hidden textarea to ensure the form still submits the content even in preview mode */}
      <textarea name="content" value={content} readOnly hidden />
    </div>
  );
}
