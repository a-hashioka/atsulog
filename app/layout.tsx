import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title[0].toUpperCase() + siteConfig.title.slice(1),
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang={siteConfig.htmlLang}>
      <body>
        <div>
          <header>
            <span>{siteConfig.title}</span>
            <nav aria-label="Global navigation">
              <Link href="/">Home</Link> <Link href="/articles">Articles</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            &copy; {currentYear} {siteConfig.title}
          </footer>
        </div>
      </body>
    </html>
  );
}
