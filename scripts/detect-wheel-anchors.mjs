// scripts/detect-wheel-anchors.mjs
//
// Build-time хэрэгсэл. Хажуугийн рендер ДЭЭРХ дугуйг хэмжиж олоод, эргэх
// ДИСКИЙГ зургаас нь өөрөөс нь тасдан авч, `lib/wheel-anchors.ts` ба
// `public/assets/img/t{n}-rim.*`-ийг үүсгэнэ.
//
// ── ЯАГААД ДИСКИЙГ ЗУРГААС НЬ ТАСДАЖ БАЙНА ─────────────────────────────
// chery.co.za нь дугуйг тусад нь тунгалаг PNG-ээр тавьдаг. Гэвч Tiggo
// 7-гийн тэр файл нь кузовын рендер дээрх дугуйнаас ӨӨР ЗАГВАРЫН дугуй
// байв (NCC 0.21). Өөр дугуй давхарлавал машин өөр дугуйтай харагдана.
//
// Тиймээс эх сурвалжийг НЭГ болгов: эргэх диск нь кузовын зургаасаа
// гарна → пиксел түвшинд ҮРГЭЛЖ таарна, нэмэлт файл ч татахгүй.
//
// ── ЯАГААД ЗӨВХӨН ДИСК, БҮТЭН ДУГУЙ БИШ ───────────────────────────────
// Рендер дээр резиний ДЭЭД ирмэгийг тэвхний нуман хаалт халхалдаг. Бүтэн
// дугуйг давхарлавал дугуй хаалтны ӨМНӨ гарч, эргэхэд хаалтны дээгүүр
// резин «түрхэгдэнэ». Диск нь харин бүтэн харагддаг. Резин жигд хар тул
// эргэхгүй байхад нүдэнд мэдэгдэхгүй — эргэх зүйл нь хигээс.
//
// ── ХЭМЖИХ АРГА (гурван бие даасан хэмжүүр бие биеэ баталдаг) ────────
//   1. ЦАГИРАГИЙН ОНОО — бүдүүн байрлал. Резин ХАР, гадна нь цайвар.
//      Урд, хойд дугуйг ИЖИЛ радиус, ИЖИЛ өндөрт гэж хамт хайна
//      (симметр хязгаар нь ганц дугуйн худал оргилыг тасална).
//   2. ЭРГЭЛТИЙН ӨӨРИЙН ТӨСТӨЙ БАЙДАЛ — нарийн ТӨВ. Хигээс нь 5 талт
//      тэгш хэмтэй тул ЗӨВ төв дээр зургийг 72° / 144° эргүүлэхэд
//      өөртэйгөө хамгийн сайн таарна. Гадны темплейт шаардахгүй тул
//      бүх загварт ижил ажиллана.
//   3. ӨНЦГИЙН ХЭЛБЭЛЗЛИЙН ПРОФАЙЛ — диск/резиний ХИЛ. Хигээстэй диск
//      дээр өнцгийн std өндөр, жигд резин дээр намхан. Иймд std-ийн
//      НАМХАН БҮС нь яг резин: түүний дотоод ирмэг = дискний радиус,
//      гадаад ирмэг = резиний радиус.
//
// Ажиллуулах:  node scripts/detect-wheel-anchors.mjs --debug
//   --debug → `_chery-za-assets/fit-<id>.png` дээр дискийг 25° ЭРГҮҮЛЖ
//             давхарлана. ЗААВАЛ НҮДЭЭР ШАЛГА: буруу төв, буруу радиус
//             нь зөвхөн ЭРГҮҮЛСЭН үед мэдэгддэг.

import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const DEBUG = process.argv.includes("--debug");
const OUT_IMG = "public/assets/img";

/* [id, богино нэр, кузовын зураг]
   ⚠ tiggo-2 БАЙХГҮЙ: ZA-гаас cut-out нь татагдаагүй бөгөөд сайт дээрх
   хажуугийн зураг нь эсрэг тийш харсан. Нэмэгдвэл энд мөр нэмнэ. */
const MODELS = [
  ["tiggo-4", "t4", `${OUT_IMG}/t4-side.webp`],
  ["tiggo-7", "t7", `${OUT_IMG}/t7-side.webp`],
  ["tiggo-8", "t8", `${OUT_IMG}/t8-side.webp`],
];

/* Бүдүүн хайлтын муж — кузовын зургийн хэмжээнд харьцангуй хувь */
const R_MIN = 0.05, R_MAX = 0.085;
const Y_MIN = 0.58, Y_MAX = 0.82;
const XF_MIN = 0.15, XF_MAX = 0.36;
const XR_MIN = 0.62, XR_MAX = 0.88;

/** Резинийг «жигд» гэж үзэх өнцгийн std-ийн босго */
const FLAT_SD = 40;
/**
 * Дискийг бүрэн далдлахын тулд нэмэх нөөц.
 *
 * Хоёр шаардлага:
 *   1. Дутуу бол эргэхгүй дискний зах үлдэж, шууд мэдэгдэнэ.
 *   2. ХӨДӨЛГӨӨНД ЗОРИУЛСАН НӨӨЦ. Шилжилтийн үед кузов нь дугуйгаасаа
 *      бага зэрэг ХОЦОРНО (дэгээний уян хатан байдал — `ModelsSection`-ы
 *      `BODY_LAG`). Кузов хоцрохдоо ДОТРОО шигдсэн дугуйгаа ч дагуулж
 *      хоцордог тул давхарга нь тэр зайг нөхөж чадахгүй бол доорх
 *      жинхэнэ дискний зах цухуйна.
 *
 * 1.13 нь `BODY_LAG = 0.006 × кузовын өргөн`-ийг гурван загвар дээр ч
 * нөхнө (хамгийн нарийн нөөцтэй нь t8: 0.13 × 76 / 1500 = 0.0066).
 * Илүү гарсан зурвас нь ЖИГД резин тул эргэхэд мэдэгдэхгүй.
 *
 * ⚠ Үүнийг өсгөхдөө `rTire`-ээс хэтрэхгүйг шалга — хэтэрвэл давхарга
 * нь резинээс гарч, нуман хаалт дээгүүр түрхэгдэнэ.
 */
const RIM_MARGIN = 1.13;

async function gray(file, w, h) {
  let p = sharp(file).ensureAlpha();
  if (w) p = p.resize(w, h, { fit: "fill" });
  const { data, info } = await p.raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const g = new Float32Array(n);
  const a = new Uint8Array(n);
  for (let i = 0, k = 0; k < n; i += info.channels, k++) {
    g[k] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    a[k] = data[i + 3];
  }
  return { g, a, w: info.width, h: info.height };
}

/** Дэд пиксел гэрэлтэлт. Тунгалаг = цайвар дэвсгэр (255). */
function sample(img, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  if (x0 < 0 || y0 < 0 || x0 + 1 >= img.w || y0 + 1 >= img.h) return 255;
  const fx = x - x0, fy = y - y0;
  const at = (xx, yy) => {
    const i = yy * img.w + xx;
    return img.a[i] < 128 ? 255 : img.g[i];
  };
  return (
    at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) +
    at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy
  );
}

/** Тойргийн дундаж ба өнцгийн стандарт хазайлт */
function ringStats(img, cx, cy, r, n = 240) {
  let s = 0, s2 = 0;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const v = sample(img, cx + r * Math.cos(t), cy + r * Math.sin(t));
    s += v; s2 += v * v;
  }
  const mean = s / n;
  return { mean, sd: Math.sqrt(Math.max(0, s2 / n - mean * mean)) };
}

/* ---------- 1) Бүдүүн байрлал: цагирагийн оноо ---------- */

function wheelScore(img, cx, cy, R) {
  const tire = ringStats(img, cx, cy, 0.93 * R);
  const out = ringStats(img, cx, cy, 1.1 * R);
  if (tire.mean > 120) return -2;
  return (out.mean - tire.mean) / 255 - 0.6 * (tire.sd / 255);
}

function coarseSearch(img, cw, ch) {
  let best = { s: -9 };
  for (let R = R_MIN * cw; R <= R_MAX * cw; R += 1) {
    for (let cy = Y_MIN * ch; cy <= Y_MAX * ch; cy += 1) {
      const pick = (x0, x1) => {
        let b = { s: -3, x: 0 };
        for (let cx = x0; cx <= x1; cx += 1) {
          const s = wheelScore(img, cx, cy, R);
          if (s > b.s) b = { s, x: cx };
        }
        return b;
      };
      const f = pick(XF_MIN * cw, XF_MAX * cw);
      const r = pick(XR_MIN * cw, XR_MAX * cw);
      if (f.s + r.s > best.s) best = { s: f.s + r.s, R, cy, fx: f.x, rx: r.x };
    }
  }
  return best;
}

/* ---------- 2) Нарийн төв: эргэлтийн өөрийн төстэй байдал ---------- */

function selfSim(img, cx, cy, rMax) {
  const NA = 180, NR = 26;
  const grid = new Float32Array(NA * NR);
  for (let ri = 0; ri < NR; ri++) {
    const r = rMax * (0.25 + 0.72 * (ri / (NR - 1)));
    for (let ai = 0; ai < NA; ai++) {
      const t = (ai / NA) * Math.PI * 2;
      grid[ri * NA + ai] = sample(img, cx + r * Math.cos(t), cy + r * Math.sin(t));
    }
  }
  const corrAt = (shift) => {
    const n = NA * NR;
    let sx = 0, sy = 0;
    const other = new Float32Array(n);
    for (let ri = 0; ri < NR; ri++)
      for (let ai = 0; ai < NA; ai++) other[ri * NA + ai] = grid[ri * NA + ((ai + shift) % NA)];
    for (let i = 0; i < n; i++) { sx += grid[i]; sy += other[i]; }
    const mx = sx / n, my = sy / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      const a = grid[i] - mx, b = other[i] - my;
      num += a * b; dx += a * a; dy += b * b;
    }
    return num / Math.sqrt(dx * dy);
  };
  /* 180 өнцгийн сүлжээнд 36 алхам = 72°, 72 алхам = 144° (5 талт диск) */
  return (corrAt(36) + corrAt(72)) / 2;
}

function refineCenter(img, cx0, cy0, R) {
  let best = { s: -2, cx: cx0, cy: cy0 };
  for (let cx = cx0 - 10; cx <= cx0 + 10; cx += 0.5)
    for (let cy = cy0 - 12; cy <= cy0 + 12; cy += 0.5) {
      const s = selfSim(img, cx, cy, R * 0.8);
      if (s > best.s) best = { s, cx, cy };
    }
  return best;
}

/* ---------- 3) Диск / резиний хил: өнцгийн std-ийн намхан бүс ---------- */

function radii(img, cx, cy) {
  /* std < FLAT_SD байх ХАМГИЙН УРТ ХЭСГИЙГ резин гэж үзнэ. */
  const step = 2, from = 36, to = 160;
  const flat = [];
  for (let r = from; r <= to; r += step) flat.push(ringStats(img, cx, cy, r).sd < FLAT_SD);

  let bi = -1, bl = 0, i = 0;
  while (i < flat.length) {
    if (!flat[i]) { i++; continue; }
    let j = i;
    while (j < flat.length && flat[j]) j++;
    if (j - i > bl) { bl = j - i; bi = i; }
    i = j;
  }
  if (bi < 0) return null;
  return {
    rRim: from + (bi - 1) * step,          // намхан бүсийн дотоод ирмэг
    rTire: from + (bi + bl) * step,        // гадаад ирмэг
  };
}

/* ---------- 4) Дискийг тасдах ---------- */

async function cutDisc(carFile, cx, cy, radius, outPng) {
  const D = Math.round(radius * 2);
  const { data, info } = await sharp(carFile)
    .ensureAlpha()
    .extract({
      left: Math.round(cx - D / 2), top: Math.round(cy - D / 2),
      width: D, height: D,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const c = (D - 1) / 2;
  const feather = 1.5; // шаталсан ирмэг эргэхэд «хөрөөдөхөөс» сэргийлнэ
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const k = Math.max(0, Math.min(1, (c - Math.hypot(x - c, y - c)) / feather + 1));
      data[i + 3] = Math.round(data[i + 3] * k);
    }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile(outPng);
  return D;
}

/* ══════════════════════════════════════════════════════════════ */

const results = {};

for (const [id, short, carFile] of MODELS) {
  const meta = await sharp(carFile).metadata();
  const CW = meta.width, CH = meta.height;

  const K = 4;
  const small = await gray(carFile, Math.round(CW / K), Math.round(CH / K));
  const c = coarseSearch(small, small.w, small.h);

  const full = await gray(carFile);
  const R0 = c.R * K;
  const f = refineCenter(full, c.fx * K, c.cy * K, R0);
  const r = refineCenter(full, c.rx * K, c.cy * K, R0);

  /* Ортогональ рендер дээр хоёр дугуй ЯГ ижил өндөрт. Хоёр бие даасан
     хэмжилтийн дунджийг авч, зөрүүг нь хэвлэн мэдээлнэ — том зөрүү нь
     хэмжилт бүтэлгүйтсэний дохио. */
  const cy = (f.cy + r.cy) / 2;
  const dy = Math.abs(f.cy - r.cy);

  const rad = radii(full, f.cx, cy);
  if (!rad) throw new Error(`${id}: резиний жигд бүс олдсонгүй`);
  const rCut = rad.rRim * RIM_MARGIN;

  console.log(
    `${id.padEnd(8)} төв=(${f.cx.toFixed(1)}, ${r.cx.toFixed(1)}) y=${cy.toFixed(1)} Δy=${dy.toFixed(1)}  ` +
      `диск=${rad.rRim} резин=${rad.rTire} тасдах=${rCut.toFixed(1)}  ` +
      `sim=${f.s.toFixed(3)}/${r.s.toFixed(3)}`
  );

  const tmp = `_chery-za-assets/${short}-rim.png`;
  const D = await cutDisc(carFile, f.cx, cy, rCut, tmp);
  for (const [suffix, size] of [["", D], ["-mb", Math.round(D * 0.6)]])
    for (const fmt of ["avif", "webp"])
      await sharp(tmp)
        .resize(size, size, { fit: "fill" })
        .toFormat(fmt, { quality: fmt === "avif" ? 62 : 88 })
        .toFile(`${OUT_IMG}/${short}-rim${suffix}.${fmt}`);

  results[id] = {
    rim: `${short}-rim`,
    dPct: ((rCut * 2) / CW) * 100,
    tirePct: ((rad.rTire * 2) / CW) * 100,
    yPct: (cy / CH) * 100,
    frontPct: (f.cx / CW) * 100,
    rearPct: (r.cx / CW) * 100,
  };

  if (DEBUG) {
    const spun = await sharp(tmp).rotate(25, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    const sm = await sharp(spun).metadata();
    const place = (cx) => ({
      input: spun,
      left: Math.round(cx - sm.width / 2),
      top: Math.round(cy - sm.height / 2),
    });
    await sharp(carFile)
      .ensureAlpha()
      .composite([place(f.cx), place(r.cx)])
      .flatten({ background: "#eceff3" })
      .png()
      .toFile(`_chery-za-assets/fit-${id}.png`);
  }
}

const body = Object.entries(results)
  .map(([id, v]) => `  "${id}": {
    rim: "${v.rim}",
    dPct: ${v.dPct.toFixed(3)},
    tirePct: ${v.tirePct.toFixed(3)},
    yPct: ${v.yPct.toFixed(3)},
    frontPct: ${v.frontPct.toFixed(3)},
    rearPct: ${v.rearPct.toFixed(3)},
  },`)
  .join("\n");

await writeFile(
  "lib/wheel-anchors.ts",
  `/* ⚠ ЭНЭ ФАЙЛЫГ ГАРААР ЗАСАХГҮЙ.
 * Үүсгэсэн: node scripts/detect-wheel-anchors.mjs --debug
 * Хэмжсэн: ${new Date().toISOString().slice(0, 10)}
 *
 * Хажуугийн рендер дээрх дугуйн ДИСКНИЙ байрлал. Бүх утга нь кузовын
 * зургийн хэмжээнд харьцангуй ХУВЬ — тиймээс десктоп (1500px) ба
 * мобайл (900px) хувилбар хоёулаа ижил тоог хэрэглэнэ.
 *
 * Зөвхөн ДИСК эргэнэ, резин биш: резиний дээд ирмэгийг тэвхний нуман
 * хаалт халхалдаг тул бүтэн дугуйг давхарлавал хаалтны дээгүүр гарна.
 */

export type WheelAnchor = {
  /** Дискний зургийн нэр (угтваргүй) → /assets/img/{rim}.avif|webp */
  rim: string;
  /** Дискний диаметр — кузовын зургийн ӨРГӨНИЙ %. ЗУРАГДАХ хэмжээ. */
  dPct: number;
  /** РЕЗИНИЙ диаметр — кузовын зургийн ӨРГӨНИЙ %.
   *  ⚠ Өнхрөлтийн физикт ЗӨВХӨН энэ утга хэрэглэнэ: дугуй нь газартай
   *  резинээрээ хүрдэг тул явсан зам = резиний тойрог × эргэлт.
   *  Дискний диаметрээр тооцвол дугуй ~1.3 дахин хурдан эргэнэ. */
  tirePct: number;
  /** Дугуйн төвийн өндөр — кузовын зургийн ӨНДРИЙН % */
  yPct: number;
  /** Урд дугуйн төв — кузовын зургийн ӨРГӨНИЙ % */
  frontPct: number;
  /** Хойд дугуйн төв — кузовын зургийн ӨРГӨНИЙ % */
  rearPct: number;
};

export const WHEEL_ANCHORS: Record<string, WheelAnchor> = {
${body}
};
`,
  "utf8"
);
console.log("\n→ lib/wheel-anchors.ts ба t{4,7,8}-rim.{avif,webp}");
