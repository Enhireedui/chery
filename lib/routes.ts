/* Дахин хэрэглэгддэг хаягууд — нэг газраас.
   `#захиалга` нь «Холбоо барих» хуудасны маягтын зангуу. */
export const BOOK_HREF = "/contact#захиалга";

/* Зорилго, загварыг урьдчилан сонгосон маягтын хаяг. Маягт нь
   `?purpose=` ба `?model=`-ийг уншиж бөглөнө (`site.js` §12). */
export type LeadPurpose = "test-drive" | "quote" | "advice";
export function leadHref(purpose: LeadPurpose, model?: string): string {
  const q = new URLSearchParams({ purpose, ...(model ? { model } : {}) });
  return `/contact?${q.toString()}#захиалга`;
}
export const QUOTE_HREF = leadHref("quote");
export const TEST_DRIVE_HREF = leadHref("test-drive");

/* ══════════════════════════════════════════════════════════════
   НҮҮР ХУУДАСНЫ ОНЦЛОХ ЗАГВАР — ЦОРЫН ГАНЦ ЭХ СУРВАЛЖ.

   ⚠ Аудитын §4: hero нь `INITIAL_ID = "tiggo-8"`-аар (флагман)
   нээгддэг байсан бол загварын үзүүлэн нь `showcaseModels[0]`
   буюу **Tiggo 2**-оор нээгддэг байв. Зочин флагмантай уулзаж,
   нэг дэлгэц гүйлгээд эхлэлийн загвар харна — нэг хуудсанд
   хоёр өөр «онцлох машин».

   Одоо hero БА үзүүлэн хоёул ЭНЭ утгыг уншина. Онцлох загварыг
   солиход НЭГ мөр засна. */
export const FEATURED_MODEL_ID = "tiggo-8";

/** Загварын хуудасны хаяг. `modelHref("tiggo-2")` → `/models/tiggo-2` */
export function modelHref(id: string): string {
  return `/models/${id}`;
}
