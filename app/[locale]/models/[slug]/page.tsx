import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Arrow, Head, CtaSection } from "@/components/blocks";
import { MODEL_IDS, getContent, keySpecs } from "@/lib/content";
import { mnt } from "@/lib/format";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";
import { leadHref, modelHref } from "@/lib/routes";
import { carJsonLd } from "@/lib/jsonld";

/* ══════════════════════════════════════════════════════════════
   ЗАГВАРЫН ХУУДАС — НЭГ ШАБЛОН, ДӨРВӨН ЗАГВАР, ХОЁР ХЭЛ.
   `generateStaticParams` нь build-time дээр бүгдийг static болгоно.
   ══════════════════════════════════════════════════════════════ */

export function generateStaticParams() {
  return MODEL_IDS.map((slug) => ({ slug }));
}

/* Динамик хаяг байхгүй — зөвхөн дөрвөн загвар. Танигдаагүй бол 404. */
export const dynamicParams = false;

type Props = { params: Promise<{ locale: Locale; slug: string }> };

function find(locale: Locale, slug: string) {
  return getContent(locale).models.find((m) => m.id === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const m = find(locale, slug);
  if (!m) return {};
  const t = await getTranslations({ locale, namespace: "model" });
  /* «Chery Tiggo 8 Монгол | Үнэ, үзүүлэлт | Sain Motors» — хайлтад
     хүмүүсийн бичдэг үгсээр; layout-ийн загварыг дарна (`absolute`). */
  const title = t("title", { name: m.name });
  const path = modelHref(m.id);
  return {
    title: { absolute: title },
    description: `CHERY ${m.name}. ${m.lede}`,
    alternates: alternates(locale, path),
    openGraph: {
      ...ogBase(locale),
      title,
      description: m.lede,
      url: localePath(locale, path),
      images: [{ url: `/assets/img/${m.card}.webp`, alt: `CHERY ${m.name}` }],
    },
  };
}

export default async function ModelPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const m = find(locale, slug);
  if (!m) notFound();

  const t = await getTranslations();
  const { site, awards } = getContent(locale);
  const href = (p: string) => localePath(locale, p);
  const path = modelHref(m.id);

  const hasDims = (m.panels ?? []).some((p) => p.dims);
  const aw = awards.byModel.find((a) => a.id === m.id);
  const firstColor = m.colors[0];
  const specs = keySpecs(m);
  /* MN: «Цагаан (Khaki White)», EN: будгийн нэр л («Khaki White») */
  const colorLabel = (c: (typeof m.colors)[number]) =>
    locale === "mn" ? { main: c.name, sub: c.paint } : { main: c.paint, sub: "" };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd(m, locale)) }}
      />
      <Nav active="/models" path={path} />
      <main id="main">
        {/* ---------- HERO ---------- */}
        <section className="hero hero--model">
          <div className="hero__stage">
            <div className="hero__slide" data-active data-model={m.id}>
              <picture>
                {m.heroTall ? (
                  <>
                    <source media="(max-width: 767px)" srcSet={`/assets/img/${m.heroTall}.avif`} type="image/avif" />
                    <source media="(max-width: 767px)" srcSet={`/assets/img/${m.heroTall}.webp`} type="image/webp" />
                  </>
                ) : null}
                <source srcSet={`/assets/img/${m.hero}.avif`} type="image/avif" />
                <img
                  src={`/assets/img/${m.hero}.webp`}
                  alt={t("common.exterior", { model: m.name })}
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
                  <p className="meta">{t(`models.segment.${m.segment}`)}</p>
                  <h1 className="mh__name">{m.name}</h1>
                  <p className="mh__tagline">{m.tagline}</p>
                  <p className="mh__price">
                    {m.price ? (
                      <>
                        <span className="mh__amount">
                          {m.price.to
                            ? t("price.range", { from: mnt(m.price.from, locale), to: mnt(m.price.to, locale) })
                            : t("price.from", { price: mnt(m.price.from, locale) })}
                        </span>
                        <span className="mh__note">{m.price.note}</span>
                      </>
                    ) : (
                      <span className="mh__amount mh__amount--ask">{m.priceNote}</span>
                    )}
                  </p>
                  {specs.length ? (
                    <dl className="mh__specs" style={{ "--n": specs.length } as React.CSSProperties}>
                      {specs.map(({ k, v }) => (
                        <div key={k}>
                          <dt>{t(`specs.short.${k}`)}</dt>
                          <dd>{k === "power" ? `${v} ${t("specs.hp")}` : v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <div className="btn-row">
                    <a className="btn btn--primary" href={href(leadHref("test-drive", m.id))}>
                      {t("common.testDrive")}
                    </a>
                    <a className="btn btn--secondary" href={href(leadHref("quote", m.id))}>
                      {t("common.quote")}
                    </a>
                  </div>
                  <a className="link mh__all" href="#үзүүлэлт">
                    {t("model.allSpecs")} <Arrow />
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

        {/* ---------- Бүтэн дэлгэцийн хэсгүүд ---------- */}
        {(m.panels ?? []).map((p, k) => (
          <section key={p.img} className={p.dims ? "panel panel--dims" : "panel"} id={p.id}>
            <div className="panel__media">
              <picture>
                {p.imgTall ? (
                  <>
                    <source media="(max-width: 767px)" srcSet={`/assets/img/${p.imgTall}.avif`} type="image/avif" />
                    <source media="(max-width: 767px)" srcSet={`/assets/img/${p.imgTall}.webp`} type="image/webp" />
                  </>
                ) : null}
                <source srcSet={`/assets/img/${p.img}.avif`} type="image/avif" />
                <img
                  src={`/assets/img/${p.img}.webp`}
                  alt={`CHERY ${m.name} — ${p.title}`}
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
                <h2 className="h2 panel__title">{p.title}</h2>
                {p.body ? <p className="panel__text">{p.body}</p> : null}
                {p.dims ? (
                  <>
                    <dl className="dims">
                      {p.dims.map(([v, d]) => (
                        <div className="dims__i" key={d}>
                          <dt className="dims__l">{t(`specs.dims.${d}`)}</dt>
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
                {m.figures.map((f) => (
                  <div className="figure" key={f.k}>
                    <div className="figure__k">{f.v}</div>
                    <div className="figure__l">
                      {t(`specs.rows.${f.k}`)}
                      {f.note ? ` · ${f.note}` : ""}
                    </div>
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
                  <p className="meta">{t("model.awardsEyebrow")}</p>
                  <p className="h3" style={{ marginTop: "var(--s-2)" }}>
                    {aw.list[0]}
                  </p>
                </div>
                <a className="link" href={href(`/awards#${m.id}`)}>
                  {t("model.allAwards", { gen: m.gen })} <Arrow />
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* ---------- Наалдмал өгүүлэмж ---------- */}
        <section className="section">
          <div className="container">
            <Head eyebrow={t("model.storyEyebrow")} title={t("model.storyTitle")} />
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
                  <div className="story__item" key={s.img}>
                    <div className="story__item-pic">
                      <Pic name={s.img} alt={`CHERY ${m.name} — ${s.title}`} sizes="92vw" />
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
              <Head eyebrow={t("model.galleryEyebrow")} title={t("model.galleryTitle")} />
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
                  alt={`CHERY ${m.name} — ${c.paint}`}
                  {...(k === 0 ? { "data-shown": "" } : {})}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <div className="head reveal" style={{ marginBottom: 0 }}>
              <p className="meta">{t("model.colorsEyebrow")}</p>
              <h2 className="h2">{t("model.colorsTitle")}</h2>
              <div className="swatches" role="group" aria-label={t("model.colorsGroup")}>
                {m.colors.map((c, k) => {
                  const lbl = colorLabel(c);
                  return (
                    <button
                      key={c.hex}
                      className="swatch"
                      type="button"
                      aria-pressed={k === 0}
                      data-main={lbl.main}
                      data-sub={lbl.sub}
                      aria-label={lbl.sub ? `${lbl.main} — ${lbl.sub}` : lbl.main}
                    >
                      <span style={{ background: c.hex }} />
                    </button>
                  );
                })}
              </div>
              {firstColor ? (
                <p className="swatch-name" aria-live="polite">
                  {colorLabel(firstColor).main}
                  {colorLabel(firstColor).sub ? <span> ({colorLabel(firstColor).sub})</span> : null}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* ---------- Татах ---------- */}
        {m.brochure ? (
          <section className="section section--tight" id="татах">
            <div className="container">
              <Head eyebrow={t("model.downloadEyebrow")} title={t("model.downloadTitle")} />
              <a className="dl reveal" href={m.brochure.href} download>
                <span className="dl__doc" aria-hidden="true">
                  PDF
                </span>
                <span className="dl__txt">
                  <span className="dl__name">{m.brochure.label}</span>
                  <span className="dl__meta">{m.brochure.note}</span>
                </span>
                <span className="dl__act">
                  {t("common.download")} <Arrow />
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
                <Head eyebrow={t("model.specsEyebrow")} title={t("model.specsTitle")} body={t("model.specsHint")} />
                <div className="spec">
                  {m.specs.map((g) => (
                    <details className="spec__group" key={g.g}>
                      <summary>{t(`specs.groups.${g.g}`)}</summary>
                      {g.rows ? (
                        <table className="spec__table">
                          {g.cols ? (
                            <thead>
                              <tr>
                                <th scope="col">{t("specs.column")}</th>
                                {g.cols.map((col) => (
                                  <th scope="col" key={col}>
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          ) : null}
                          <tbody>
                            {g.rows.map((r) => (
                              <tr key={r.k}>
                                <th scope="row">{t(`specs.rows.${r.k}`)}</th>
                                {r.v.map((v, i) => (
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
                <Head eyebrow={t("model.specsEyebrow")} title={t("model.specsPending")} />
                <p className="note">{m.specsNote}</p>
                <div className="btn-row" style={{ marginTop: "var(--s-6)" }}>
                  <a className="btn btn--secondary" href={href(leadHref("quote", m.id))}>
                    {t("common.quote")}
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
              <p className="meta">{t("model.warrantyEyebrow")}</p>
              <h2 className="h2">{t("common.warrantyLine", { years: site.warranty.years, km: site.warranty.km })}</h2>
              <p className="body">{t("model.warrantyBody")}</p>
            </div>
            <div className="reveal">
              <a className="btn btn--secondary" href={href("/service")}>
                {t("model.warrantyLink")} <Arrow />
              </a>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      {/* Мобайл: hero-г өнгөрмөгц доод талд хоёр үйлдэл (`site.js` §13). */}
      <div className="mcta" data-mcta aria-label={t("model.actions", { name: m.name })} role="region">
        <a className="btn btn--secondary" href={href(leadHref("quote", m.id))}>
          {t("common.quoteShort")}
        </a>
        <a className="btn btn--primary" href={href(leadHref("test-drive", m.id))}>
          {t("common.testDriveShort")}
        </a>
      </div>
      <Footer />
    </>
  );
}
