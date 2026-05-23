import Link from "next/link";

type TagProps = {
  label: string;
  href?: string;
  className?: string;
};

/**
 * A reusable tag component for displaying categories or search tags.
 * If an href is provided, it renders as a Link.
 */
export function Tag({ label, href, className = "" }: TagProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100/50 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-200";
  const combinedStyles = `${baseStyles} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        #{label}
      </Link>
    );
  }

  return <span className={combinedStyles}>#{label}</span>;
}
