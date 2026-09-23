"use client";

import type { CategoryFilter } from "@/lib/models-showcase";

/* ══════════════════════════════════════════════════════════════
   АНГИЛЛЫН ШҮҮЛТҮҮР

   ⚙ ЯАГААД `role="tablist"` БИШ:
   ARIA-гийн tab загвар нь НЭГ tabpanel-ыг сольж харуулна гэсэн
   амлалт өгдөг. Энд шүүлтүүр нь ЖАГСААЛТЫГ богиносгодог —
   өөр агуулга руу шилждэггүй. Tab дүрд оруулбал дэлгэц уншигч
   «панель солигдоно» гэж хүлээгээд, оронд нь картын тоо
   өөрчлөгдөхөд төөрнө. Тиймээс энгийн `group` + `aria-pressed`
   товчнууд — юу болохыг ЯГ хэлнэ.

   Идэвхтэй төлөв нь ГУРВАН дохиогоор: бараан дэвсгэр, доод
   талын улаан зураас, `aria-pressed`. §19: зөвхөн өнгөөр
   төлөв дамжуулахгүй.
   ══════════════════════════════════════════════════════════════ */

export default function ModelFilterTabs({
  filters,
  activeId,
  counts,
  onChange,
}: {
  filters: CategoryFilter[];
  activeId: string;
  /** Шүүлтүүр тус бүрд хэдэн загвар байгаа — хоосон шүүлт дарагдахгүй */
  counts: Record<string, number>;
  onChange: (id: string) => void;
}) {
  return (
    <div className="ms-tabs" role="group" aria-label="Загварыг ангиллаар шүүх">
      {filters.map((f) => {
        const n = counts[f.id] ?? 0;
        return (
          <button
            key={f.id}
            type="button"
            className="ms-tab"
            aria-pressed={f.id === activeId}
            disabled={n === 0}
            onClick={() => onChange(f.id)}
          >
            {f.label}
            <span className="ms-tab__n num" aria-hidden="true">
              {n}
            </span>
            {/* Дэлгэц уншигчид тоог утгатай өгүүлбэрээр */}
            <span className="vh">— {n} загвар</span>
          </button>
        );
      })}
    </div>
  );
}
