/* ══════════════════════════════════════════════════════════════
   Сайтын бүрэн хаяг — ЦОРЫН ГАНЦ ЭХ СУРВАЛЖ (Phase 14)

   canonical · og:url · sitemap · robots · JSON-LD бүгд үүнээс уншина.
   Хатуу бичихгүй: домэйн солиход алдах эрсдэлтэй.

   Тэргүүлэх дараалал:
     1. NEXT_PUBLIC_SITE_URL — гараар тохируулсан (production: chery.mn)
     2. VERCEL_PROJECT_PRODUCTION_URL — Vercel-ийн production домэйн
     3. VERCEL_URL — тухайн deployment-ийн хаяг (preview-д хэрэгтэй)
     4. localhost — локал хөгжүүлэлт

   ⚠ VERCEL_URL нь preview deployment бүрт ӨӨР байдаг. Тиймээс
   production-д ҮРГЭЭЖ NEXT_PUBLIC_SITE_URL-ыг тохируулна — эс тэгвээс
   canonical нь preview хаягийг заана.
   ══════════════════════════════════════════════════════════════ */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) return `https://${prod.replace(/\/+$/, "")}`;

  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** Хуудасны замаас бүтэн хаяг. `abs("/brand")` → `https://chery.mn/brand` */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Хайлтын систем индекслэх ёстой эсэх.
    Preview deployment-уудыг индекслүүлэхгүй — production-той
    давхардсан агуулга үүсгэхээс сэргийлнэ (Phase 15). */
export const IS_PRODUCTION_HOST =
  SITE_URL === "https://chery.mn" || process.env.VERCEL_ENV === "production";
