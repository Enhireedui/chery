import type { NextConfig } from "next";

/* ══════════════════════════════════════════════════════════════
   Хамгаалалтын толгойнууд (Phase 20)

   ⚠ `script-src` ДЭЭР `'unsafe-inline'` ЯАГААД БАЙНА:
   Next.js-ийн App Router нь server component-ийн payload-ыг
   INLINE `<script>self.__next_f.push(...)</script>` хэлбэрээр
   дамжуулдаг. Түүнийг хориглоход хуудас БҮТНЭЭР ХООСОН
   рендерлэгдэж байсныг туршилтаар тогтоов (CSP-гүй үед 1.1МБ
   кадр, CSP-тэй үед 5.8КБ хоосон кадр).

   Хоёр л сонголт байсан:
     а) nonce — middleware шаардана, тэр нь хуудсыг DYNAMIC
        болгож static generation-ыг үхүүлнэ. CDN кэш алдагдана.
     б) `'unsafe-inline'` — static хэвээр.

   (б)-г сонгосон УЧИР: сайт нь ХЭРЭГЛЭГЧИЙН АГУУЛГЫГ ОГТ
   РЕНДЕРЛЭДЭГГҮЙ. Бүх бичвэр `lib/content.ts`-ээс (build-time,
   хөгжүүлэгчийн бичсэн). Цорын ганц хэрэглэгчийн оролт нь лидийн
   маягт бөгөөд тэр нь ЗӨВХӨН бичигддэг, хэзээ ч хуудсанд
   эргэж харагддаггүй. Тиймээс XSS-ийн гадаргуу бодитоор тэг.

   Хэрэв хожим хэрэглэгчийн агуулга (сэтгэгдэл, мэдээний
   редактор) нэмэгдвэл ЭНЭ ШИЙДВЭРИЙГ ДАХИН АВЧ ХЭЛЭЛЦЭХ ёстой.

   Бусад:
   · `style-src 'unsafe-inline'` — hero-гийн чирэлт `--dx` CSS
     хувьсагчийг `style` атрибутаар бичдэг.
   · `'unsafe-eval'` нь ЗӨВХӨН dev дээр (HMR). Production-д үгүй.
   · `frame-src` нь Google Maps-ийн iframe-д (дарж ачаалдаг).
   · `frame-ancestors 'none'` — сайтыг iframe-д оруулахыг хориглоно
     (clickjacking).
   ══════════════════════════════════════════════════════════════ */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "frame-src https://www.google.com",
  "connect-src 'self' https://*.supabase.co",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        /* Зураг, фонт, CSS/JS нь агуулгын нэрээрээ хувьдаггүй тул
           урт кэштэй. Шинэ зураг гарвал ШИНЭ НЭРТЭЙ байх ёстой. */
        source: "/assets/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    /* Phase 15 — ХУУЧИН WORDPRESS ХАЯГУУД → шинэ цэвэр хаягууд.
       Амьд сайт нь `chery.sain-motors.mn/index.php/...` бүтэцтэй
       байсан. Домэйн шинэ сайт руу зааж эхлэхэд эдгээр хаягаар
       ирсэн хандалт, гадаад холбоос, хайлтын индекс алдагдахгүй
       байхын тулд 301-ээр зөөнө. `permanent: true` = 301. */
    const wp: Array<[string, string]> = [
      ["/index.php/t2", "/models/tiggo-2"],
      ["/index.php/tiggo-2", "/models/tiggo-2"],
      ["/index.php/tiggo-4", "/models/tiggo-4"],
      ["/index.php/tiggo-7", "/models/tiggo-7"],
      ["/index.php/tiggo-8-2", "/models/tiggo-8"],
      ["/index.php/brand", "/brand"],
      ["/index.php/brand1", "/awards"],
      ["/index.php/compare", "/compare"],
      ["/index.php/dealer", "/contact"],
      ["/index.php/contact-us", "/contact"],
      ["/index.php/about-us", "/brand"],
      ["/index.php/services", "/service"],
      ["/index.php/faq", "/service"],
      ["/index.php/dest-drive", "/service"],
      ["/index.php/inventory", "/models"],
    ];

    /* Хуучин static хувилбарын `.html` хаягууд — тэр нь зөвхөн
       локал дээр байсан ч хэн нэгэн хуваалцсан байж мэдэх тул
       мөн зөөнө. */
    const html: Array<[string, string]> = [
      ["/brand.html", "/brand"],
      ["/awards.html", "/awards"],
      ["/compare.html", "/compare"],
      ["/service.html", "/service"],
      ["/contact.html", "/contact"],
      ["/news.html", "/news"],
      ["/models/tiggo-2.html", "/models/tiggo-2"],
      ["/models/tiggo-4.html", "/models/tiggo-4"],
      ["/models/tiggo-7.html", "/models/tiggo-7"],
      ["/models/tiggo-8.html", "/models/tiggo-8"],
    ];

    return [...wp, ...html].map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
