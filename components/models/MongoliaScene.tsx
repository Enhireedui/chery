/* ══════════════════════════════════════════════════════════════
   МОНГОЛ ТАЙЗ — машины ард зөөлөн орчин.

   «Монголын тал нутгийн орчин үеийн өглөө»: гөлгөр саарал зам, тал
   хээр, бөөрөнхий толгод, алсын цэнхэр уулс, цайвар цэнхэр тэнгэр.
   Алсад жинхэнэ Монгол гэр (дугуй цагаан эсгий хана, тооно, улбар шар
   хаалга, модон хашаа) болон жижиг овоо — машинтай өрсөлдөхгүй.
   Хотын барилга, гадаадын гэр, замбараагүй зүйл байхгүй.

   Зураг (Seedream 5.0) нь МАШИНГҮЙ орчин: машин тусдаа давхаргад
   байж загвар солигдоход тайз хэвээр үлдэнэ.

   ⚙ ХОЁР ЗОХИОМЖ: `--wide` (desktop, 21:9) ба `--tall` (утас, 4:3,
   гэр, овоо нь төвд ойр). Зам нь зургийн доод хэсэгт — машины дугуй
   зам дээр сууна (`site.css` §22a1).

   ⚙ `data-depth`: загвар солигдоход `ModelsSection` нь зургийг
   машины чиглэлд бага зэрэг гулсуулна. Байрлалын `transform` нь
   гадна `div`-д тул анимацитай мөргөлдөхгүй.
   ══════════════════════════════════════════════════════════════ */

function Art({ variant, src, w, h }: { variant: "wide" | "tall"; src: string; w: number; h: number }) {
  return (
    <div className={`ms-scene__art ms-scene__art--${variant}`}>
      <picture data-depth="0.4">
        <source type="image/avif" srcSet={`/assets/img/${src}.avif`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/assets/img/${src}.webp`} width={w} height={h} alt="" loading="lazy" decoding="async" draggable={false} />
      </picture>
    </div>
  );
}

export default function MongoliaScene() {
  return (
    <>
      <Art variant="wide" src="ms-steppe" w={2400} h={1029} />
      <Art variant="tall" src="ms-steppe-tall" w={1400} h={1050} />
    </>
  );
}
