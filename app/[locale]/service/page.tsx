import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Head, CtaSection } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";
import { TEST_DRIVE_HREF } from "@/lib/routes";
import { faqJsonLd } from "@/lib/jsonld";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "service" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/service"),
    openGraph: { ...ogBase(locale), title: `${t("title")} — CHERY Mongolia`, url: localePath(locale, "/service") },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { site, faq, testDrive } = getContent(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale)) }}
      />
      <Nav active="/service" path="/service" />
      <main id="main">
        <section className="section section--ink" id="баталгаа">
          <div className="container">
            <div className="head reveal">
              <p className="meta">{t("service.warrantyEyebrow")}</p>
              <h1 className="h1">{t("common.warrantyLine", { years: site.warranty.years, km: site.warranty.km })}</h1>
              <p className="body">{t("service.warrantyBody")}</p>
            </div>
            <div className="grid grid--2">
              <div className="reveal">
                <p className="h3 cover__t">{t("service.covered")}</p>
                <p className="body cover__b">{t("service.coveredBody")}</p>
              </div>
              <div className="reveal">
                <p className="h3 cover__t">{t("service.notCovered")}</p>
                <p className="body cover__b">{t("service.notCoveredBody")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split">
            <div className="head reveal" style={{ marginBottom: 0 }}>
              <p className="meta">{t("service.testDriveEyebrow")}</p>
              <h2 className="h2">{testDrive.title}</h2>
              <p className="body">{testDrive.lede}</p>
              <ul className="rows">
                {testDrive.steps.map(([title, body], k) => (
                  <li key={title}>
                    <span className="meta">
                      0{k + 1} · {title}
                    </span>
                    {body}
                  </li>
                ))}
              </ul>
              <div className="btn-row">
                <a className="btn btn--primary" href={localePath(locale, TEST_DRIVE_HREF)}>
                  {t("common.testDrive")}
                </a>
              </div>
            </div>
            <div className="media r-1610 reveal" style={{ borderRadius: "var(--radius)" }}>
              <Pic name="life-dusk" alt={t("service.routeAlt")} sizes="(min-width:900px) 45vw, 92vw" />
            </div>
          </div>
        </section>

        <section className="section section--surface" id="асуулт">
          <div className="container">
            <Head eyebrow={t("service.faqEyebrow")} title={t("service.faqTitle")} body={t("service.faqBody")} />
            <div className="spec">
              {faq.map((f) => (
                <details className="spec__group" key={f.q}>
                  <summary>{f.q}</summary>
                  <p className="body faq__a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
