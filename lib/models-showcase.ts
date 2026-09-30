import { getTranslations } from "next-intl/server";

import { getContent } from "./content";
import { priceLabel } from "./format";
import { localePath, type L, type Locale } from "./i18n";
import { modelHref } from "./routes";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ҮЗҮҮЛЭНГИЙН ӨГӨГДӨЛ

   ⚙ ЯАГААД ЭНД ҮНЭ, СЕГМЕНТ ДАХИН БИЧИГДЭЭГҮЙ:
   `lib/content.ts` нь агуулгын ЦОРЫН ГАНЦ эх сурвалж. Энэ файл нь
   ЗӨВХӨН үзүүлэнд хэрэгтэй нэмэлт талбаруудыг (тайлбар, тайзны
   зураг, орчны өнгө) тодорхойлж, үлдсэнийг `models`-оос НИЙЛҮҮЛНЭ.

   ⚙ СЕРВЕР ДЭЭР ХЭЛЭНД БУУЛГАНА: `ModelsSection` нь client component
   тул энд бэлэн мөр болгож props-оор дамжуулна — хөтөч рүү хоёр
   хэлний агуулга, next-intl-ийн мессежүүд очихгүй.

   ⚙ ЗУРГИЙГ ОФФИЦИАЛ ФАЙЛААР СОЛИХ:
   Одоогийн `t{n}-side.avif|webp` нь ЖИНХЭНЭ ТУНГАЛАГ (alpha = 0)
   студийн cut-out — бараан тайзан дээр машин «хөвдөг», сүүдэр нь
   `drop-shadow`-оор кузовын хэлбэрийг дагана. Оффициал зураг ирвэл
   ижил нэрээр AVIF + WebP хосоор тавина; ЗААВАЛ тунгалаг дэвсгэртэй.
   ══════════════════════════════════════════════════════════════ */

export interface ShowcaseModel {
  id: string;
  name: string;
  category: string;
  /** Бэлэн форматтай үнэ: «48,999,900 ₮-аас» эсвэл «Үнийн мэдээлэл авах» */
  price: string;
  /** `request` бол үнэ зарлаагүй */
  priceType: "from" | "request";
  description: string;
  /** Файлын нэр угтваргүй → `/assets/img/{image}.avif|webp` (тунгалаг cut-out) */
  image: string;
  alt: string;
  /** Тайзны орчны өнгө — доорх тайлбарыг үз. */
  ambient: string;
  href: string;
}

/* ══════════════════════════════════════════════════════════════
   ОРЧНЫ ӨНГӨ (`ambient`)

   Загвар солигдоход тайзны ГЭРЭЛТҮҮЛЭГ нь тухайн машины өнгө рүү
   маш бага зэрэг шилжинэ — «студийн гэрлийг сольсон» мэдрэмж.
   `t{n}-side.webp`-ийн кузовын хажуу хавтангаас хэмжсэн медиан
   өнгийг ханалт бараг тэг болтол буурааж өгсөн. Тунгалаг байдлыг
   0.2-оос дээш болгохгүй — давхарга нь кадрын ЗАХААР л тавигдана.
   ══════════════════════════════════════════════════════════════ */

const extras: Record<string, { description: L; image: string; ambient: string }> = {
  "tiggo-2": {
    description: {
      mn: "Хотын хэмнэлд тохирсон авсаархан, өөртөө итгэлтэй SUV.",
      en: "A compact, confident SUV made for the rhythm of the city.",
    },
    image: "t2-side",
    ambient: "rgba(150, 156, 164, .10)",
  },
  "tiggo-4": {
    description: {
      mn: "Технологи, тав тух, өдөр тутмын практик хэрэглээг тэнцвэржүүлсэн SUV.",
      en: "An SUV that balances technology, comfort and everyday practicality.",
    },
    image: "t4-side",
    /* #b1b2b3 — саармаг мөнгөлөг */
    ambient: "rgba(150, 156, 164, .10)",
  },
  "tiggo-7": {
    description: {
      mn: "Өргөн уудам орон зай, ухаалаг технологи, зоримог дизайныг нэгтгэсэн дунд оврын SUV.",
      en: "A mid-size SUV combining spacious comfort, intelligent technology and bold design.",
    },
    image: "t7-side",
    /* #5d5e68 — хүйтэн бараан саарал */
    ambient: "rgba(94, 103, 126, .13)",
  },
  "tiggo-8": {
    description: {
      mn: "Гэр бүл, аялал болон өдөр тутмын илүү өргөн хэрэгцээнд зориулагдсан 7 суудалтай SUV.",
      en: "A seven-seat SUV for family life, road trips and everything in between.",
    },
    image: "t8-side",
    /* #1b1b1b — гүн бал чулуун */
    ambient: "rgba(48, 52, 60, .13)",
  },
};

export async function getShowcase(locale: Locale): Promise<ShowcaseModel[]> {
  const t = await getTranslations({ locale, namespace: "models" });
  return Promise.all(
    getContent(locale).models.map(async (m) => {
      const e = extras[m.id];
      if (!e) throw new Error(`models-showcase: «${m.id}»-д үзүүлэнгийн өгөгдөл алга`);
      return {
        id: m.id,
        name: m.name,
        category: t(`segment.${m.segment}`),
        price: await priceLabel(m, locale),
        priceType: m.price ? "from" : "request",
        description: e.description[locale],
        image: e.image,
        alt: t("showcaseAlt", { name: m.name }),
        ambient: e.ambient,
        href: localePath(locale, modelHref(m.id)),
      } satisfies ShowcaseModel;
    })
  );
}
