import type { MetadataRoute } from "next";

import { SITE_URL, IS_PRODUCTION_HOST } from "@/lib/site-url";

/* Production-д бүгдийг зөвшөөрнө (+ sitemap); preview/локал хаягийг
   индекслүүлэхгүй — давхардсан агуулгаас сэргийлнэ. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_HOST) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thanks"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
