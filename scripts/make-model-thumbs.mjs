// scripts/make-model-thumbs.mjs
//
// Загвар сонгох эгнээний БЯЦХАН ЗУРАГ үүсгэнэ.
//
// ⚙ ЯАГААД ТУСДАА ФАЙЛ: эгнээн дэх зураг ердөө ~112px өргөнтэй
// харагдана. Одоо байгаа `-mb` хувилбар нь 900px — 8 дахин илүү
// нягтрал. Гурван загварыг эгнээнд үзүүлэхэд ~90КБ дэмий татагдана.
// 320px-ийн хувилбар нь 2x дэлгэцэнд ч хангалттай бөгөөд тус бүр
// 3–6КБ.
//
// ⚠ Эх зураг нь `t{n}-side` — эгнээн дэх машин нь тайзан дээрхтэйгээ
// ЯГ ижил дүрс байна. Өөр өнцгийн зураг хэрэглэвэл сонгогч нь
// «өөр машин» санал болгож байгаа мэт мэдрэгдэнэ.
//
// Ажиллуулах:  node scripts/make-model-thumbs.mjs

import sharp from "sharp";

const OUT = "public/assets/img";
const WIDTH = 320;

/* tiggo-2 БАЙХГҮЙ: үзүүлэнд ороогүй (`ModelsSection`-ы `EXCLUDE`). */
const MODELS = ["t4", "t7", "t8"];

for (const short of MODELS) {
  const src = `${OUT}/${short}-side.webp`;
  const { width, height } = await sharp(src).metadata();
  const h = Math.round((WIDTH * height) / width);

  for (const fmt of ["avif", "webp"]) {
    await sharp(src)
      .resize(WIDTH, h, { fit: "fill" })
      .toFormat(fmt, { quality: fmt === "avif" ? 58 : 84 })
      .toFile(`${OUT}/${short}-thumb.${fmt}`);
  }
  console.log(`${short}-thumb  ${WIDTH}×${h}`);
}
console.log("\n→ public/assets/img/t{4,7,8}-thumb.{avif,webp}");
