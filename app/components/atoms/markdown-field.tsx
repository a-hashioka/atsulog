"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Quote,
  Minus,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  FileCode,
  FileText,
  Table,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Eye,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import { uploadImageAction } from "@/app/lib/image-actions";

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
 * A composite component that provides a Markdown editor with a live preview toggle and toolbar.
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
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && mode === "edit") {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, mode]);

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = "", placeholder: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newValue =
        value.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        value.substring(end);

      onChange(newValue);

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus();
        const newStart = start + prefix.length;
        const newEnd = newStart + textToInsert.length;
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    },
    [value, onChange],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);
        const result = await uploadImageAction(formData);
        // Insert as an image link: ![filename](/path/to/image)
        insertMarkdown(`![${result.name}](${result.url})`, "", "");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    },
    [insertMarkdown],
  );

  const handleMarkdownUpload = useCallback(
    (file: File) => {
      const lowerName = file.name.toLowerCase();
      const isMarkdown =
        lowerName.endsWith(".md") ||
        lowerName.endsWith(".markdown") ||
        file.type === "text/markdown" ||
        file.type === "text/plain";

      if (!isMarkdown) {
        alert("Please upload a markdown (.md) file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
          return;
        }

        alert("Failed to read the markdown file.");
      };
      reader.onerror = () => {
        console.error("Failed to read markdown file:", reader.error);
        alert("Failed to read the markdown file.");
      };
      reader.readAsText(file);
    },
    [onChange],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    // Reset input so the same file can be uploaded again if needed
    if (e.target) e.target.value = "";
  };

  const onMarkdownFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMarkdownUpload(file);
    if (e.target) e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd, value: val } = textarea;
      const beforeCursor = val.substring(0, selectionStart);
      const lines = beforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      // Handle Enter key for auto-listing
      if (e.key === "Enter" && !e.shiftKey) {
        const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (listMatch) {
          const [, indent, marker, content] = listMatch;

          if (content.trim() === "") {
            // Empty list item - remove it and end list
            e.preventDefault();
            const startOfLine = selectionStart - currentLine.length;
            const newValue =
              val.substring(0, startOfLine) +
              "\n" +
              val.substring(selectionEnd);
            onChange(newValue);
            setTimeout(() => {
              textarea.setSelectionRange(startOfLine + 1, startOfLine + 1);
            }, 0);
            return;
          }

          // Continue list
          e.preventDefault();
          let nextMarker = marker;
          if (/\d+\./.test(marker)) {
            const num = parseInt(marker);
            nextMarker = `${num + 1}.`;
          } else {
            // Always use "-" for continuation if it was a bullet list
            nextMarker = "-";
          }
          const insertion = `\n${indent}${nextMarker} `;
          const newValue =
            val.substring(0, selectionStart) +
            insertion +
            val.substring(selectionEnd);
          onChange(newValue);
          setTimeout(() => {
            const newPos = selectionStart + insertion.length;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
          return;
        }
      }

      // Handle Tab for indentation
      if (e.key === "Tab") {
        e.preventDefault();
        const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);

        if (listMatch) {
          const [, indent, marker, content] = listMatch;
          const startOfLine = selectionStart - currentLine.length;

          let nextIndent = indent;
          let nextMarker = marker;

          if (e.shiftKey) {
            // Outdent
            if (indent.length >= 2) {
              nextIndent = indent.substring(2);
            }
          } else {
            // Indent
            nextIndent = indent + "  ";
          }

          // If it's a bullet list marker, always use "-"
          if (["-", "*", "+"].includes(marker)) {
            nextMarker = "-";
          }

          const newContent = `${nextIndent}${nextMarker} ${content}`;
          const newValue =
            val.substring(0, startOfLine) +
            newContent +
            val.substring(selectionEnd);
          onChange(newValue);

          setTimeout(() => {
            const newPos = startOfLine + newContent.length;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        } else if (!e.shiftKey) {
          // Just insert 2 spaces if not in a list
          const insertion = "  ";
          const newValue =
            val.substring(0, selectionStart) +
            insertion +
            val.substring(selectionEnd);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(
              selectionStart + insertion.length,
              selectionStart + insertion.length,
            );
          }, 0);
        }
      }
    },
    [onChange],
  );

  return (
    <div className="flex flex-col space-y-[1rem]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-[0.5rem]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
        <ModeToggle mode={mode} onToggle={setMode} />
      </div>

      {mode === "edit" && (
        <div className="flex flex-col space-y-[0.5rem] animate-fade-in">
          <Toolbar
            onAction={insertMarkdown}
            onUploadClick={() => fileInputRef.current?.click()}
            onMarkdownUploadClick={() => markdownInputRef.current?.click()}
            isUploading={isUploading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={markdownInputRef}
            onChange={onMarkdownFileChange}
            accept=".md,.markdown,text/markdown,text/plain"
            className="hidden"
          />
        </div>
      )}

      <div
        className="w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {mode === "edit" ? (
          <Editor
            textareaRef={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
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
 * Toolbar for Markdown syntax helpers.
 */
function Toolbar({
  onAction,
  onUploadClick,
  onMarkdownUploadClick,
  isUploading,
}: {
  onAction: (prefix: string, suffix?: string, placeholder?: string) => void;
  onUploadClick: () => void;
  onMarkdownUploadClick: () => void;
  isUploading: boolean;
}) {
  const groups = [
    {
      items: [
        {
          icon: Bold,
          prefix: "**",
          suffix: "**",
          placeholder: "bold text",
          title: "Bold",
        },
        {
          icon: Italic,
          prefix: "*",
          suffix: "*",
          placeholder: "italic text",
          title: "Italic",
        },
        {
          icon: Strikethrough,
          prefix: "~~",
          suffix: "~~",
          placeholder: "strikethrough",
          title: "Strikethrough",
        },
        {
          icon: Code,
          prefix: "`",
          suffix: "`",
          placeholder: "code",
          title: "Inline Code",
        },
      ],
    },
    {
      items: [
        {
          icon: Heading2,
          prefix: "## ",
          suffix: "",
          placeholder: "Heading",
          title: "Heading",
        },
        {
          icon: Quote,
          prefix: "> ",
          suffix: "",
          placeholder: "quote",
          title: "Quote",
        },
        {
          icon: Minus,
          prefix: "\n---\n",
          suffix: "",
          placeholder: "",
          title: "Horizontal Rule",
        },
      ],
    },
    {
      items: [
        {
          icon: List,
          prefix: "- ",
          suffix: "",
          placeholder: "item",
          title: "Unordered List",
        },
        {
          icon: ListOrdered,
          prefix: "1. ",
          suffix: "",
          placeholder: "item",
          title: "Ordered List",
        },
        {
          icon: CheckSquare,
          prefix: "- [ ] ",
          suffix: "",
          placeholder: "task",
          title: "Task List",
        },
      ],
    },
    {
      items: [
        {
          icon: LinkIcon,
          prefix: "[",
          suffix: "](url)",
          placeholder: "link text",
          title: "Link",
        },
        {
          icon: FileCode,
          prefix: "```\n",
          suffix: "\n```",
          placeholder: "code",
          title: "Code Block",
        },
        {
          icon: Table,
          prefix: "\n| Header | Header |\n| :--- | :--- |\n| ",
          suffix: " | Cell |\n",
          placeholder: "Cell",
          title: "Table",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-[0.25rem] p-[0.25rem] bg-white border border-gray-100 rounded-lg shadow-sm w-fit mx-auto">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="flex items-center">
          {groupIdx > 0 && (
            <div
              className="w-px h-[1rem] bg-gray-200 mx-[0.25rem]"
              aria-hidden="true"
            />
          )}
          <div className="flex items-center gap-[0.125rem]">
            {group.items.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  onAction(item.prefix, item.suffix, item.placeholder)
                }
                className="p-[0.375rem] text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                title={item.title}
              >
                <item.icon className="size-[1rem]" />
              </button>
            ))}
          </div>
        </div>
      ))}
      <div
        className="w-px h-[1rem] bg-gray-200 mx-[0.25rem]"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={onUploadClick}
        disabled={isUploading}
        className="p-[0.375rem] text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        title="Upload Image"
      >
        {isUploading ? (
          <Loader2 className="size-[1rem] animate-spin" />
        ) : (
          <ImageIcon className="size-[1rem]" />
        )}
      </button>
      <button
        type="button"
        onClick={onMarkdownUploadClick}
        className="p-[0.375rem] text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
        title="Load Markdown"
      >
        <FileText className="size-[1rem]" />
      </button>
    </div>
  );
}

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
    <div className="flex bg-gray-100 p-[0.25rem] rounded-lg">
      <button
        type="button"
        onClick={() => onToggle("edit")}
        className={`flex items-center px-[0.75rem] py-[0.25rem] text-xs font-medium rounded-md transition-all ${
          isEdit
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Pencil className="size-[0.75rem] mr-[0.375rem]" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => onToggle("preview")}
        className={`flex items-center px-[0.75rem] py-[0.25rem] text-xs font-medium rounded-md transition-all ${
          !isEdit ? "bg-white text-black shadow-sm" : "text-gray-700"
        }`}
      >
        <Eye className="size-[0.75rem] mr-[0.375rem]" />
        Preview
      </button>
    </div>
  );
}

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
