import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";

import "./site.css";
import "./font.css"; /* ⚠ site.css-ийн ДАРАА — `--font`-ыг дарна */

import BackToTop from "@/components/BackToTop";
import { SITE_URL, IS_PRODUCTION_HOST } from "@/lib/site-url";

/* Дизайны системийн §1: НЭГ гэр бүл, 3 жин. Илүү жин татахгүй. */
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CHERY Mongolia — Албан ёсны дистрибьютор Сайн Моторс",
    template: "%s · CHERY Mongolia",
  },
  description:
    "CHERY-гийн Монгол дахь албан ёсны дистрибьютор. Tiggo 2, 4, 7, 8 — үнэ, үзүүлэлт, тест драйв.",
  applicationName: "CHERY Mongolia",
  openGraph: {
    type: "website",
    siteName: "CHERY Mongolia",
    locale: "mn_MN",
  },
  /* Preview deployment-ыг индекслүүлэхгүй — production-той
     давхардсан агуулга үүсгэхээс сэргийлнэ (Phase 15). */
  robots: IS_PRODUCTION_HOST
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0e10",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* `no-js` нь site.js ачаалагдмагц хасагдана. Түүнийг хүлээж
       байх хооронд CSS нь «JS-гүй» нөөц харагдацыг үзүүлнэ —
       агуулга хэзээ ч алга болохгүй. */
    <html lang="mn" className={`no-js ${montserrat.variable}`}>
      <body>
        <a className="skip" href="#main">
          Үндсэн агуулга руу шилжих
        </a>

        {children}

        {/* Дээш буцах — бүх хуудсанд. `site.js` (`initBackToTop`) нь
            нэг дэлгэц гүйлгэсний дараа `.is-visible`-ээр илрүүлж,
            дарахад дээд рүү гөлгөр гулсуулна. */}
        <BackToTop />

        {/* Интерактив давхарга — хамааралгүй vanilla JS, 20 КБ.
            `afterInteractive`: HTML аль хэдийн зурагдсаны дараа
            ачаалагдана тул анхны рендерийг хаахгүй. */}
        <Script src="/assets/js/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
