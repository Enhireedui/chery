"use client";

import { useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════════
   БРЭНДИЙН ТОМ WORDMARK — хулгана хөдлөхөд УЛААНААР асна.

   Эх санаа: Aceternity/Nur UI-ийн "text hover effect". CHERY-гийн
   хэлээр дахин барив:
     · Солонго градиент → ЗӨВХӨН улаан (§0.2: улаан бол зөвхөн
       үйлдэл/идэвх — энд hover нь тэр үйлдэл). Тайван үед цэвэр
       монохром цагаан контур.
     · helvetica → Montserrat (`--font`, §1).
     · `cn`/shadcn/`dark:` → хасав (энэ төсөл site.css-тэй, shadcn биш).
     · `motion` → хасав. Зурагдах контур нь CSS keyframe (`brand-draw`),
       илрэлт нь хулганы төлөвөөс шууд — SSR-тэй бүрэн таарна тул
       hydration зөрчилгүй, §14 CSS-first-тэй нийцнэ.

   ⚙ ГУРВАН ДАВХАРГА:
     1) base   — сул цагаан контур (hover үед бага зэрэг тод)
     2) draw   — цагаан контур ачаалахад НЭГ удаа зурагдана (CSS)
     3) reveal — УЛААН, хулганы эргэн тойрны радиал маскаар л нээгдэнэ

   ⚠ Хүрэлцэхүйц дэлгэц дээр hover байхгүй тул зөвхөн цагаан контур
   харагдана (улаан гарахгүй) — тайван монохром төлөв. */

export function BrandReveal({
  text = "CHERY",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  /* Эхлэл нь төв — SSR ба клиентийн анхны рендер ИЖИЛ (50% / 50%)
     тул hydration зөрчилгүй. Зөвхөн хулгана хөдлөхөд (клиент дээр)
     шинэчлэгдэнэ. */
  const [mask, setMask] = useState({ cx: "50%", cy: "50%" });

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") return;
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    setMask({
      cx: `${((e.clientX - r.left) / r.width) * 100}%`,
      cy: `${((e.clientY - r.top) / r.height) * 100}%`,
    });
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 60"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={onMove}
      className={`brandmark ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        {/* Улаан илрэлт — ЗӨВХӨН hover үед стоп гарна */}
        <linearGradient id="brandGradient" gradientUnits="userSpaceOnUse">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#F0555C" />
              <stop offset="50%" stopColor="#D71920" />
              <stop offset="100%" stopColor="#B5132C" />
            </>
          )}
        </linearGradient>

        {/* Хулганы эргэн тойрны радиал маск — cx/cy нь төлөвөөс шууд */}
        <radialGradient
          id="brandReveal"
          gradientUnits="userSpaceOnUse"
          r="22%"
          cx={mask.cx}
          cy={mask.cy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="brandMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#brandReveal)" />
        </mask>
      </defs>

      {/* 1. Суурь контур — сул, hover үед бага зэрэг тод */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        textLength="280"
        lengthAdjust="spacingAndGlyphs"
        strokeWidth="0.3"
        className="brandmark__t brandmark__base"
        style={{ opacity: hovered ? 0.55 : 0.18 }}
      >
        {text}
      </text>

      {/* 2. Зурагдах контур — ачаалахад НЭГ удаа (CSS `brand-draw`) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        textLength="280"
        lengthAdjust="spacingAndGlyphs"
        strokeWidth="0.3"
        className="brandmark__t brandmark__draw"
      >
        {text}
      </text>

      {/* 3. Улаан илрэлт — хулганы маскаар */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        textLength="280"
        lengthAdjust="spacingAndGlyphs"
        stroke="url(#brandGradient)"
        strokeWidth="0.3"
        mask="url(#brandMask)"
        className="brandmark__t brandmark__reveal"
      >
        {text}
      </text>
    </svg>
  );
}

export default BrandReveal;
