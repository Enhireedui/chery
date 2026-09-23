"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import AnimatedArrowIcon from "./AnimatedArrowIcon";
import ModelInfo from "./ModelInfo";
import ModelSelector from "./ModelSelector";
import MongoliaScene from "./MongoliaScene";
import { showcaseModels, type ShowcaseModel } from "@/lib/models-showcase";
import { WHEEL_ANCHORS } from "@/lib/wheel-anchors";
import { track } from "@/lib/analytics";
import { FEATURED_MODEL_ID } from "@/lib/routes";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ҮЗҮҮЛЭН — нэг дэлгэцийн automotive композиц.

   Хуваарилалт (дээрээс доош): мэдээлэл → ТАЙЗ → эгнээ.
   Тайз нь `1fr` мөр тул үлдсэн БҮХ өндрийг эзэлнэ: 1440×900,
   1920×1080, 1366×768 гурвуул дээр машин боломжит хамгийн том
   хэмжээгээрээ гарна.

   ── ХӨДӨЛГӨӨН: ЭНЭ ХЭСГИЙН ГОЛ САНАА ─────────────────────────
   Машин хэсгээс хэсэг рүү БҮДГЭРДЭГГҮЙ — ЖОЛООДОЖ явна.

   ГУРВАН ДАВХАРГА, тус бүр ӨӨР зүйл хариуцна:

     1. `.ms-car`      — БҮХЭЛ машины хэвтээ зам (кузов + дугуй).
                         Дугуй кузовтойгоо ЯГ хамт явна тул
                         зангуу хэзээ ч салахгүй.
     2. `.ms-wheel`    — ЭРГЭЛТ. Өнхрөх нөхцөл:
                           эргэлт = зам / (π × РЕЗИНИЙ диаметр) × 360°
                         `.ms-car`-тай НЭГ timeline, НЭГ easing тул
                         хурдсаж, удаашрахдаа хамт — гулгалт үүсэхгүй.
     3. `.ms-car__img` — КУЗОВ ГАНЦААРАА, бага зэрэг ХОЦОРНО.

   (3) нь «дугуй нь түрүүлж орж ирээд, кузов нь араас нь гүйцэж
   ирэх» мэдрэмжийг өгнө. Энэ нь дур зоргоороо биш, дэгээний уян
   хатан байдал (suspension compliance) — хурдсах үед кузов хойшоо
   суудаг бодит үзэгдэл. Тиймээс далд утга нь ФИЗИК, чимэглэл биш.

   ⚠ ХЭМЖЭЭ НЬ ЖИЖИГ БАЙХ ЁСТОЙ. `BODY_LAG` нь кузовын өргөний
   0.6% — 1163px өргөнд ~7px. Үүнээс хэтрүүлбэл дугуй «хөвж»,
   машин хоёр хэсэг болж задарна. Мөн `wheel-anchors`-ийн дискний
   давхарга (RIM_MARGIN 1.13) яг энэ зайг нөхөхөөр тооцогдсон:
   хэтрүүлбэл доорх жинхэнэ дискний зах цухуйна.

   ⚠ ГУРВАН ЗАГВАР: Tiggo 4 · 7 · 8. Tiggo 2 нь ОДООХОНДОО
   хасагдсан (хажуугийн зураг эсрэг тийш харсан, дугуй хэмжигдээгүй).
   Зураг ирэхэд `EXCLUDE`-оос хасаад
   `scripts/detect-wheel-anchors.mjs`-ийг дахин ажиллуулна.

   ⚠ JS АЖИЛЛАХГҮЙ БОЛ: онцлох машин голдоо, нэр, холбоос бүгд
   HTML-д. Зөвхөн солилт, өнхрөлт ажиллахгүй.
   ══════════════════════════════════════════════════════════════ */

const EXCLUDE = new Set<string>(["tiggo-2"]);

/** Хажуугийн рендерийн эх харьцаа (1500 × 579). Хайрцгийн харьцааг
 *  зурагтай ЯГ тэнцүү барьснаар дугуйн хувиар өгсөн зангуу пиксел
 *  түвшинд таарна. `aspect-ratio` нь өндрийг нөөцөлдөг тул CLS үгүй. */
const CAR_RATIO = 1500 / 579;

/* ══ ХЭМНЭЛ НЬ CHERY-ГИЙН ОЛОН УЛСЫН САЙТААС ══════════════════
   chery.co.za-гийн загвар солих хэсгээс шууд хэмжиж авсан утгууд
   (Swiper + салангид дугуйн зураг — бидэнтэй ИЖИЛ бүтэц):

     .swiper-wrapper  → transition: transform 1.2s ease
     дугуйн зураг     → animation: 1.3s ease  @keyframes { 100% { rotate(-1turn) } }

   Хоёр зүйл онцлох:
     · Дугуй нь биеэсээ 100мс УДААН дуусна — машин зогсох мөчид
       дугуй бага зэрэг эргэлдсээр байгаа нь «дөнгөж зогсов»
       гэсэн мэдрэмж өгнө.
     · Easing нь CSS-ийн `ease` — эхэндээ хурдан, сүүлдээ урт
       намуухан сүүлтэй. Өмнөх муруй маань эхлэлдээ удаан байсан
       тул «түлхсэн» мэт мэдрэгддэг байв. */
const DURATION = 1500;
const DURATION_SMALL = 1340;
/** Дугуй биеэсээ хойш дуусна (ZA: 1.3s vs 1.2s) */
const WHEEL_EXTRA = 100;
/** Тайзны зургийн гулсалт, px (depth-ээр үржигдэнэ). */
const SCENE_SHIFT = 60;
/* Хөдөлгөөн багасгасан үед: ХАСАХГҮЙ, БОГИНОСГОНО. Машин аль зүг рүү
   шилжсэн нь энэ хэсгийн АГУУЛГА мөн — бүдгэрэлтээр солих нь утгыг нь
   алдагдуулна. Зам бүтэн хэвээр, зөвхөн хурд буурна. */
const DURATION_REDUCED = 760;
const durationFor = (vw: number) => (vw < 640 ? DURATION_SMALL : DURATION);

/** CSS-ийн `ease` = cubic-bezier(.25,.1,.25,1) — ZA-гийн хэрэглэдэг нь */
const EASING = "ease";
/**
 * ⚠ Кузовын хоцролтын хугацаа нь ШУЛУУН (linear).
 *
 * Анимацийн ЕРӨНХИЙ easing нь keyframe-ийн `offset`-ыг хугацааны
 * тэнхлэг дээр ЗӨӨДӨГ: cubic-bezier(0.4,0,0.2,1)-тэй үед t=0.55 нь
 * прогресс 0.78 болж, хоцролт машиныг харагдахаас ӨМНӨ шингэж байв
 * (хэмжилтээр 7.2px байх ёстой газар 3.0px гарсан).
 *
 * Тиймээс ерөнхий хугацааг шулуун болгож, зөөлрүүлэлтийг сегмент
 * тус бүрд нь өгөв — ингэснээр `offset` нь ЯГ хугацаа болно.
 */
const EASING_BODY = "linear";
const SEG = "cubic-bezier(0.4, 0, 0.2, 1)";

/** Кузов дугуйгаасаа хоцрох зай — кузовын өргөний хувиар */
const BODY_LAG = 0.006;

/** Чирэлт шилжилт болж тооцогдох босго (px) */
const SWIPE_MIN = 48;
/** Чирэлт болж тооцогдох хамгийн бага хөдөлгөөн (px) */
const DRAG_SLOP = 4;

const outKeyframes = (dir: 1 | -1, dist: number, from = 0): Keyframe[] => [
  { transform: `translate3d(${from}px,0,0)` },
  { transform: `translate3d(${-dir * dist}px,0,0)` },
];
const inKeyframes = (dir: 1 | -1, dist: number): Keyframe[] => [
  { transform: `translate3d(${dir * dist}px,0,0)` },
  { transform: "translate3d(0px,0,0)" },
];

/**
 * Орж ирэх кузов: дугуйгаасаа хоцорч ирээд, зогсохдоо гүйцнэ.
 *
 * ⚠ МУРУЙН ХЭЛБЭР НЬ ЧУХАЛ. Машин нь `t≈0.55` хүртэл тайзны гадна,
 * баруун талд явж байдаг. Хоцролт нь тэр үед л шингэвэл эффект нь
 * ХАРАГДАХГҮЙ — хэрэглэгч машиныг аль хэдийн суусан хойно нь харна
 * (хэмжилтээр: t=0.55 дээр хоцролт 1.8px үлдсэн байв).
 *
 * Тиймээс хоцролтыг замын дийлэнхэд БАРЬЖ байгаад, зөвхөн эцсийн
 * улиралд шингээнэ. Энэ нь физикийн хувьд ч зөв: кузов нь жигд явах
 * үед хоцорч, ЗОГСОХ үедээ (удаашрал) л дугуйгаа гүйцдэг.
 */
const bodyInKeyframes = (dir: 1 | -1, lag: number): Keyframe[] => [
  { transform: `translate3d(${dir * lag}px,0,0)`, offset: 0, easing: SEG },
  { transform: `translate3d(${dir * lag * 0.94}px,0,0)`, offset: 0.55, easing: SEG },
  { transform: `translate3d(${dir * lag * 0.52}px,0,0)`, offset: 0.78, easing: SEG },
  { transform: `translate3d(${dir * lag * 0.16}px,0,0)`, offset: 0.92, easing: SEG },
  { transform: "translate3d(0px,0,0)", offset: 1 },
];
/** Гарч буй кузов: дугуй түрүүлж хөдөлж, кузов нь хоцорч эхэлнэ.
 *  Энэ нь машин ХАРАГДАЖ байх эхний улиралд болох ёстой. */
const bodyOutKeyframes = (dir: 1 | -1, lag: number): Keyframe[] => [
  { transform: "translate3d(0px,0,0)", offset: 0, easing: SEG },
  { transform: `translate3d(${dir * lag * 0.62}px,0,0)`, offset: 0.18, easing: SEG },
  { transform: `translate3d(${dir * lag * 0.95}px,0,0)`, offset: 0.42, easing: SEG },
  { transform: `translate3d(${dir * lag}px,0,0)`, offset: 1 },
];

/** Чирэх үеийн өнхрөлт — өнхрөх нөхцөлөөс шууд гарна */
const rollDeg = (dx: number, tirePx: number) =>
  tirePx > 0 ? (dx / (Math.PI * tirePx)) * 360 : 0;

/**
 * Шилжилтийн үеийн эргэлт — ЗАМААС ФИЗИКЭЭР бодогдоно:
 *     эргэлт = явсан зам / (π × РЕЗИНИЙ диаметр)
 *
 * ⚠ ЭНД ZA-ГААС ЗОРИУДААР ЗӨРНӨ. chery.co.za нь замаас үл хамааран
 * ЯГ НЭГ эргэлт хийдэг (`@keyframes { 100% { rotate(-1turn) } }`).
 * Тэднийх жижиг машинтай учир болдог; манай машин дэлгэц дүүрэн тул
 * нэг эргэлт нь бодит утгаас 2.5 дахин бага болж, дугуй газартайгаа
 * зөрөн ГУЛСАЖ, чирэгдэж байгаа мэт харагдав.
 *
 * Хэмнэл (1.5s, `ease`) нь ZA-гийнх хэвээр — зөвхөн эргэлтийн ХЭМЖЭЭ
 * биднийх.
 *
 * ⚠ БҮТЭН ЭРГЭЛТ РҮҮ БӨӨРӨНХИЙЛНӨ. Анимаци дуусахад элемент нь CSS-ийн
 * `rotate(var(--roll, 0deg))` буюу 0° руу буцдаг (`fill: forwards`
 * хэрэглээгүй). Бутархай эргэлтээр дуусвал тэр агшинд диск ҮСЭРНЭ.
 * Бүтэн эргэлт нь мөн дискийг эх рендерийнхээ өнцөгт буцаана.
 * Бөөрөнхийллийн алдаа (~13%) нүдэнд мэдэгдэхгүй.
 */
const spinDeg = (dir: 1 | -1, dist: number, tirePx: number) => {
  if (tirePx <= 0) return 0;
  const turns = Math.max(1, Math.round(dist / (Math.PI * tirePx)));
  return -dir * turns * 360;
};

const spinKeyframes = (deg: number, from = 0): Keyframe[] => [
  { transform: `translate(-50%,-50%) rotate(${from}deg)` },
  { transform: `translate(-50%,-50%) rotate(${deg}deg)` },
];

type Nav = { active: number; outgoing: number; dir: 1 | -1; from: number };

/* ---------------------------------------------------------------- */

/**
 * Кузов + хоёр диск нэг хайрцагт. Хайрцгийн харьцаа = зургийнхтай.
 *
 * ⚠ БҮХ ЗУРГИЙГ УРЬДЧИЛЖ АЧААЛНА (`loading="lazy"` ХЭРЭГЛЭХГҮЙ).
 * Хүлээж буй машинууд `translate3d(118%)`-ээр тайзны гадна зогсдог.
 * Хөтчийн lazy-loading нь элементийн БАЙРЛАЛААР шийддэг бөгөөд
 * `transform` нь түүнд нөлөөлдөггүй тул эдгээр зураг ХЭЗЭЭ Ч
 * татагддаггүй байв. Үр дүнд нь загвар солиход шинэ машины кузов
 * хоосон, зөвхөн хоёр диск нисэж байв (хэмжилтээр `naturalWidth: 0`).
 *
 * Гуравхан загвар тул урьдчилж татах өртөг бага; харин `priority`-г
 * зөвхөн онцлох загварт өгч, үлдсэнийг нь `low` болгосноор LCP-д
 * нөлөөлөхгүй.
 */
function CarView({ m, eager }: { m: ShowcaseModel; eager: boolean }) {
  const a = WHEEL_ANCHORS[m.id];
  const prio = eager
    ? ({ fetchPriority: "high" } as const)
    : ({ fetchPriority: "low", decoding: "async" } as const);
  return (
    <div className="ms-car__box">
      <picture>
        <source media="(max-width: 767px)" type="image/avif" srcSet={`/assets/img/${m.image}-mb.avif`} />
        <source media="(max-width: 767px)" type="image/webp" srcSet={`/assets/img/${m.image}-mb.webp`} />
        <source type="image/avif" srcSet={`/assets/img/${m.image}.avif`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/img/${m.image}.webp`}
          alt={m.alt}
          draggable={false}
          className="ms-car__img"
          {...prio}
        />
      </picture>

      {a &&
        (["frontPct", "rearPct"] as const).map((pos) => (
          <span
            key={pos}
            className="ms-wheel"
            style={
              {
                "--wx": `${a[pos]}%`,
                "--wy": `${a.yPct}%`,
                "--ww": `${a.dPct}%`,
              } as React.CSSProperties
            }
            aria-hidden
          >
            <picture>
              <source media="(max-width: 767px)" type="image/avif" srcSet={`/assets/img/${a.rim}-mb.avif`} />
              <source media="(max-width: 767px)" type="image/webp" srcSet={`/assets/img/${a.rim}-mb.webp`} />
              <source type="image/avif" srcSet={`/assets/img/${a.rim}.avif`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/img/${a.rim}.webp`}
                alt=""
                draggable={false}
                className="ms-wheel__img"
                {...prio}
              />
            </picture>
          </span>
        ))}
    </div>
  );
}

const Chevron = ({ d }: { d: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* ---------------------------------------------------------------- */

export default function ModelsSection() {
  const models = showcaseModels.filter((m) => !EXCLUDE.has(m.id));
  const total = models.length;

  const featuredIndex = Math.max(
    0,
    models.findIndex((m) => m.id === FEATURED_MODEL_ID)
  );

  const [nav, setNav] = useState<Nav>({
    active: featuredIndex,
    outgoing: -1,
    dir: 1,
    from: 0,
  });
  const safeActive = Math.min(nav.active, Math.max(total - 1, 0));
  const busy = nav.outgoing !== -1;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const carRefs = useRef<(HTMLDivElement | null)[]>([]);
  const runningRef = useRef<Animation[]>([]);
  const activeRef = useRef(featuredIndex);
  /** Дэлгэц дээрх РЕЗИНИЙ диаметр (px) — өнхрөлтийн цорын ганц оролт */
  const tirePxRef = useRef(0);
  /** Кузовын хайрцгийн өргөн (px) — хоцролтын хэмжээг эндээс гаргана */
  const boxWRef = useRef(0);

  useEffect(() => {
    activeRef.current = safeActive;
  }, [safeActive]);

  const active = models[safeActive];
  useEffect(() => {
    if (active) track("model_view", { model_id: active.id, model_name: active.name });
  }, [active]);

  /* Хэмжилт нь ЗӨВХӨН хэмжээ өөрчлөгдөхөд — кадр бүрд DOM уншихгүй */
  useEffect(() => {
    const trackEl = trackRef.current;
    const m = models[safeActive];
    if (!trackEl || !m) return;
    const anchor = WHEEL_ANCHORS[m.id];
    const measure = () => {
      const box = carRefs.current[safeActive]?.querySelector<HTMLElement>(".ms-car__box");
      const w = box?.getBoundingClientRect().width ?? 0;
      boxWRef.current = w;
      tirePxRef.current = anchor ? (w * anchor.tirePct) / 100 : 0;
      /* Дугуйн шугам (хэсгийн дээрээс px) — утасны дэвсгэрийн зам
         үүнийг дагана (`site.css` §22a1) */
      const sec = sectionRef.current;
      if (box && sec) {
        const b = box.getBoundingClientRect(), r = sec.getBoundingClientRect();
        sec.style.setProperty("--wheel-y", `${Math.round(b.top - r.top + b.height * 0.93)}px`);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, [models, safeActive]);

  /* ---------- Навигаци ---------- */
  const go = useCallback((to: number, dir: 1 | -1, from = 0) => {
    setNav((s) =>
      s.outgoing !== -1 || to === s.active ? s : { active: to, outgoing: s.active, dir, from }
    );
  }, []);

  const step = useCallback(
    (dir: 1 | -1, from = 0) =>
      setNav((s) =>
        s.outgoing !== -1
          ? s
          : { active: (s.active + dir + total) % total, outgoing: s.active, dir, from }
      ),
    [total]
  );
  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const onSelect = useCallback(
    (i: number, source: string) => {
      go(i, i > activeRef.current ? 1 : -1);
      const m = models[i];
      if (m) track("model_select", { model_id: m.id, model_name: m.name, source });
    },
    [go, models]
  );

  /* ---------- Гулсалт · өнхрөлт · кузовын хоцролт (нэг timeline) ---------- */
  useLayoutEffect(() => {
    if (nav.outgoing === -1) return;
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const outEl = carRefs.current[nav.outgoing];
    const inEl = carRefs.current[nav.active];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? DURATION_REDUCED : durationFor(window.innerWidth);
    const opts: KeyframeAnimationOptions = { duration, easing: EASING, fill: "backwards" };
    const bodyOpts: KeyframeAnimationOptions = { duration, easing: EASING_BODY, fill: "backwards" };
    /* Дугуй биеэсээ 100мс удаан дуусна — машин зогсох мөчид дугуй
       бага зэрэг эргэлдсээр байх нь «дөнгөж зогсов» гэсэн мэдрэмж
       өгнө (chery.co.za: 1.3s vs 1.2s). */
    const wheelOpts: KeyframeAnimationOptions = {
      duration: duration + WHEEL_EXTRA, easing: EASING, fill: "backwards",
    };
    const dist = trackEl.clientWidth;
    const tirePx = tirePxRef.current;
    const lag = boxWRef.current * BODY_LAG;

    const wheelsOf = (el: HTMLDivElement | null, fromPx = 0) =>
      Array.from(el?.querySelectorAll<HTMLElement>(".ms-wheel") ?? []).map((w) =>
        w.animate(spinKeyframes(spinDeg(nav.dir, dist, tirePx), rollDeg(fromPx, tirePx)), wheelOpts)
      );
    const bodyOf = (el: HTMLDivElement | null, frames: Keyframe[]) => {
      const img = el?.querySelector<HTMLElement>(".ms-car__img");
      return img ? [img.animate(frames, bodyOpts)] : [];
    };

    /* `will-change` нь элемент бүрд GPU давхарга үүсгэдэг. Байнга
       асаалттай байлгавал 3 машин × 3 давхарга = 9 layer санах ойд
       дэмий сууна. Зөвхөн хөдөлж байх хугацаанд нь асаана. */
    outEl?.classList.add("is-moving");
    inEl?.classList.add("is-moving");

    const anims = [
      outEl?.animate(outKeyframes(nav.dir, dist, nav.from), opts),
      inEl?.animate(inKeyframes(nav.dir, dist), opts),
      ...wheelsOf(outEl, nav.from),
      ...wheelsOf(inEl),
      ...bodyOf(outEl, bodyOutKeyframes(nav.dir, lag)),
      ...bodyOf(inEl, bodyInKeyframes(nav.dir, lag)),
      /* Тайзны давхаргууд машины чиглэлд depth-ээр жигнэсэн бага зэрэг
         гулсана: ойр нь их, алс нь бага — «машинтай хамт ирэв». */
      ...(reduce
        ? []
        : Array.from(sceneRef.current?.querySelectorAll<HTMLElement>("[data-depth]") ?? []).map(
            (g) => {
              const shift = nav.dir * SCENE_SHIFT * Number(g.dataset.depth ?? 0);
              return g.animate(
                [{ transform: `translate(${shift}px, 0)` }, { transform: "translate(0, 0)" }],
                opts
              );
            }
          )),
    ].filter((a): a is Animation => Boolean(a));
    runningRef.current = anims;

    /* Чирэлтийн үлдэгдлийг цэвэрлэнэ — `transition` нь WAAPI-тай
       зөрчилдөж, `--roll` нь дугуйг хуучин өнцгөөс эхлүүлнэ.

       ⚠ `style.transform`-ыг ЭНД ЦЭВЭРЛЭХГҮЙ. Гарч буй машинд React
       аль хэдийн «тайзны гадна» байрлалыг бичсэн байдаг; түүнийг
       устгавал анимаци дуусмагц машин тайзны ЯГ голд буун, DOM-д
       сүүлд байгаа нь шинэ машиныг бүтнээр халхална. */
    if (outEl) {
      outEl.dataset.settle = "";
      outEl.style.setProperty("--roll", "0deg");
    }

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      outEl?.classList.remove("is-moving");
      inEl?.classList.remove("is-moving");
      setNav((s) => (s.outgoing === -1 ? s : { ...s, outgoing: -1 }));
    };
    const guard = window.setTimeout(finish, duration + 120);
    Promise.allSettled(anims.map((a) => a.finished)).then(finish);

    return () => {
      cancelled = true;
      window.clearTimeout(guard);
      runningRef.current.forEach((a) => a.cancel());
      runningRef.current = [];
      outEl?.classList.remove("is-moving");
      inEl?.classList.remove("is-moving");
    };
  }, [nav.active, nav.outgoing, nav.dir, nav.from]);

  /* ---------- Анхны ирэлт: машин ЖОЛООДОЖ ОРЖ ИРНЭ (нэг удаа) ---------- */
  const revealedRef = useRef(false);
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || revealedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealedRef.current = true;
      return;
    }
    const stage = sec.querySelector<HTMLElement>(".ms-stage") ?? sec;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || revealedRef.current) return;
        revealedRef.current = true;
        io.disconnect();
        const el = carRefs.current[activeRef.current];
        const trackEl = trackRef.current;
        if (!el || !trackEl) return;
        const dist = trackEl.clientWidth;
        /* Анхны ирэлт нь шилжилттэй ижил хэмнэлтэй (ZA-д ч мөн адил:
           `rotate-load` класс нь ижил 1.3s `wheelAnim`-ыг ажиллуулдаг). */
        const duration = DURATION;
        const opts: KeyframeAnimationOptions = { duration, easing: EASING, fill: "backwards" };

        el.classList.add("is-moving");
        const anims = [
          el.animate(inKeyframes(1, dist), opts),
          ...Array.from(el.querySelectorAll<HTMLElement>(".ms-wheel")).map((w) =>
            w.animate(spinKeyframes(spinDeg(1, dist, tirePxRef.current)), {
              duration: duration + WHEEL_EXTRA, easing: EASING, fill: "backwards",
            })
          ),
        ];
        const img = el.querySelector<HTMLElement>(".ms-car__img");
        if (img)
          anims.push(
            img.animate(bodyInKeyframes(1, boxWRef.current * BODY_LAG), {
              duration,
              easing: EASING_BODY,
              fill: "backwards",
            })
          );
        Promise.allSettled(anims.map((a) => a.finished)).then(() =>
          el.classList.remove("is-moving")
        );
      },
      { threshold: 0.35 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  /* ---------- Хуруугаар шудрах ----------
     React-ийн state-ээр биш, DOM дээр шууд бичнэ: чирэх бүрд дахин
     рендер хийвэл 60fps барихгүй. */
  const drag = useRef({ on: false, x0: 0, dx: 0, held: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || busy || total < 2) return;
    /* ⚠ ЗӨВХӨН `button`-ыг алгасна, `a`-г АЛГАСАХГҮЙ. `.ms-car__link`
       нь машиныг бүтнээр бүрхдэг тул холбоос дээр чирэлт эхлүүлэхгүй
       бол машинаас нь чирэх боломжгүй болно. */
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { on: true, x0: e.clientX, dx: 0, held: false };
    const el = carRefs.current[activeRef.current];
    if (el) el.dataset.settle = "";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.on) return;
    d.dx = e.clientX - d.x0;

    /* ⚠ Заагчийг ЗӨВХӨН бодитоор хөдөлсний дараа барьж авна.
       `pointerdown` дээр шууд баривал дараагийн `click` нь тайз руу
       чиглэж, машин дээр дарахад загварын хуудас нээгдэхгүй болно. */
    if (!d.held && Math.abs(d.dx) > DRAG_SLOP) {
      e.currentTarget.setPointerCapture(e.pointerId);
      d.held = true;
      const el = carRefs.current[activeRef.current];
      el?.classList.add("is-moving");
    }
    if (!d.held) return;

    const el = carRefs.current[activeRef.current];
    if (!el) return;
    el.style.transform = `translate3d(${d.dx}px,0,0)`;
    el.style.setProperty("--roll", `${rollDeg(d.dx, tirePxRef.current)}deg`);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    if (d.held && e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);

    const el = carRefs.current[activeRef.current];
    if (Math.abs(d.dx) > SWIPE_MIN) {
      /* Босго давсан — хуруунаас салсан ЯГ тэр байрлалаас үргэлжилнэ */
      step(d.dx < 0 ? 1 : -1, d.dx);
      return;
    }
    if (el) {
      el.dataset.settle = "1";
      el.style.transform = "translate3d(0,0,0)";
      el.style.setProperty("--roll", "0deg");
      window.setTimeout(() => el.classList.remove("is-moving"), 440);
    }
  };

  const onDetails = useCallback(
    (m: ShowcaseModel, source: string) =>
      track("model_details_click", { model_id: m.id, model_name: m.name, source }),
    []
  );

  /* Чирсний дараах санамсаргүй дарлагыг тасална */
  const cancelIfDragged = (e: React.MouseEvent) => {
    if (Math.abs(drag.current.dx) > 6) e.preventDefault();
  };

  if (total === 0 || !active) return null;

  return (
    /* `--car-ar` нь ХЭСГИЙН түвшинд: хайрцаг нь харьцаагаа эндээс
       авахаас гадна, утсан дээр ТАЙЗ өөрөө өндрөө үүгээр тооцно
       (CSS-д харьцааг давхар бичвэл хоёр газар засах шаардлагатай). */
    <section
      id="models"
      ref={sectionRef}
      className="ms"
      aria-labelledby="ms-title"
      style={
        {
          "--car-ar": CAR_RATIO,
          /* Тайзны орчны өнгө — загвар бүрд өөр. CSS нь `background-color`
             дээр шилждэг тул JS-д нэмэлт логик хэрэггүй: утга солигдмогц
             шилжилт өөрөө эхэлнэ. */
          "--ms-ambient": active.ambient,
        } as React.CSSProperties
      }
    >
      {/* Орчны давхарга — кадрын ЗАХААР л тавигдана (винет маск), тиймээс
          машины эргэн тойрны «өрөө» өөрчлөгдөх ба машин өөрөө хөндөгдөхгүй. */}
      <div className="ms-ambient" aria-hidden />
      {/* Монгол тайз — бүтэн хэсгийн дэвсгэр, солих үед бага зэрэг гулсана */}
      <div className="ms-bg" ref={sceneRef} aria-hidden>
        <MongoliaScene />
      </div>
      {/* ---------- Таних блок ---------- */}
      <div className="container">
        <ModelInfo key={active.id} model={active} dir={nav.dir} />
      </div>

      <p className="vh" aria-live="polite">
        {active.name} — {active.category}
      </p>

      {/* ---------- Тайз ---------- */}
      <div
        className="ms-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="CHERY загварын үзүүлэн"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <button
          type="button"
          className="ms-side ms-side--prev"
          onClick={prev}
          disabled={busy || total < 2}
          aria-label="Өмнөх загвар"
        >
          <Chevron d="M15 6l-6 6 6 6" />
        </button>

        <div className="ms-stage__track" ref={trackRef}>
          {models.map((m, i) => {
            const isActive = i === safeActive;
            return (
              <div
                key={m.id}
                ref={(el) => {
                  carRefs.current[i] = el;
                }}
                className="ms-car"
                style={{ transform: isActive ? undefined : "translate3d(118%,0,0)" }}
                aria-hidden={!isActive}
              >
                <CarView m={m} eager={i === featuredIndex} />
                {isActive && (
                  <Link
                    href={m.href}
                    className="ms-car__link"
                    aria-label={`CHERY ${m.name} — дэлгэрэнгүй үзэх`}
                    onClick={(e) => {
                      cancelIfDragged(e);
                      if (!e.defaultPrevented) onDetails(m, "stage");
                    }}
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="ms-side ms-side--next"
          onClick={next}
          disabled={busy || total < 2}
          aria-label="Дараагийн загвар"
        >
          <Chevron d="M9 6l6 6-6 6" />
        </button>
      </div>

      {/* ---------- Доод удирдлагын мөр ----------
          ⚠ ҮЙЛДЭЛ ба ДАРААГИЙН ЗАГВАР НЭГ МӨРӨНД.

          Мэдээллийн блок нь masthead (ангилал · нэр · зураас ·
          тайлбар|үнэ) хэвээр намхан үлдэж, доод тал нь нэгдсэн
          удирдлагын мөр болно.

          Зүүн талд үйлдэл, баруун талд сонголт — төвлөрүүлээгүй,
          зориудын тэнцвэргүй байдал. */}
      <div className="container ms-foot">
        <Link
          className="ms-cta"
          key={`cta-${active.id}`}
          data-dir={nav.dir}
          href={active.href}
          onClick={() => onDetails(active, "cta")}
          aria-label={`CHERY ${active.name} — дэлгэрэнгүй үзэх`}
        >
          Дэлгэрэнгүй үзэх
          <AnimatedArrowIcon />
        </Link>

        <ModelSelector
          models={models}
          activeIndex={safeActive}
          busy={busy}
          onSelect={(i) => onSelect(i, "rail")}
        />
      </div>
    </section>
  );
}
