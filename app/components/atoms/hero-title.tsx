import Image from "next/image";
import { siteConfig } from "@/app/lib/site-config";

/**
 * A self-contained hero section component that includes an animated-like dot grid background
 * and the main welcome title.
 */
export function HeroTitle() {
  return (
    <section className="relative flex justify-center py-24 md:py-32 overflow-hidden w-full">
      {/* Simple & Clean CSS Dot Grid */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(#4b5563 0.0625rem, transparent 0.0625rem)`,
          backgroundSize: "1rem 1rem",
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black, transparent 90%)",
        }}
      />

      {/* Hero Title with dots-blocking background */}
      <div className="relative z-10 bg-white px-1 py-0.5">
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-3xl font-normal cursor-default text-gray-900 md:gap-3">
          <span className="whitespace-nowrap">Welcome to</span>
          <Image
            src="/favicon.ico"
            alt=""
            width={48}
            height={48}
            className="h-8 w-8 md:h-10 md:w-10"
            priority
            unoptimized
          />
          <span className="whitespace-nowrap">{siteConfig.title}</span>
        </div>
      </div>
    </section>
  );
}
