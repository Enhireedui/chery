import type { MetadataRoute } from "next";

import { models } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

/* Хайлтын системд зориулсан хуудсуудын жагсаалт. `/news` (одоогоор
   хоосон) ба `/thanks` (маягтын дараах) орохгүй. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("/", 1),
    page("/models", 0.9),
    ...models.map((m) => page(`/models/${m.id}`, 0.9)),
    page("/contact", 0.8),
    page("/service", 0.7),
    page("/brand", 0.6),
    page("/awards", 0.5),
  ];
}
