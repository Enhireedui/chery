import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import "./site.css";
import "./font.css"; /* ⚠ site.css-ийн ДАРАА — `--font`-ыг дарна */

import BackToTop from "@/components/BackToTop";
import { routing } from "@/i18n/routing";
import { OG_LOCALE } from "@/lib/i18n";
import { SITE_URL, IS_PRODUCTION_HOST } from "@/lib/site-url";

/* Дизайны системийн §1: ХОЁР гэр бүл, үүрэг тусдаа.
   · Inter — UI, навигац, бичвэр, товч, шошго. Монгол кирилл (Ө, Ү)
     14–18px дээр цэвэр, жигд, мэргэжлийн.
   · Manrope — зөвхөн загварын том нэр (Tiggo 8 г.м.).
   Хоёулаа variable, `next/font`-оор сайт дээрээ хадгалагдана
   (Google Fonts-оос гадагш ачаалахгүй). Кирилл ба латин хоёуланг
   дэмждэг тул хэл солиход фонт, мөрийн өндөр өөрчлөгдөхгүй. */
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

/* site.js-ийн хаягт агуулгын хэш — `next.config.ts` нь `/assets/js/`-г
   1 жил immutable кэшлэдэг тул файл өөрчлөгдөхөд хаяг нь өөрчлөгдөж,
   хөтөч шинийг татна. Layout нь static тул build үед НЭГ удаа ажиллана. */
const SITE_JS = `/assets/js/site.js?v=${createHash("sha1")
  .update(readFileSync(join(process.cwd(), "public/assets/js/site.js")))
  .digest("hex")
  .slice(0, 8)}`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    applicationName: t("siteName"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image" },
    /* Preview deployment-ыг индекслүүлэхгүй — production-той
       давхардсан агуулга үүсгэхээс сэргийлнэ. */
    robots: IS_PRODUCTION_HOST ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0e10",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("meta");
  /* `site.js`-ийн мессежүүд — messages/*.json-ийн `js` хэсэг. JSON нь
     гүйцэтгэгддэггүй `<script type="application/json">`-д тул CSP-д
     нөлөөлөхгүй; `<` нь `</script>`-ээр тасрахаас сэргийлж escape. */
  const jsJson = JSON.stringify((await getMessages()).js).replace(/</g, "\\u003c");

  return (
    /* `no-js` нь site.js ачаалагдмагц хасагдана. Түүнийг хүлээж
       байх хооронд CSS нь «JS-гүй» нөөц харагдацыг үзүүлнэ. */
    <html lang={locale} className={`no-js ${inter.variable} ${manrope.variable}`}>
      <body>
        <a className="skip" href="#main">
          {t("skip")}
        </a>

        {children}

        <BackToTop label={t("toTop")} />

        <script id="site-i18n" type="application/json" dangerouslySetInnerHTML={{ __html: jsJson }} />
        {/* Интерактив давхарга — хамааралгүй vanilla JS. `afterInteractive`:
            HTML аль хэдийн зурагдсаны дараа ачаалагдана. */}
        <Script src={SITE_JS} strategy="afterInteractive" />
      </body>
    </html>
  );
}
