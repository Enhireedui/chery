import { getTranslations } from "next-intl/server";

import type { Model, SpecKey } from "./content";
import type { Locale } from "./i18n";

/** Төгрөгийн форматлалт: MN `48,999,900 ₮`, EN `₮48,999,900` */
export const mnt = (n: number, locale: Locale): string => {
  const s = n.toLocaleString("en-US");
  return locale === "en" ? `₮${s}` : `${s} ₮`;
};

/** Загварын карт, үзүүлэнд харуулах үнийн бичвэр.
    Үнэ зарлаагүй загварт (Tiggo 7) «Үнийн мэдээлэл авах». */
export async function priceLabel(m: Model, locale: Locale): Promise<string> {
  const t = await getTranslations({ locale, namespace: "price" });
  return m.price ? t("from", { price: mnt(m.price.from, locale) }) : t("request");
}

/* ══════════════════════════════════════════════════════════════
   Загварын `specs`-ээс нэг мөрийн утгыг түлхүүрээр нь олох.

   Хоёр багана (жишээ нь Tiggo 4-ийн 1.5L / 1.5T) бол « / »-ээр
   нийлүүлнэ, ГЭХДЭЭ хоёр багана ижил утгатай бол НЭГ УДАА бичнэ:
   «FWD / FWD» гэдэг нь ялгаа байгаа мэт хуурамч дохио өгнө.

   Олдохгүй бол «—». ЗОХИОХГҮЙ — баримтгүй тоо гаргахаас
   хоосон зураас нь дээр.
   ══════════════════════════════════════════════════════════════ */
export function pickSpec(m: Model, key: SpecKey): string {
  for (const g of m.specs ?? []) {
    const r = (g.rows ?? []).find((row) => row.k === key);
    if (r) return [...new Set(r.v.filter(Boolean))].join(" / ");
  }
  return "—";
}
