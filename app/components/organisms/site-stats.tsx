"use client";

import { useState, useEffect } from "react";
import { Newspaper, BookOpen, Folder, Tag, Calendar, Eye } from "lucide-react";
import { getTaxonomies } from "@/app/lib/article-utils";
import { siteConfig } from "@/app/lib/site-config";
import type { ArticleMetadata } from "@/app/lib/article-types";

/**
 * A Zsh terminal-style display for site statistics.
 * Mimics real shell output with consistent font and prompt.
 * @param props - Component props containing articles.
 * @returns A Zsh-style terminal list of statistics.
 */
export function SiteStats({ articles }: { articles: ArticleMetadata[] }) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const taxonomies = getTaxonomies(articles);
  const launchedAt = taxonomies.launchedAt;
  const commandName = siteConfig.title.toLowerCase();

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    ...(launchedAt
      ? [
          {
            label: "launched at",
            value: new Date(launchedAt).toLocaleDateString("en-CA"), // YYYY-MM-DD
            icon: Calendar,
          },
        ]
      : []),
    {
      label: "views",
      value: taxonomies.totalViews.toLocaleString(),
      icon: Eye,
    },
    { label: "articles", value: articles.length, icon: Newspaper },
    { label: "series", value: taxonomies.series.length, icon: BookOpen },
    { label: "categories", value: taxonomies.category.length, icon: Folder },
    { label: "tags", value: taxonomies.tags.length, icon: Tag },
  ];

  const separator = "=";

  return (
    <section className="flex justify-center py-4 md:py-6">
      <div className="w-full font-mono text-sm md:text-base">
        {/* Zsh Prompt Line (Creative Engineer Style) */}
        <div className="flex flex-wrap items-center gap-x-2 mb-6">
          <span className="text-sky-600 font-bold">~/mylife</span>
          <span className="text-gray-400">in</span>
          <span className="text-emerald-600 font-bold">
            {siteConfig.locale}
          </span>
          <span className="text-emerald-600 font-bold ml-1">&gt;</span>
          <span className="text-gray-900">{commandName} --info</span>
          {mounted && (
            <span className="ml-auto text-gray-400 hidden sm:inline">
              at {currentTime}
            </span>
          )}
        </div>

        {/* Shell Output Area */}
        <div className="space-y-2 pl-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 text-gray-700"
            >
              <div className="flex items-center gap-3 shrink-0">
                <stat.icon className="size-4 text-gray-400" />
                <span className="whitespace-nowrap">{stat.label}</span>
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap text-gray-200 px-2 select-none tracking-widest">
                {separator.repeat(100)}
              </div>
              <div className="shrink-0">
                <span className="text-emerald-600 font-bold">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
