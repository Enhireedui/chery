import { defineRouting } from "next-intl/routing";

/* ══════════════════════════════════════════════════════════════
   ХЭЛНИЙ МАРШРУТ — Монгол үндсэн, English `/en` дор.

     /models/tiggo-7      → Монгол (одоогийн хаягууд хэвээр)
     /en/models/tiggo-7   → English

   ⚙ `as-needed`: үндсэн хэл (mn) угтваргүй. Ингэснээр одоо байгаа
   холбоос, Google-ийн индекс, WordPress-ийн 301 бүгд эвдрэхгүй.
   `/mn/...` гэж орвол угтваргүй хаяг руу буцаана.

   ⚙ Хэлийг ХӨТЧИЙН ХЭЛЭЭР ТААХГҮЙ (`localeDetection: false`).
   Монгол хэрэглэгчдийн олонх нь англи хэлтэй утас, Chrome
   хэрэглэдэг — `accept-language`-аар шийдвэл тэд English
   хувилбарт орно. Сонгосон хэлийг сануулах логик нь
   `middleware.ts`-д (cookie).
   ══════════════════════════════════════════════════════════════ */
export const routing = defineRouting({
  locales: ["mn", "en"],
  defaultLocale: "mn",
  localePrefix: "as-needed",
  localeDetection: false,
  /* Cookie-г `middleware.ts` өөрөө удирдана (дээрх шалтгаанаар). */
  localeCookie: false,
  /* hreflang нь хуудас бүрийн metadata-д (`lib/i18n.ts` → `alternates`). */
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/** Сонгосон хэлийг сануулах cookie. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
