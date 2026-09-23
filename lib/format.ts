import type { Model } from "./content";

/** Төгрөгийн форматлалт: `48999900` → `48,999,900 ₮` */
export const mnt = (n: number): string => `${n.toLocaleString("en-US")} ₮`;

/** Загварын карт, hero-д харуулах үнийн бичвэр.
    Үнэ зарлаагүй загварт (Tiggo 7) `priceShort` буцна. */
export function priceLabel(m: Model): string {
  if (m.price) return `${mnt(m.price.from)}-аас`;
  return m.priceShort ?? m.priceNote ?? "Үнийн мэдээлэл авах";
}

/* ══════════════════════════════════════════════════════════════
   Загварын `specs`-ээс нэг мөрийн утгыг шошгоор нь олох.

   Хоёр багана (жишээ нь Tiggo 4-ийн 1.5L / 1.5T) бол « / »-ээр
   нийлүүлнэ, ГЭХДЭЭ хоёр багана ижил утгатай бол НЭГ УДАА бичнэ:
   «FWD / FWD» гэдэг нь ялгаа байгаа мэт хуурамч дохио өгнө.

   Олдохгүй бол «—». ЗОХИОХГҮЙ — баримтгүй тоо гаргахаас
   хоосон зураас нь дээр.
   ══════════════════════════════════════════════════════════════ */
export function pickSpec(m: Model, label: string | string[]): string {
  if (!m.specs) return "—";
  const labels = Array.isArray(label) ? label : [label];
  for (const g of m.specs) {
    for (const r of g.rows ?? []) {
      const key = r[0];
      if (key !== undefined && labels.includes(key)) {
        return [...new Set(r.slice(1).filter(Boolean))].join(" / ");
      }
    }
  }
  return "—";
}
