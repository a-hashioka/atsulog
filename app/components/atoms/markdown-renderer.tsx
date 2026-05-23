import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

/**
 * A safe and flexible Markdown renderer using react-markdown and remark-gfm.
 * Uses a custom .prose-atsulog class for high-fidelity styling control.
 */
export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose-atsulog ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
