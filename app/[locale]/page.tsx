import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import HeroParallax from "@/components/HeroParallax";
import LeadModal from "@/components/LeadModal";
import Pic from "@/components/Pic";
import ModelsSection from "@/components/models/ModelsSection";
import { Arrow, CtaSection } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";
import { dealerJsonLd } from "@/lib/jsonld";
import { getShowcase } from "@/lib/models-showcase";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: alternates(locale, "/"),
    openGraph: { ...ogBase(locale), title: t("title"), description: t("ogDescription"), url: localePath(locale, "/") },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { pillars } = getContent(locale);
  const href = (p: string) => localePath(locale, p);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd(locale)) }}
      />
      <Nav hero path="/" />
      <main id="main">
        {/* ══════════════════════════════════════════════════════
            ХУУДАСНЫ ЦОРЫН ГАНЦ `h1` — харагдахгүй, бүтэн өгүүлбэрээр.
            Hero-гийн том бичвэр нь дөрвөн загварын нэрийг ЗЭРЭГ
            агуулсан грид тул `h1` болох боломжгүй («Tiggo 8Tiggo 7…»
            болж уншигдана). Дэлгэц уншигч, хайлтын систем хуудсыг
            нээмэгц хэн, хаана, юу гэдгийг мэднэ.
            ══════════════════════════════════════════════════════ */}
        <h1 className="vh">{t("home.h1")}</h1>

        <HomeHero />
        {/* Hero-гийн 2.5D камерын parallax (desktop, hover). reduced-motion/
            touch дээр огт ажиллахгүй. */}
        <HeroParallax />
        <LeadModal />

        {/* Загварын интерактив үзүүлэн. `id="models"` нь хэсэг дотроо. */}
        <ModelsSection
          showcase={await getShowcase(locale)}
          labels={{
            region: t("showcase.label"),
            prev: t("common.prev"),
            next: t("common.next"),
            explore: t("common.explore"),
            pick: t("showcase.pick"),
            exploreModel: t.raw("common.exploreModel") as string,
          }}
        />

        {/* ---------- БАРИМТЫН ЗУРВАС ----------
            Баталгаа, санхүүжилт, сэлбэг. `k` нь « / »-ээр залгасан хос
            утга — хоёр мөр болгож задлав. */}
        <section className="section section--tight hp-facts" id="нөхцөл">
          <div className="container">
            <div className="hp-facts__head">
              <p className="meta">{t("home.factsEyebrow")}</p>
              <h2 className="h2">{t("home.factsTitle")}</h2>
            </div>
            <dl className="hp-facts__grid">
              {pillars.map((p) => (
                <div className="hp-fact reveal" key={p.t}>
                  <dt className="hp-fact__k">
                    {p.k.split(" / ").map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </dt>
                  <dd className="hp-fact__body">
                    <span className="hp-fact__t">{p.t}</span>
                    <span className="hp-fact__b">{p.b}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- ХОЁР ХААЛГА ---------- НЭГ хэсэг, хоёр багана. */}
        <section className="section hp-duo-sec">
          <div className="container">
            <div className="hp-duo">
              <a className="hp-gate reveal" href={href("/brand")}>
                <span className="hp-gate__media">
                  <Pic name="brand-factory" alt={t("home.brandAlt")} sizes="(min-width:900px) 46vw, 92vw" />
                </span>
                <span className="hp-gate__body">
                  <span className="meta">{t("home.brandEyebrow")}</span>
                  <span className="h3">{t("home.brandTitle")}</span>
                  <span className="body">{t("home.brandBody")}</span>
                  <span className="link">
                    {t("common.learnMore")} <Arrow />
                  </span>
                </span>
              </a>

              <a className="hp-gate reveal" href={href("/service")}>
                <span className="hp-gate__media">
                  <Pic name="life-city" alt={t("home.serviceAlt")} sizes="(min-width:900px) 46vw, 92vw" />
                </span>
                <span className="hp-gate__body">
                  <span className="meta">{t("home.serviceEyebrow")}</span>
                  <span className="h3">{t("home.serviceTitle")}</span>
                  <span className="body">{t("home.serviceBody")}</span>
                  <span className="link">
                    {t("home.serviceLink")} <Arrow />
                  </span>
                </span>
              </a>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
