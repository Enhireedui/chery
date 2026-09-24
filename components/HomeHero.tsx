import { slides } from "@/lib/content";
import { QUOTE_HREF, modelHref, FEATURED_MODEL_ID } from "@/lib/routes";
import { Arrow } from "@/components/blocks";

/* Сонгогчийн хажуугийн заагчид. 16px — сумны жин нь тойргийн
   хилээс давахгүй байх хэмжээ. */
const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);


/* ══════════════════════════════════════════════════════════════
   НҮҮРНИЙ HERO — кино карусель.

   Бүх төлөв нь DOM-д УРЬДЧИЛАН байна; `site.js` нь зөвхөн
   `data-active`-ыг зөөнө. Тиймээс:
     · JS ачаалагдтал эхний кадр бүтэн харагдана
     · JS үхвэл ч агуулга алга болохгүй
     · React state, re-render, hydration хэрэггүй → SERVER COMPONENT

   Зөвхөн эхний кадр `fetchPriority="high"` — LCP. Бусад нь lazy.
   Мобайлд `-tall` босоо кадар (`media` query-ээр) — утсанд
   хэвтээ зураг тайрагдахгүй (Phase 18).
   ══════════════════════════════════════════════════════════════ */

/* Нээгдэхэд ХАРАГДАХ кадар. `lib/content.ts`-ийн `slides` нь
   флагманаас эхэлдэг тул энэ нь ердийн үед 0 — гэхдээ индексийг
   ХАТУУ БИЧИХГҮЙ: дараалал өөрчлөгдвөл id-гаар олдсоор байна.

   ⚠ Гурван зүйл ЭНЭ индексээс хамаарна тул тэднийг гараар
   давхардуулж бичихгүй:
     · `data-active` (кадар, нэр, хавтан)
     · `fetchPriority="high"` — LCP нь ХАРАГДАХ зураг байх ёстой
     · `aria-pressed` (сонгогч)
   `site.js` нь эхлэхдээ DOM-оос `data-active`-ыг УНШИНА тул
   энд өөрчилвөл хангалттай — JS-д тоо бичих шаардлагагүй.

   ⚠ Утга нь `lib/routes.ts`-ийн `FEATURED_MODEL_ID` — загварын
   үзүүлэн ч ЯГ ижил утгыг уншина тул hero, үзүүлэн хоёр хэзээ ч
   өөр машинаар нээгдэхгүй (аудитын §4). */
const initial = Math.max(0, slides.findIndex((s) => s.id === FEATURED_MODEL_ID));
const first = slides[initial];

export default function HomeHero() {
  if (!first) return null;

  return (
    <section
      className="hero hero--home"
      aria-roledescription="карусель"
      aria-label="CHERY-гийн загварууд"
    >
      <div className="hero__stage">
        <div className="hero__frames">
          {slides.map((s, k) => {
            const isFirst = k === initial;

            /* ══ ЗУРГИЙН АЧААЛАЛ — ЗӨВХӨН ЭХНИЙ КАДАР ШУУД ══
               ⚠ ӨМНӨ ДӨРВҮҮЛЭЭ ЗЭРЭГ ТАТАГДДАГ БАЙВ. Кадрууд нь
               `position:absolute; inset:0` тул хөтөч тэднийг
               «харагдаж байна» гэж үзэж `loading="lazy"`-г
               АЛГАСДАГ. Үр дүнд нь нүүр хуудас нээгдэхэд дөрвөн
               AVIF (69+131+68+92 = ~360 КБ) LCP-ийн зурагтай
               зэрэг дарааллаа хүлээж байв.

               Одоо 2–4-р кадрын хаяг нь `data-*`-д хэвтэнэ;
               `site.js` тэднийг `window.load`-ын ДАРАА эсвэл
               хэрэглэгч эхний удаа кадар сольмогц залгана.
               LCP-ийн замд ГАНЦ зураг үлдэнэ.

               ⚙ JS АЖИЛЛАХГҮЙ БОЛ: автомат солилт, заагч, чирэлт
               гурвуулаа ажиллахгүй тул 2–4-р кадар ХЭЗЭЭ Ч
               харагдахгүй — зураггүй байх нь алдагдал биш.
               Эхний кадар бүтэн хэвээр. */
            const src = (v: string) => `/assets/img/${v}`;
            const img = (name: string) =>
              isFirst ? { srcSet: src(name) } : { "data-srcset": src(name) };

            return (
              <div
                key={s.id}
                className="hero__slide"
                data-model={s.id}
                /* Модалын харагдах загварын нэр ЭНДЭЭС уншигдана —
                   `lib/content.ts` нь цорын ганц эх сурвалж хэвээр,
                   нэр хоёр дахь газарт бичигдэхгүй. */
                data-name={s.model}
                {...(isFirst ? { "data-active": "" } : { "data-defer": "" })}
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    type="image/avif"
                    {...img(`${s.img}-tall.avif`)}
                  />
                  <source
                    media="(max-width: 767px)"
                    type="image/webp"
                    {...img(`${s.img}-tall.webp`)}
                  />
                  <source type="image/avif" {...img(`${s.img}.avif`)} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`CHERY ${s.model} — ${s.scene}`}
                    {...(isFirst
                      ? { src: src(`${s.img}.webp`), fetchPriority: "high" as const }
                      : {
                          "data-src": src(`${s.img}.webp`),
                          decoding: "async" as const,
                          fetchPriority: "low" as const,
                        })}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        <div className="hero__scrim" aria-hidden="true" />

        {/* Урд талын уур амьсгал — parallax гүний давхарга (desktop).
            `HeroParallax` нь хулганаар `--hx/--hy` бичихэд энэ ба
            дэвсгэр зураг өөр хэмнэлээр шилжиж гүн үүсгэнэ. */}
        <div className="hero__atmos" aria-hidden="true" />

        <div className="hero__body">
          <div className="container hero__grid">
            <div className="hero__copy">
              {/* ⚠ ЭНЭ НЬ ӨМНӨ `<h1>` БАЙВ — аудитын §5.
                  Дөрвөн загварын нэр НЭГ грид нүдэнд давхарладаг тул
                  баримт бичгийн `h1` нь бодитоор ийм мөр болж байв:

                    «CHERY Tiggo 8Tiggo 7Tiggo 4Tiggo 2»

                  Дэлгэц уншигчид зөв (идэвхгүй нэр `aria-hidden`),
                  гэхдээ хуудасны хамгийн хүчтэй семантик дохио нь
                  утгагүй мөр байв — «Chery», «Монгол», «албан ёсны
                  дистрибьютор», «SUV» гэсэн үгийн аль нь ч алга.

                  Одоо `h1` нь `app/page.tsx`-д (харагдахгүй, бүтэн
                  өгүүлбэр) байрлана; энэ элемент нь ҮЗҮҮЛЭНГИЙН
                  бичвэр болж үлдэнэ. Харагдац ЯГ ХЭВЭЭР — загвар
                  нь `.hero__title` ангид байдаг. */}
              <p className="hero__title">
                <span className="hero__names">
                  {slides.map((s, k) => (
                    <span
                      key={s.id}
                      className="hero__name"
                      {...(k === initial
                        ? { "data-active": "" }
                        : { "aria-hidden": true })}
                    >
                      {s.model}
                    </span>
                  ))}
                </span>
              </p>

              {/* Байршлын мөр — загвар тус бүрийн БОДИТ шинж */}
              <div className="hero__plates">
                {slides.map((s, k) => (
                  <p
                    key={s.id}
                    className="hero__plate"
                    {...(k === initial ? { "data-active": "" } : { "aria-hidden": true })}
                  >
                    {s.line}
                  </p>
                ))}
              </div>

              {/* §5-ын шатлал: НЭГ анхдагч (улаан), НЭГ хоёрдогч
                  (тунгалаг, үсэн хилтэй). Анхдагч нь модал нээж
                  ХАРАГДАЖ БУЙ загварын нэрийг өөртөө авна; хоёрдогч
                  нь тухайн загварын хуудас руу явна. Хоёулаа
                  дарснаас нь өмнө юу болохыг хэлж байгаа. */}
              <div className="hero__actions">
                <a
                  className="btn btn--primary btn--lg btn--hero"
                  href={QUOTE_HREF}
                  data-modal-open="lead-modal"
                  data-hero-lead
                  aria-label={`CHERY ${first.model} — үнийн санал авах`}
                >
                  Үнийн санал авах
                </a>
                <a
                  className="btn btn--onphoto btn--hero"
                  data-hero-detail
                  href={modelHref(first.id)}
                  aria-label={`CHERY ${first.model} — дэлгэрэнгүй үзэх`}
                >
                  Дэлгэрэнгүй үзэх
                  <Arrow />
                </a>
              </div>
            </div>

            {/* ── Доод мөр: сонгогч ба заагч БАРУУН талд ──
                ⚠ «01 / 04» тоолуур ХАСАГДСАН: сонгогч аль хэдийн
                дөрвөн загварыг НЭРЭЭР нь харуулж, идэвхтэйг нь
                зураасаар заадаг тул тоо нь ижил мэдээллийг
                хоёр дахь удаа давтаж байв.

                Мобайлд заагч нуугдаж зөвхөн сонгогч үлдэнэ. */}
            <div className="hero__foot">
              {/* Загварын навигаци — хайрцаггүй, дугааргүй, зөвхөн
                  нэр ба доогуурх зураас. Хүрэх талбай 44px-ээс багагүй.
                  Төлөв нь өнгө ГАНЦААР дамжихгүй: идэвхтэйд явцын
                  зураас нэмэгдэнэ (§19) бөгөөд `aria-pressed` нь
                  дэлгэц уншигчид хүрнэ. */}
              <div className="hero__rail" role="group" aria-label="Загвар сонгох">
                {slides.map((s, k) => (
                  <button
                    key={s.id}
                    className="hero__dot"
                    type="button"
                    aria-pressed={k === initial}
                  >
                    <span className="hero__label">{s.model}</span>
                    <span className="vh">— {s.line}</span>
                  </button>
                ))}
              </div>

              {/* Заагч — өмнөх · дараах.

                  ⚠ ЗОГСООХ ТОВЧ ХАСАГДСАН (захиалагчийн шийдвэр).
                  WCAG 2.2.2 («Pause, Stop, Hide») нь автомат
                  хөдөлгөөнийг зогсоох МЕХАНИЗМ шаарддаг ч тэр нь
                  заавал ил товч байх албагүй. Одоо гурван зам
                  үлдсэн, гурвуулаа `site.js`-д:
                    · hover / focus — түр зогсоно
                    · заагч эсвэл сонгогч дарах — БАЙНГА зогсоно
                      (хэрэглэгч удирдлагыг авсан гэж үзнэ)
                    · `prefers-reduced-motion` — огт эхлэхгүй
                  Дэлгэц уншигч, гар ашиглагч, хүрэлцэхүйц
                  дэлгэц гурвуулаа хамрагдана.

                  JS-гүй үед утгагүй тул маркапад `hidden` ирдэг —
                  `site.js` л нээнэ. Үхмэл товч харагдахгүй. */}
              <div className="hero__ctrl" hidden data-hero-ctrl>
                <button
                  className="hero__arrow"
                  type="button"
                  data-hero-prev
                  aria-label="Өмнөх загвар"
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  className="hero__arrow"
                  type="button"
                  data-hero-next
                  aria-label="Дараагийн загвар"
                >
                  <Chevron dir="next" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

