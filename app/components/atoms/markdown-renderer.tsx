import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";

// Scoped here rather than in globals.css on purpose: Next bundles this stylesheet
// only into the routes that render this component (the article page and /edit),
// so the pages that carry no article body never pay for it. The KaTeX_*.woff2
// files it references are emitted to .next/static/media, which standalone.sh
// already copies.
import "katex/dist/katex.min.css";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

/**
 * A safe and flexible Markdown renderer using react-markdown and remark-gfm.
 * Math is written as `$inline$` and `$$display$$` and typeset with KaTeX.
 * Uses a custom .prose-site class for high-fidelity styling control.
 */
export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose-site ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        // KaTeX must run first: both plugins claim ```math fences, and only
        // this order lets KaTeX replace the <pre> before highlighting rewrites
        // its text into <span>s.
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
