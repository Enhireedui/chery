import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "thanks" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

/* JS-гүй маягтын илгээлт `/api/lead`-ээс энд redirect хийгдэнэ.
   JS ажиллаж байвал `site.js` маягтын оронд ижил мессежийг харуулна. */
export default async function ThanksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thanks");
  const { site } = getContent(locale);

  return (
    <>
      <Nav path="/thanks" />
      <main id="main">
        <section className="section">
          <div className="container">
            <div className="empty">
              <p className="meta">{t("eyebrow")}</p>
              <h1 className="h3">{t("title")}</h1>
              <p className="body">{t("body")}</p>
              <a className="btn btn--secondary" href={site.phoneHref}>
                {site.phone}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
