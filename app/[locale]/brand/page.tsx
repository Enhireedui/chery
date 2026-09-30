import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Head, CtaSection } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/brand"),
    openGraph: { ...ogBase(locale), title: `${t("title")} — CHERY Mongolia`, url: localePath(locale, "/brand") },
  };
}

/** Он цагийн жагсаалт — рекорд ба шагнал хоёуланд ижил бүтэц. */
function Timeline({ items }: { items: Array<[string, string, string]> }) {
  return (
    <ul className="timeline">
      {items.map(([y, title, body]) => (
        <li className="reveal" key={title}>
          <p className="meta">{y}</p>
          <div>
            <h3 className="h3">{title}</h3>
            <p className="body" style={{ marginTop: "var(--s-2)" }}>
              {body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function BrandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("brand");
  const { brand } = getContent(locale);

  return (
    <>
      <Nav active="/brand" path="/brand" />
      <main id="main">
        <section className="hero">
          <div className="hero__stage">
            <div className="hero__slide" data-active>
              <Pic name="brand-factory" alt={t("heroAlt")} sizes="100vw" eager />
            </div>
            <div className="hero__scrim" />
            <div className="hero__body">
              <div className="container">
                <div className="hero__copy">
                  <p className="meta">{t("eyebrow")}</p>
                  <h1 className="hero__title" style={{ fontSize: "var(--fs-h1)" }}>
                    {t("h1a")}
                    <span>{t("h1b")}</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight" id="дэлхийд">
          <div className="container">
            <div className="figures reveal">
              {brand.figures.map(([k, l]) => (
                <div className="figure" key={l}>
                  <div className="figure__k">{k}</div>
                  <div className="figure__l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <Head eyebrow={t("recordsEyebrow")} title={t("recordsTitle")} body={t("recordsBody")} />
            <Timeline items={brand.records} />
          </div>
        </section>

        <section className="section section--surface">
          <div className="container">
            <Head eyebrow={t("awardsEyebrow")} title={t("awardsTitle")} body={t("awardsBody")} />
            <Timeline items={brand.awards} />
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
