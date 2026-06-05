import { Home, Newspaper, Pencil } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/app/lib/site-config";
import { isAuthenticated } from "@/app/lib/auth";
import { LogoutButton } from "@/app/components/atoms/logout-button";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();
  const authenticated = await isAuthenticated();

  return (
    <html lang={siteConfig.htmlLang}>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-[1.5rem] py-[1rem] flex items-center justify-between">
            {/* Left: Title & Admin Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="group flex items-center text-xl font-bold tracking-tight transition-colors"
              >
                <span className="text-[1.5rem] text-emerald-500 mr-2 group-hover:translate-x-0.5 transition-transform duration-200">
                  &gt;
                </span>
                <span className="group-hover:text-gray-600">
                  {siteConfig.title}
                </span>
              </Link>
              {authenticated && (
                <div className="flex items-center border-l border-gray-100 pl-4">
                  <LogoutButton />
                </div>
              )}
            </div>

            {/* Right: Navigation */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center"
              >
                <Home className="size-4.5 md:size-4 md:mr-1.5" />
                <span className="hidden md:inline">Home</span>
              </Link>
              <Link
                href="/articles"
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center"
              >
                <Newspaper className="size-4.5 md:size-4 md:mr-1.5" />
                <span className="hidden md:inline">Articles</span>
              </Link>
              {authenticated && (
                <Link
                  href="/edit"
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center"
                >
                  <Pencil className="size-4.5 md:size-4 md:mr-1.5" />
                  <span className="hidden md:inline">Edit</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          <main>{children}</main>
        </div>
        <footer className="max-w-3xl mx-auto w-full px-6 py-8 border-t border-gray-100 text-sm text-muted text-center">
          &copy; {currentYear} {siteConfig.title}
        </footer>
      </body>
    </html>
  );
}
