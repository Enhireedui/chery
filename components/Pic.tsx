/* ══════════════════════════════════════════════════════════════
   AVIF + WebP хос зураг.

   ⚙ ЯАГААД `next/image` БИШ:
   Зургууд нь build-time дээр `scripts/images.mjs`-ээр аль хэдийн
   AVIF+WebP болж, зөв өргөнд resize болсон (125 файл). `next/image`
   нь runtime дээр дахин хөрвүүлэх, эсвэл Vercel-ийн зураг
   оптимизацийн квот зарцуулах болно — аль нь ч давуу тал биш.
   Урьдчилан бэлтгэсэн зураг нь CDN-ээс шууд, immutable кэштэй
   (`next.config.ts`-ийн headers) хүрдэг тул хамгийн хурдан.

   `sizes` нь ЗААВАЛ: эс тэгвээс хөтөч хамгийн том хувилбарыг
   татаж, мобайл дээр bandwidth хаяна (Phase 18).
   ══════════════════════════════════════════════════════════════ */

export interface PicProps {
  /** Файлын нэр угтваргүй: `t2-34` → `/assets/img/t2-34.avif|webp` */
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  /** Hero зурагт `true` — LCP-г түргэсгэнэ. Хуудсанд ЗӨВХӨН нэг. */
  eager?: boolean;
  width?: number;
  height?: number;
}

export default function Pic({
  name,
  alt,
  sizes = "100vw",
  className,
  eager = false,
  width,
  height,
}: PicProps) {
  return (
    <picture>
      <source srcSet={`/assets/img/${name}.avif`} type="image/avif" sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/assets/img/${name}.webp`}
        alt={alt}
        className={className}
        width={width}
        height={height}
        {...(eager
          ? { fetchPriority: "high" as const }
          : { loading: "lazy" as const, decoding: "async" as const })}
      />
    </picture>
  );
}
