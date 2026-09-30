import type { Locale } from "@/i18n/routing";

export type { Locale };

/* ══════════════════════════════════════════════════════════════
   ХОЁР ХЭЛНИЙ АГУУЛГА

   Хоёр төрлийн текст байна:
     · UI бичвэр (товч, шошго, гарчиг, алдааны мессеж) →
       `messages/mn.json`, `messages/en.json` (next-intl)
     · Бүтэцтэй агуулга (загвар, шагнал, FAQ) → `lib/content.ts`,
       текст талбар бүр `{ mn, en }` хос. Хоёр хэл ЗЭРЭГЦЭЭ
       бичигдсэн тул орчуулагч нэг дор хоёуланг харна; үнэ, зураг,
       тоо зэрэг хэлнээс үл хамаарах өгөгдөл НЭГ Л удаа бичигдэнэ.

   `resolve()` нь агуулгыг нэг хэл рүү буулгана — компонентууд
   энгийн `string` хүлээж авна.
   ══════════════════════════════════════════════════════════════ */

/** Хоёр хэлтэй текст. */
export interface L {
  readonly mn: string;
  readonly en: string;
}

/** `L`-ийг `string` болгосон төрөл (гүн, массив ба tuple-ийг хадгална). */
export type Localized<T> = T extends L
  ? string
  : T extends object
    ? { -readonly [K in keyof T]: Localized<T[K]> }
    : T;

function isL(v: unknown): v is L {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  return (
    keys.length === 2 &&
    typeof (v as L).mn === "string" &&
    typeof (v as L).en === "string"
  );
}

export function resolve<T>(value: T, locale: Locale): Localized<T> {
  if (isL(value)) return value[locale] as Localized<T>;
  if (Array.isArray(value)) return value.map((v) => resolve(v, locale)) as Localized<T>;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v, locale);
    return out as Localized<T>;
  }
  return value as Localized<T>;
}

/* ---------- Хаяг ---------- */

/** Хуудасны хаягийг хэлэнд тааруулна. Зөвхөн САЙТЫН ХУУДСАНД —
 *  `/assets/...`, `tel:`, гадаад холбоост хэрэглэхгүй.
 *  `localePath("en", "/contact?purpose=quote#захиалга")` →
 *  `/en/contact?purpose=quote#захиалга` */
export function localePath(locale: Locale, href: string): string {
  if (locale === "mn" || !href.startsWith("/")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  return (path === "/" ? "/en" : `/en${path}`) + rest;
}

/** Хуудас бүрийн canonical ба hreflang. `path` нь угтваргүй
 *  (Монгол) хаяг. `metadataBase`-ээр бүтэн URL болно. */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: { mn: path, en: localePath("en", path), "x-default": path },
  };
}

export const OG_LOCALE: Record<Locale, string> = { mn: "mn_MN", en: "en_GB" };

/** Хуудас бүрийн `openGraph`-д. ⚠ Next.js нь хуудасны `openGraph`-ийг
 *  layout-ынхтай НИЙЛҮҮЛДЭГГҮЙ, бүтнээр нь солидог — тиймээс эдгээрийг
 *  хуудас болгонд дахин өгнө (эс тэгвээс `og:locale` алга болдог байв). */
export function ogBase(locale: Locale) {
  return {
    type: "website" as const,
    siteName: "CHERY Mongolia",
    locale: OG_LOCALE[locale],
    alternateLocale: (["mn", "en"] as const).filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}
