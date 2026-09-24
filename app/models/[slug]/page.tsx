import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Arrow, Head, CtaSection } from "@/components/blocks";
import { site, models, awards, keySpecs, type Model } from "@/lib/content";
import { mnt } from "@/lib/format";
import { leadHref } from "@/lib/routes";
import { carJsonLd } from "@/lib/jsonld";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ХУУДАС — НЭГ ШАБЛОН, ДӨРВӨН ХУУДАС

   ⚙ Өмнө `build.mjs` нь дөрвөн тусдаа `.html` файл үүсгэдэг байв.
   Одоо `generateStaticParams` нь build-time дээр дөрвүүлээ static
   болгоно — гаралт ижил (урьдчилан үүсгэсэн HTML), эх код нь нэг.
   ══════════════════════════════════════════════════════════════ */

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.id }));
}

/* Динамик хаяг байхгүй — зөвхөн дөрвөн загвар. Танигдаагүй бол 404. */
export const dynamicParams = false;

function find(slug: string): Model | undefined {
  return models.find((m) => m.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = find(slug);
  if (!m) return {};
  /* «Chery Tiggo 8 Монгол | Үнэ, үзүүлэлт | Sain Motors» — хайлтад
     хүмүүсийн бичдэг үгсээр; layout-ийн загварыг дарна (`absolute`). */
  const title = `Chery ${m.name} Монгол | Үнэ, үзүүлэлт | Sain Motors`;
  return {
    title: { absolute: title },
    description: `CHERY ${m.name}. ${m.lede}`,
    alternates: { canonical: `/models/${m.id}` },
    openGraph: {
      title,
      description: m.lede,
      url: `/models/${m.id}`,
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = find(slug);
  if (!m) notFound();

  const hasDims = (m.panels ?? []).some((p) => p.dims);
  const aw = awards.byModel.find((a) => a.id === m.id);
  const firstColor = m.colors[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd(m)) }}
      />
      <Nav active="/models" />
      <main id="main">
        {/* ---------- HERO ---------- */}
        <section className="hero hero--model">
          <div className="hero__stage">
            <div className="hero__slide" data-active data-model={m.id}>
              <picture>
                {m.heroTall ? (
                  <>
                    <source
                      media="(max-width: 767px)"
                      srcSet={`/assets/img/${m.heroTall}.avif`}
                      type="image/avif"
                    />
                    <source
                      media="(max-width: 767px)"
                      srcSet={`/assets/img/${m.heroTall}.webp`}
                      type="image/webp"
                    />
                  </>
                ) : null}
                <source
                  srcSet={`/assets/img/${m.hero}.avif`}
                  type="image/avif"
                  sizes="100vw"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/img/${m.hero}.webp`}
                  alt={`CHERY ${m.name} — гадна тал`}
                  fetchPriority="high"
                />
              </picture>
            </div>
            <div className="hero__scrim" />
            <div className="hero__body">
              <div className="container">
                {/* Эхний дэлгэцэд: загвар · байр суурь · үнэ · гол үзүүлэлт ·
                    дараагийн алхам. Анхдагч НЭГ (улаан), хоёрдогч нэг. */}
                <div className="hero__copy mh">
                  <p className="meta">{m.segment}</p>
                  <h1 className="mh__name">{m.name}</h1>
                  <p className="mh__tagline">{m.tagline}</p>
                  <p className="mh__price">
                    {m.price ? (
                      <>
                        <span className="mh__amount">
                          {mnt(m.price.from)}-аас
                          {m.price.to ? ` · ${mnt(m.price.to)} хүртэл` : ""}
                        </span>
                        <span className="mh__note">{m.price.note}</span>
                      </>
                    ) : (
                      <span className="mh__amount mh__amount--ask">{m.priceNote}</span>
                    )}
                  </p>
                  {keySpecs(m).length ? (
                    <dl className="mh__specs">
                      {keySpecs(m).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <div className="btn-row">
                    <a className="btn btn--primary" href={leadHref("test-drive", m.id)}>
                      Тест драйв захиалах
                    </a>
                    <a className="btn btn--secondary" href={leadHref("quote", m.id)}>
                      Үнийн санал авах
                    </a>
                  </div>
                  <a className="link mh__all" href="#үзүүлэлт">
                    Бүх үзүүлэлт <Arrow />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <p className="lead reveal">{m.lede}</p>
          </div>
        </section>

        {/* ---------- Бүтэн дэлгэцийн хэсгүүд ----------
            Зураг бүтэн дэлгэцийг эзэлж, мэдээлэл дээр давхарлана.
            `dims` байвал хэмжээг шугамаар тэмдэглэнэ. */}
        {(m.panels ?? []).map((p, k) => (
          <section
            key={p.img}
            className={p.dims ? "panel panel--dims" : "panel"}
            id={p.eyebrow.toLowerCase()}
          >
            <div className="panel__media">
              <picture>
                {p.imgTall ? (
                  <>
                    <source
                      media="(max-width: 767px)"
                      srcSet={`/assets/img/${p.imgTall}.avif`}
                      type="image/avif"
                    />
                    <source
                      media="(max-width: 767px)"
                      srcSet={`/assets/img/${p.imgTall}.webp`}
                      type="image/webp"
                    />
                  </>
                ) : null}
                <source
                  srcSet={`/assets/img/${p.img}.avif`}
                  type="image/avif"
                  sizes="100vw"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/img/${p.img}.webp`}
                  alt={`CHERY ${m.name} — ${p.title || p.eyebrow}`}
                  {...(k === 0
                    ? { loading: "eager" as const, fetchPriority: "low" as const }
                    : { loading: "lazy" as const })}
                  decoding="async"
                />
              </picture>
            </div>
            <div className="panel__veil" aria-hidden="true" />
            <div className="panel__body">
              <div className="container">
                <p className="meta panel__eyebrow">{p.eyebrow}</p>
                {p.title ? <h2 className="h2 panel__title">{p.title}</h2> : null}
                {p.body ? <p className="panel__text">{p.body}</p> : null}
                {p.dims ? (
                  <>
                    <dl className="dims">
                      {p.dims.map(([v, l]) => (
                        <div className="dims__i" key={l}>
                          <dt className="dims__l">{l}</dt>
                          <dd className="dims__v num">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {p.note ? <p className="panel__note">{p.note}</p> : null}
                  </>
                ) : null}
              </div>
            </div>
          </section>
        ))}

        {/* Гол тоо — `dims` бүхий хэсэг байвал давхардана тул алгасна */}
        {m.figures && !hasDims ? (
          <section className="section section--tight">
            <div className="container">
              <div className="figures reveal">
                {m.figures.map(([k, l]) => (
                  <div className="figure" key={l}>
                    <div className="figure__k">{k}</div>
                    <div className="figure__l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Олон улсын шагнал — хамгийн хүчтэйг нь, үлдсэнийг /awards руу */}
        {aw && aw.list[0] ? (
          <section className="section section--tight">
            <div className="container">
              <div className="award-strip reveal">
                <div>
                  <p className="meta">Олон улсын үнэлгээ</p>
                  <p className="h3" style={{ marginTop: "var(--s-2)" }}>
                    {aw.list[0]}
                  </p>
                </div>
                <a className="link" href={`/awards#${m.id}`}>
                  {m.name}-ийн бүх шагнал <Arrow />
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------- Наалдмал өгүүлэмж ---------- */}
        <section className="section">
          <div className="container">
            <Head eyebrow="Онцлог" title={`${m.name}-ийн шийдлүүд`} />
            <div className="story" data-story>
              <div className="story__media">
                <div className="story__pic">
                  {m.story.map((s, k) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={s.img}
                      src={`/assets/img/${s.img}.webp`}
                      alt={`CHERY ${m.name} — ${s.title}`}
                      {...(k === 0 ? { "data-shown": "" } : {})}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              </div>
              <div className="story__items">
                {m.story.map((s) => (
                  <div className="story__item" key={s.title}>
                    <div className="story__item-pic">
                      <Pic
                        name={s.img}
                        alt={`CHERY ${m.name} — ${s.title}`}
                        sizes="92vw"
                      />
                    </div>
                    <p className="meta">{s.eyebrow}</p>
                    <h3 className="h3">{s.title}</h3>
                    <p className="body">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {m.gallery ? (
          <section className="section section--surface section--tight">
            <div className="container">
              <Head eyebrow="Галерей" title={m.name} />
              <div className="strip">
                {m.gallery.map((g) => (
                  <figure key={g}>
                    <Pic name={g} alt={`CHERY ${m.name}`} sizes="min(78vw, 460px)" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------- Биеийн өнгө ---------- */}
        <section className="section">
          <div className="container split split--wide" data-swatches>
            <div className="swatch-stage reveal">
              {m.colors.map((c, k) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={c.img}
                  src={`/assets/img/${c.img}.webp`}
                  alt={`CHERY ${m.name} — ${c.name} (${c.en})`}
                  {...(k === 0 ? { "data-shown": "" } : {})}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <div className="head reveal" style={{ marginBottom: 0 }}>
              <p className="meta">Биеийн өнгө</p>
              <h2 className="h2">Өөрийн өнгийг сонго</h2>
              <div className="swatches" role="group" aria-label="Биеийн өнгө сонгох">
                {m.colors.map((c, k) => (
                  <button
                    key={c.hex}
                    className="swatch"
                    type="button"
                    aria-pressed={k === 0}
                    data-mn={c.name}
                    data-en={c.en}
                    aria-label={`${c.name} — ${c.en}`}
                  >
                    <span style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
              {firstColor ? (
                <p className="swatch-name">
                  {firstColor.name} <span>({firstColor.en})</span>
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* ---------- Татах ----------
            `download` атрибут нь хөтөч дээр нээхийн оронд хадгалуулна. */}
        {m.brochure ? (
          <section className="section section--tight" id="татах">
            <div className="container">
              <Head eyebrow="Татах" title="Брошюр ба үнийн хуудас" />
              <a className="dl reveal" href={m.brochure.href} download>
                <span className="dl__doc" aria-hidden="true">
                  PDF
                </span>
                <span className="dl__txt">
                  <span className="dl__name">{m.brochure.label}</span>
                  <span className="dl__meta">{m.brochure.note}</span>
                </span>
                <span className="dl__act">
                  Татах <Arrow />
                </span>
              </a>
            </div>
          </section>
        ) : null}

        {/* ---------- Үзүүлэлт ---------- */}
        <div id="үзүүлэлт">
          {m.specs ? (
            <section className="section section--surface">
              <div className="container">
                <Head
                  eyebrow="Үзүүлэлт"
                  title="Бүрэн техник үзүүлэлт"
                  body="Хэсэг бүрийг дарж дэлгэнэ."
                />
                <div className="spec">
                  {m.specs.map((g) => (
                    <details className="spec__group" key={g.group}>
                      <summary>{g.group}</summary>
                      {g.rows ? (
                        <table className="spec__table">
                          {g.cols ? (
                            <thead>
                              <tr>
                                {g.cols.map((c) => (
                                  <th scope="col" key={c}>
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          ) : null}
                          <tbody>
                            {g.rows.map((r) => (
                              <tr key={r[0]}>
                                <th scope="row">{r[0]}</th>
                                {r.slice(1).map((v, i) => (
                                  <td key={i}>{v}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <ul className="spec__list">
                          {(g.list ?? []).map((li) => (
                            <li key={li}>{li}</li>
                          ))}
                        </ul>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="section section--surface">
              <div className="container">
                <Head eyebrow="Үзүүлэлт" title="Баталгаажуулж байна" />
                <p className="note">{m.specsNote}</p>
                <div className="btn-row" style={{ marginTop: "var(--s-6)" }}>
                  <a className="btn btn--secondary" href={leadHref("quote", m.id)}>
                    Үнийн санал авах
                  </a>
                  <a className="btn btn--secondary" href={site.phoneHref}>
                    {site.phone}
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>

        <section className="section section--ink section--tight">
          <div className="container split">
            <div className="head reveal" style={{ marginBottom: 0 }}>
              <p className="meta">Албан ёсны үйлдвэрийн баталгаа</p>
              <h2 className="h2">
                {site.warranty.years} эсвэл {site.warranty.km}
              </h2>
              <p className="body">
                Хөдөлгүүр, хурдны хайрцаг, цахилгаан болон механик эд ангиудын
                үйлдвэрийн согогийг бүрэн хариуцна.
              </p>
            </div>
            <div className="reveal">
              <a className="btn btn--secondary" href="/service">
                Баталгааны нөхцөл <Arrow />
              </a>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      {/* Мобайл: hero-г өнгөрмөгц доод талд хоёр үйлдэл (`site.js` §13).
          Hero дотор аль хэдийн товч байгаа тул тэнд харагдахгүй. */}
      <div className="mcta" data-mcta aria-label={`CHERY ${m.name} — үйлдэл`} role="region">
        <a className="btn btn--secondary" href={leadHref("quote", m.id)}>
          Үнийн санал
        </a>
        <a className="btn btn--primary" href={leadHref("test-drive", m.id)}>
          Тест драйв
        </a>
      </div>
      <Footer />
    </>
  );
}
