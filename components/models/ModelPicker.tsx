"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ShowcaseModel } from "@/lib/models-showcase";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАР СОНГОГЧ — chery.co.za маягийн жижиг «pill» цэс.

   Нэг товч (идэвхтэй загварын нэр + сум), дарахад доош 3 загварын
   жагсаалт нээгдэнэ. Гар (сум/Enter/Esc), гадна дарахад хаагдах,
   `aria` бүрэн — энгийн боловч жинхэнэ хүртээмжтэй listbox.
   ══════════════════════════════════════════════════════════════ */
export default function ModelPicker({
  models,
  activeIndex,
  onSelect,
}: {
  models: ShowcaseModel[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(activeIndex); // тодотгосон мөр
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => setHi(activeIndex), [activeIndex]);

  /* Гадна дарах / Esc — хаана */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  const choose = (i: number) => {
    onSelect(i);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setHi(activeIndex);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % models.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => (h - 1 + models.length) % models.length); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(hi); }
  };

  const active = models[activeIndex];

  return (
    <div className="ms-picker" ref={rootRef}>
      <button
        type="button"
        className="ms-picker__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => { setOpen((o) => !o); setHi(activeIndex); }}
        onKeyDown={onKey}
      >
        <span className="ms-picker__label">{active?.name}</span>
        <svg className="ms-picker__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      <ul
        id={listId}
        className="ms-picker__list"
        role="listbox"
        aria-label="Загвар сонгох"
        data-open={open ? "" : undefined}
        onKeyDown={onKey}
      >
        {models.map((m, i) => (
          <li key={m.id} role="option" aria-selected={i === activeIndex}>
            <button
              type="button"
              className={`ms-picker__opt${i === hi ? " is-hi" : ""}${i === activeIndex ? " is-active" : ""}`}
              tabIndex={-1}
              onClick={() => choose(i)}
              onPointerEnter={() => setHi(i)}
            >
              {m.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
