/* ══════════════════════════════════════════════════════════════
   ХЭМЖИЛТИЙН НИМГЭН ДАВХАРГА

   ⚙ ЯАГААД САН СУУЛГААГҮЙ: сайтад одоогоор ямар ч аналитик
   холбогдоогүй. Хэрэглэгчийн үйлдлийг хэмжихийн тулд GA4, GTM,
   Plausible аль нэгийг сонгох нь МАРКЕТИНГИЙН шийдвэр —
   хөгжүүлэлтийнх биш. Тиймээс энд зөвхөн ИНТЕРФЕЙС тодорхойлов:

     · `window.dataLayer` — GTM холбогдмогц ямар ч өөрчлөлтгүйгээр
       бүх эвент урсаж эхэлнэ (GTM өөрөө энэ массивыг уншдаг).
     · `CustomEvent` — GTM-гүйгээр ч дурын скрипт
       `document.addEventListener("chery:track", ...)`-ээр
       сонсож болно.

   Аль нь ч байхгүй бол функц ЧИМЭЭГҮЙ буцна — хэмжилт байхгүйгээс
   болж интерфейс хэзээ ч эвдрэхгүй.
   ══════════════════════════════════════════════════════════════ */

/** Загварын хэсэгт хэмжигдэх үйлдлүүд. Нэрс нь өөрчлөгдвөл
 *  тохируулсан аналитикийн тайлан тасрах тул ТОГТМОЛ байлгана. */
export type TrackEvent =
  | "model_view"
  | "model_select"
  | "model_details_click"
  | "test_drive_click"
  | "price_request_click";

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(event: TrackEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload };

  try {
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(detail);
    document.dispatchEvent(new CustomEvent("chery:track", { detail }));
  } catch {
    /* Хэмжилт бүтэлгүйтсэн нь хэрэглэгчид хамаагүй — чимээгүй өнгөрнө. */
  }
}
