/* ══════════════════════════════════════════════════════════════
   МОНГОЛ ТАЙЗ — загварын хэсгийн бүтэн дэвсгэр.

   Premium automotive campaign-ийн зарчим (Genesis/Lexus): машин гол
   объект, орчин нь чимэглэлгүй. Тиймээс гэр, овоо, хот байхгүй —
   зөвхөн нар жаргах үеийн алтлаг тал, нуур, цастай холын уулс,
   бодит бараан засмал зам. Зураг нь машингүй, машин тусдаа давхаргад.

   ⚙ Бүтэн хэсгийг (бичвэр, тайз, доод мөр) бүрхэнэ. Зам нь зургийн
   доод хэсэгт тул `object-position` доороо тулж, машины дугуй
   замын дээр сууна (`site.css` §22a1).

   ⚙ `data-depth`: загвар солигдоход `ModelsSection` нь зургийг
   машины чиглэлд бага зэрэг гулсуулна; зураг ирмэгээсээ ил гарахгүйн
   тулд бага зэрэг томсгосон.
   ══════════════════════════════════════════════════════════════ */

export default function MongoliaScene() {
  return (
    <picture data-depth="0.4" className="ms-bg__pic">
      <source media="(max-width: 767px)" type="image/avif" srcSet="/assets/img/ms-gold-pan.avif" />
      <source media="(max-width: 767px)" type="image/webp" srcSet="/assets/img/ms-gold-pan.webp" />
      <source type="image/avif" srcSet="/assets/img/ms-gold.avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/ms-gold.webp"
        width={2560}
        height={1097}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
