import type { Metadata } from "next";
import { Oswald } from "next/font/google";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Arrow } from "@/components/blocks";
import { awards, models } from "@/lib/content";
import { awardsJsonLd } from "@/lib/jsonld";
import { TEST_DRIVE_HREF, modelHref } from "@/lib/routes";

/* ══════════════════════════════════════════════════════════════
   ШАГНАЛ, АМЖИЛТ — амьд сайтын `brand1` хуудасны залгамж.

   ⚠ ЭНЭ ХУУДАС ДИЗАЙНЫ СИСТЕМЭЭС ЗОРИУД ГАРСАН (README «awards»):
   гүйдэг тууз, 0-оос өсөх тоолуур, тугны эможи, бүхэлдээ хар
   хуудас, Oswald дэлгэцийн фонт. Эдгээрийг ЗӨВХӨН энд хэрэглэнэ.

   ⚙ Oswald нь `next/font`-оор өөрөө host-логдоно: CSP-ийн
   `font-src` нь зөвхөн өөрийн доменыг зөвшөөрдөг тул статик
   хувилбарын Google Fonts <link> энд ажиллахгүй. Хувьсагч нь
   зөвхөн энэ хуудасны боодол дээр холбогдоно — бусад хуудсанд
   Oswald ачаалагдахгүй (DESIGN-SYSTEM.md §1).

   ⚙ `t-dark` нь статик хувилбарт <body>-гийн класс байсан. App
   Router-т <body> нь үндсэн layout-д нэг л удаа бичигддэг тул
   хуудсаа боодол <div>-ээр хардуулав — сонгогч бүр `.t-dark …`
   хэлбэртэй тул үр дүн ижил.
   ══════════════════════════════════════════════════════════════ */

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Шагнал, амжилт",
  description:
    "CHERY-гийн олон улсын шагнал: Fortune Global 500 #233, Kantar BrandZ авто ангиллын #1, " +
    "J.D. Power Triple Crown, 22 дараалсан жил Хятадын экспортын тэргүүн, A-NCAP ба C-NCAP 5 од.",
  alternates: { canonical: "/awards" },
  openGraph: { title: "Шагнал, амжилт — CHERY Mongolia", url: "/awards" },
};

/** Хэсгийн толгой: улаан нүдний хараа + зураас, дараа нь 2 мөрт гарчиг. */
function AwHead({
  eyebrow,
  l1,
  l2,
  lede,
}: {
  eyebrow: string;
  l1: string;
  l2?: string;
  lede?: string;
}) {
  return (
    <div className="aw-head reveal">
      <p className="aw-eyebrow">{eyebrow}</p>
      <h2 className="aw-display">
        {l1}
        {l2 ? <span>{l2}</span> : null}
      </h2>
      {lede ? <p className="body">{lede}</p> : null}
    </div>
  );
}

export default function AwardsPage() {
  const a = awards;

  /* JS ажиллахгүй бол эцсийн тоо ШУУД харагдана — `site.js` нь
     `data-to`-г уншиж 0-оос өсгөнө. */
  const fmt = (f: (typeof a.figures)[number]) => f.pre + f.to.toFixed(f.dec) + f.suf;

  /* Тууз — агуулгыг ХОЁР УДАА бичнэ. `translateX(-50%)` нь яг нэг
     хуулбарын өргөнөөр гүйх тул давхарлалт үл мэдэгдэнэ. */
  const tickerRun = (key: string) =>
    a.ticker.map((t) => (
      <span key={`${key}-${t}`}>
        <span>{t}</span>
        <span className="ticker__dot">·</span>
      </span>
    ));

  return (
    <div
      className={`t-dark ${oswald.variable}`}
      style={
        {
          "--aw-display": "var(--font-oswald), Manrope, system-ui, sans-serif",
        } as React.CSSProperties
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(awardsJsonLd()) }}
      />

      <Nav active="/awards" />

      <main id="main">
        <section className="hero aw-hero">
          <div className="hero__stage" style={{ aspectRatio: "21 / 9" }}>
            <div className="hero__slide" data-active="">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={`/assets/img/${a.hero.img}-tall.avif`}
                  type="image/avif"
                />
                <source
                  media="(max-width: 767px)"
                  srcSet={`/assets/img/${a.hero.img}-tall.webp`}
                  type="image/webp"
                />
                <source srcSet={`/assets/img/${a.hero.img}.avif`} type="image/avif" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/img/${a.hero.img}.webp`}
                  alt="CHERY Tiggo 8 — үдшийн гэрэлд"
                  fetchPriority="high"
                />
              </picture>
            </div>
            <div className="hero__scrim" />
            <div className="hero__body">
              <div className="container">
                <div className="hero__copy aw-hero__copy">
                  <p className="aw-badge">{a.hero.badge}</p>
                  <h1 className="aw-display aw-display--hero">
                    Дэлхийд танигдсан<span>брэнд</span>
                  </h1>
                  <p className="body">{a.lede}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            {tickerRun("a")}
            {tickerRun("b")}
          </div>
        </div>

        <section className="section section--ink section--tight">
          <div className="container">
            <p className="aw-eyebrow reveal">Тоо баримт</p>
            <div className="aw-tiles">
              {a.figures.map((f) => (
                <div className="aw-tile reveal" key={f.label}>
                  <p
                    className="aw-tile__k num"
                    data-count=""
                    data-to={f.to}
                    data-dec={f.dec}
                    data-pre={f.pre}
                    data-suf={f.suf}
                  >
                    {fmt(f)}
                  </p>
                  <p className="aw-tile__l">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container">
            <AwHead
              eyebrow="Дэлхийн хүлээн зөвшөөрөл"
              l1="Дэлхийн алдарт"
              l2="CHERY"
              lede="Шагнал бүрийн ард түүнийг олгосон байгууллага, он нь бичигдсэн."
            />
            <div className="aw-grid aw-grid--2">
              {a.global.map((g) => (
                <article className="aw-card reveal" key={g.title}>
                  <p className="aw-year num">{g.year}</p>
                  <h3 className="h3">{g.title}</h3>
                  <p className="body">{g.body}</p>
                  <p className="aw-src">Эх сурвалж: {g.src}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container">
            <AwHead
              eyebrow="J.D. Power"
              l1="Хятадын цорын ганц"
              l2="Triple Crown"
              lede={a.jdp.lede}
            />
            <div className="aw-grid aw-grid--3">
              {a.jdp.rows.map(([rank, name, body]) => (
                <article className="aw-card aw-card--rank reveal" key={name}>
                  <p className="aw-rank">{rank}</p>
                  <h3 className="h3">{name}</h3>
                  <p className="body">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container">
            <AwHead
              eyebrow="Загварууд"
              l1="Дэлхийн 20+ оронд"
              l2="хүлээн зөвшөөрөгдсөн"
              lede="Монголд борлуулагдаж буй дөрвөн загварын олон улсын үнэлгээ."
            />
            <div className="aw-grid aw-grid--2">
              {a.byModel.map((m) => {
                const model = models.find((x) => x.id === m.id);
                return (
                  <article className="aw-card aw-card--model reveal" id={m.id} key={m.id}>
                    {model ? (
                      <div className="aw-model__pic">
                        <Pic
                          name={model.card}
                          alt={`CHERY ${model.name} — гадна тал`}
                          sizes="(min-width:760px) 46vw, 92vw"
                        />
                      </div>
                    ) : null}
                    <p className="aw-tag">{m.tag ? `${m.segment} · ${m.tag}` : m.segment}</p>
                    <h3 className="aw-model__name">{model ? model.name : m.id}</h3>
                    <ul className="aw-list">
                      {m.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                    {model ? (
                      <p className="aw-card__cta">
                        <a className="link" href={modelHref(m.id)}>
                          Загварын хуудас <Arrow />
                        </a>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container">
            <AwHead eyebrow="Экспортын рекорд" l1="22 жил дараалан" l2="тэргүүлэгч" />
            <ul className="aw-recs">
              {a.records.map(([year, title, body, tag]) => (
                <li className="aw-rec reveal" key={title}>
                  <p className="aw-year num">{year}</p>
                  <div>
                    <h3 className="h3">{title}</h3>
                    <p className="body">{body}</p>
                  </div>
                  <p className="aw-tag aw-tag--right">{tag}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--ink">
          <div className="container">
            <AwHead
              eyebrow="Бүс нутгийн тэргүүлэлт"
              l1="Бразилаас Египет,"
              l2="Индонезээс Өмнөд Африк"
            />
            <div className="aw-grid aw-grid--4">
              {a.markets.map(([flag, place, title, body]) => (
                <article className="aw-card reveal" key={place}>
                  <p className="aw-flag">
                    <span className="aw-flag__f" aria-hidden="true">
                      {flag}
                    </span>
                    {place}
                  </p>
                  <h3 className="h3">{title}</h3>
                  <p className="body">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--ink" id="аюулгүй-байдал">
          <div className="container">
            <AwHead
              eyebrow="Аюулгүй байдал"
              l1="Хараат бус"
              l2="мөргөлдөөний шалгалт"
              lede="Гурван тивийн хамгийн хатуу хөтөлбөрийн үнэлгээ."
            />
            <div className="aw-grid aw-grid--3">
              {a.safety.map(([score, org, model, when, body]) => (
                <article className="aw-card aw-card--rank reveal" key={`${org}-${model}`}>
                  <p className="aw-rank">{score}</p>
                  <h3 className="h3">{org}</h3>
                  <p className="aw-src">
                    {model} · {when}
                  </p>
                  <p className="body">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--ink section--tight">
          <div className="container">
            <div className="aw-cta reveal">
              <div>
                <p className="aw-eyebrow">Дараагийн алхам</p>
                <p className="h2" style={{ marginTop: "var(--s-4)" }}>
                  Эдгээрийг бодитоор мэдрэх
                </p>
              </div>
              <div className="btn-row">
                <a className="btn btn--primary" href={TEST_DRIVE_HREF}>
                  Тест драйв захиалах
                </a>
                <a className="btn btn--secondary" href="/models">
                  Загварууд үзэх
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
