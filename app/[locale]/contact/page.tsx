import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, CtaSection } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";
import { dealerJsonLd } from "@/lib/jsonld";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const { site } = getContent(locale);
  return {
    title: t("title"),
    description: t("description", { line1: site.address.line1, line2: site.address.line2, phone: site.phone }),
    alternates: alternates(locale, "/contact"),
    openGraph: { ...ogBase(locale), title: `${t("title")} — CHERY Mongolia`, url: localePath(locale, "/contact") },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const { site } = getContent(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd(locale)) }}
      />
      <Nav active="/contact" path="/contact" />
      <main id="main">
        <section className="section section--tight">
          <div className="container">
            <Head level={1} eyebrow={t("title")} title={t("heading")} />
            <div className="split">
              <div className="reveal">
                <ul className="rows">
                  <li>
                    <span className="meta">{t("address")}</span>
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </li>
                  <li>
                    <span className="meta">{t("phone")}</span>
                    <a className="link" href={site.phoneHref}>
                      {site.phone}
                    </a>
                  </li>
                  {site.hours.map(([d, h]) => (
                    <li key={d}>
                      <span className="meta">{d}</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="btn-row" style={{ marginTop: "var(--s-6)" }}>
                  <a className="btn btn--secondary" href={site.mapLink} target="_blank" rel="noopener">
                    {t("openMaps")}
                  </a>
                </div>
              </div>

              {/* ⚙ Газрын зураг нь ДАРЖ ачаалагдана. Google-ийн iframe нь
                  гуравдагч талын хүсэлт, cookie тавьдаг тул анхнаасаа
                  ачаалуулахгүй — гүйцэтгэл ба хувийн мэдээллийн хувьд дээр. */}
              <div
                className="mapbox reveal"
                data-map
                data-src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&hl=${locale}&output=embed`}
              >
                <div className="mapbox__face">
                  <p className="meta">{t("location")}</p>
                  <p className="mapbox__addr">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </p>
                  <button className="btn btn--secondary" type="button" data-map-load>
                    {t("loadMap")}
                  </button>
                  <p className="mapbox__note">{t("mapNote")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
