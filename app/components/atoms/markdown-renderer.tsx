import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

/**
 * A safe and flexible Markdown renderer using react-markdown and remark-gfm.
 * Uses a custom .prose-site class for high-fidelity styling control.
 */
export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose-site ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => {
            const { src, alt } = props;
            if (!src || typeof src !== "string") return null;

            // Check if the image is internal (served via /images/...)
            const isInternal = src.startsWith("/images/");

            return (
              <span className="block my-8 overflow-hidden rounded-xl border border-gray-100">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={1200}
                  height={800}
                  // For internal images, we want Next.js to optimize them.
                  // For external images, we still use Image but might need remote patterns in next.config.ts.
                  unoptimized={!isInternal && !src.startsWith("/")}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
