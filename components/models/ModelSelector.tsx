"use client";

import { useEffect, useRef } from "react";

import type { ShowcaseModel } from "@/lib/models-showcase";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ЭГНЭЭ — тайзны доорх нимгэн сонгогч.

   Premium configurator-ын хэл: КАРТ БИШ. Хүрээ, дэвсгэр, сүүдэр
   байхгүй — зөвхөн бяцхан дүрс, нэр, идэвхтэйг заах нэг ЗАГВАР
   зураас. Дээрээ үс шиг нимгэн тусгаарлагч.

   Идэвхгүй нь саарал (`grayscale`) ба сулавтар: нүд идэвхтэй дээр
   тогтоно. Идэвхтэйг ГУРВАН дохиогоор ялгана (§19 — зөвхөн өнгө
   хангалтгүй): бүтэн өнгө · бараан нэр · улаан зураас.
   ══════════════════════════════════════════════════════════════ */

/** `t4-side` → `t4-thumb`. `scripts/make-model-thumbs.mjs` үүсгэдэг. */
const thumbOf = (m: ShowcaseModel) => m.image.replace(/-side$/, "-thumb");

export default function ModelSelector({
  models,
  activeIndex,
  busy,
  onSelect,
}: {
  models: ShowcaseModel[];
  activeIndex: number;
  busy: boolean;
  onSelect: (i: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  /* Утсан дээр эгнээ хэвтээ гүйдэг тул сонгогдсон нь хүрээнээс гарч
     болзошгүй (жишээ нь сум/шудралтаар солиход). Харагдах байдалд нь
     зөөлөн буцааж оруулна. `block: "nearest"` нь ХУУДСЫГ босоогоор
     гүйлгэхээс сэргийлнэ — эс тэгвэл загвар солих бүрд хуудас үсэрнэ. */
  /* ⚠ `scrollIntoView` БИШ: `block: "nearest"` нь элемент дэлгэцээс
     гадуур байхад ХУУДСЫГ босоогоор гүйлгэдэг — нүүр хуудас ачаалагдмагц
     hero-г алгасаж загварын хэсэг рүү үсэрч байв. Зөвхөн эгнээг
     өөрийг нь хэвтээ гүйлгэнэ. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;
    const el = rail.children[activeIndex] as HTMLElement | undefined;
    if (!el) return;
    const er = el.getBoundingClientRect(), rr = rail.getBoundingClientRect();
    rail.scrollTo({
      left: rail.scrollLeft + (er.left - rr.left) - (rail.clientWidth - er.width) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [activeIndex]);

  return (
    <div
      ref={railRef}
      className="ms-rail"
      role="tablist"
      aria-label="CHERY загвар сонгох"
    >
      {models.map((m, i) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          className="ms-pick"
          onClick={() => onSelect(i)}
          disabled={busy}
        >
          <span className="ms-pick__img">
            <picture>
              <source type="image/avif" srcSet={`/assets/img/${thumbOf(m)}.avif`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/img/${thumbOf(m)}.webp`}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </picture>
          </span>
          <span className="ms-pick__name">{m.name}</span>
        </button>
      ))}
    </div>
  );
}
