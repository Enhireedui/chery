/* ══════════════════════════════════════════════════════════════
   ДЭЭШ БУЦАХ — хуудасны аль ч цэгээс дээд рүү.

   ⚙ ЯАГААД CLIENT БИШ: зан үйл нь `site.js`-ийн `initBackToTop`-д
   (гүйлгэлт сонсох, гулсуулах) — hero-гийн заагчтай ижил хэв маяг.
   Энэ нь ердөө статик товч тул React state, hydration хэрэггүй.

   ⚙ ЯАГААД ЗӨВХӨН JS-ТЭЙ: гөлгөр гулсалт нь JS шаарддаг тул
   `html.no-js` үед `site.css` товчийг бүрэн нуудаг — үхмэл товч
   харагдахгүй. JS ачаалагдаад л `.is-visible`-ээр илэрнэ (нэг
   дэлгэц гүйлгэсний дараа).

   ⚙ ЯАГААД ДУГУЙ, УЛААНГҮЙ: улаан нь ЗӨВХӨН гол үйлдэлд (§0.2).
   Дээш буцах нь тусалгаа — тиймээс чимээгүй монохром: ink дугуй,
   цагаан сум. Хуудасны онцлох мөч (загварын заалт) л зоримог,
   бусад нь дэглэмтэй. */

const ArrowUp = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V6M6 12l6-6 6 6" />
  </svg>
);

export default function BackToTop() {
  return (
    <button
      type="button"
      className="to-top"
      data-to-top
      aria-label="Дээш буцах"
    >
      <ArrowUp />
    </button>
  );
}
