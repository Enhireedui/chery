import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { MODEL_IDS } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { abs } from "@/lib/site-url";

/* Хайлтын системд зориулсан хуудсуудын жагсаалт — хэл тус бүрд
   тусдаа URL, харилцан hreflang-тай. `/news` (одоогоор хоосон) ба
   `/thanks` (маягтын дараах) орохгүй. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number]> = [
    ["/", 1],
    ["/models", 0.9],
    ...MODEL_IDS.map((id): [string, number] => [`/models/${id}`, 0.9]),
    ["/contact", 0.8],
    ["/service", 0.7],
    ["/brand", 0.6],
    ["/awards", 0.5],
  ];
  return pages.flatMap(([path, priority]) =>
    routing.locales.map((locale) => ({
      url: abs(localePath(locale, path)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, abs(localePath(l, path))])),
      },
    }))
  );
}
