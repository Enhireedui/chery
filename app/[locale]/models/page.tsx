import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, ModelCard, CtaSection } from "@/components/blocks";
import { getContent, type Model, type SpecKey } from "@/lib/content";
import { mnt, pickSpec } from "@/lib/format";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "models" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/models"),
    openGraph: { ...ogBase(locale), title: `${t("title")} — CHERY Mongolia`, url: localePath(locale, "/models") },
  };
}

/* Зөвхөн БҮХ загварт баталгаатай байгаа мөрүүдийг харьцуулна.
   Tiggo 7-д хүснэгт байхгүй тул «—» болно, тэмдэглэл нэмнэ.
   Шошго нь техникийн үзүүлэлтийн хүснэгттэй ЯГ ижил (нэр томьёоны толь). */
const COMPARE: SpecKey[] = ["seats", "wheelbase", "cargo", "engine"];

export default async function ModelsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { models } = getContent(locale);

  const rows: Array<[string, (m: Model) => string]> = [
    [t("models.segmentLabel"), (m) => t(`models.segment.${m.segment}`)],
    [t("models.priceLabel"), (m) => (m.price ? t("price.from", { price: mnt(m.price.from, locale) }) : "—")],
    ...COMPARE.map((k): [string, (m: Model) => string] => [t(`specs.rows.${k}`), (m) => pickSpec(m, k)]),
  ];

  return (
    <>
      <Nav active="/models" path="/models" />
      <main id="main">
        <section className="section section--tight">
          <div className="container">
            <Head level={1} eyebrow={t("models.title")} title={t("models.heading")} body={t("models.lede")} />
            <div className="grid grid--4">
              {models.map((m) => (
                <ModelCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--surface">
          <div className="container">
            <Head eyebrow={t("models.compareEyebrow")} title={t("models.compareTitle")} />
            <div className="table-wrap">
              <table className="spec__table spec__table--compare" style={{ minWidth: "680px" }}>
                <thead>
                  <tr>
                    <th scope="col">{t("specs.column")}</th>
                    {models.map((m) => (
                      <th key={m.id} scope="col">
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, fn]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {models.map((m) => (
                        <td key={m.id}>{fn(m)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">{t("models.compareNote")}</p>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
