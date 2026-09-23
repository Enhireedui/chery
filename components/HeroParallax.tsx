"use client";

import { useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   HERO — КАМЕРЫН PARALLAX (2.5D гүн)

   Хулгана хөдлөхөд тайз «гүнзгийрнэ»: дэвсгэр зураг нэг хэмнэлээр,
   урд талын уур амьсгал (`.hero__atmos`) эсрэг хэмнэлээр шилжиж,
   бага зэрэг perspective-тэй тонгойно — «тайзны эргэн тойрон
   явж буй» мэдрэмж. UI хөдөлгөөнгүй тогтоно.

   ⚙ ЯАГААД САН НЭМЭХГҮЙ: ердөө CSS хувьсагч (`--hx/--hy`) +
   requestAnimationFrame-ийн lerp. Three.js/WebGL шаардлагагүй,
   GPU transform тул хямд. Каруселийн `site.js`-д огт хүрэхгүй —
   зөвхөн CSS хувьсагч бичнэ.

   ⚙ ХЯЗГААР:
     · `(hover: hover) and (pointer: fine)` биш бол огт ажиллахгүй
       (хүрэлцэхүйц дэлгэц дээр parallax байхгүй).
     · `prefers-reduced-motion: reduce` үед ажиллахгүй.
     · rAF нь зөвхөн хулгана хөдөлж байх үед эргэлдэнэ; зогсоход
       0 руу зөөлөн буцаад унтарна (CPU/GPU хэмнэнэ).
     · unmount дээр listener, rAF, CSS хувьсагчийг цэвэрлэнэ. */
export default function HeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero--home");
    if (!hero) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let hovering = false;

    const frame = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty("--hx", cx.toFixed(4));
      hero.style.setProperty("--hy", cy.toFixed(4));
      if (hovering || Math.abs(tx - cx) > 0.0008 || Math.abs(ty - cy) > 0.0008) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hovering = true;
      kick();
    };
    const onLeave = () => { tx = 0; ty = 0; hovering = false; kick(); };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      hero.style.removeProperty("--hx");
      hero.style.removeProperty("--hy");
    };
  }, []);

  return null;
}
