/* ══════════════════════════════════════════════════════════════
   МОНГОЛ ТАЙЗ — загварын хэсгийн бүтэн дэвсгэр.

   Premium automotive campaign-ийн зарчим (Genesis/Lexus): машин гол
   объект, орчин нь чимэглэлгүй. Тиймээс гэр, овоо, хот байхгүй —
   зөвхөн өргөн тал, маш холын уулс, бодит засмал зам, Монголын
   зөөлөн өглөөний гэрэл. Зураг нь машингүй, машин тусдаа давхаргад.

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
      <source media="(max-width: 767px)" type="image/avif" srcSet="/assets/img/ms-road-tall.avif" />
      <source media="(max-width: 767px)" type="image/webp" srcSet="/assets/img/ms-road-tall.webp" />
      <source type="image/avif" srcSet="/assets/img/ms-road.avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/ms-road.webp"
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
