import type { ShowcaseModel } from "@/lib/models-showcase";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ТАНИХ БЛОК — цэвэр үзүүлэх компонент.

   Төлөв ч, хөдөлгөөний логик ч энд БАЙХГҮЙ: загвар орж, разметка
   гарна. Шилжилтийн хөдөлгөөнийг эцэг нь `key` солих замаар өгнө
   (CSS `animation` + remount) — `useEffect`, `framer-motion`
   аль нь ч хэрэггүй.

   ШАТЛАЛ — редакцийн masthead:
     ангилал (жижиг, зайтай)
     НЭР     (бүтээгдэхүүний таних тэмдэг, хамгийн том)
     ─────── үс шиг зураас
     тайлбар ······················ үнэ

   ⚠ CTA ЭНД БАЙХГҮЙ. Тэр нь доод удирдлагын мөрөнд, сонгогчтой
   хамт суудаг: «үйлдэл» ба «дараагийн загвар» хоёр нэг мөрөнд
   байснаар нүдний зам БРЭНД → ЗАГВАР → МАШИН → ҮЙЛДЭЛ → ДАРААГИЙНХ
   гэж бүтэн хаагдана.

   ⚠ КАРТ БОЛГОХГҮЙ: хүрээ, дэвсгэр, сүүдэр аль нь ч алга. Шатлалыг
   ЗӨВХӨН типографи, зай, ганц зураасаар барина.
   ══════════════════════════════════════════════════════════════ */

export default function ModelInfo({
  model,
  dir,
}: {
  model: ShowcaseModel;
  /** +1 → зүүн тийш, -1 → баруун тийш. Бичвэр машинтайгаа нэг зүг рүү. */
  dir: 1 | -1;
}) {
  return (
    <div className="ms-id" data-dir={dir}>
      <p className="ms-id__cat">{model.category}</p>

      <h2 className="ms-id__name" id="ms-title">
        {model.name}
      </h2>

      <div className="ms-id__row">
        <p className="ms-id__desc">{model.description}</p>
        <p className="ms-id__price">
          <span data-request={model.priceType === "request" || undefined}>
            {model.price}
          </span>
        </p>
      </div>
    </div>
  );
}
