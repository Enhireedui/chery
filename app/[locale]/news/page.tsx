import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, CtaSection } from "@/components/blocks";
import { getContent } from "@/lib/content";
import { alternates, localePath, ogBase, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/news"),
    openGraph: { ...ogBase(locale), title: `${t("title")} — CHERY Mongolia`, url: localePath(locale, "/news") },
  };
}

/* ⚠ НИЙТЛЭЛ ЗОХИООГҮЙ. `news` нь одоогоор хоосон массив —
   бодит мэдээ гарах хүртэл хоосон төлөв харагдана. Хуурамч
   нийтлэл бичих нь хэрэглэгчийг төөрөгдүүлнэ (DESIGN-SYSTEM §11).
   Мэдээ 3 болмогц толгойн цэсэнд буцаана. */
export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const { site, news } = getContent(locale);

  return (
    <>
      <Nav active="/news" path="/news" />
      <main id="main">
        <section className="section">
          <div className="container">
            <Head level={1} eyebrow={t("eyebrow")} title={t("title")} body={t("description")} />

            {news.length === 0 ? (
              <div className="empty reveal">
                <p className="meta">{t("emptyEyebrow")}</p>
                <h2 className="h3">{t("emptyTitle")}</h2>
                <p className="body">{t("emptyBody")}</p>
                <a className="btn btn--secondary" href={site.phoneHref}>
                  {site.phone}
                </a>
              </div>
            ) : (
              <div className="grid grid--2">
                {news.map((n) => (
                  <article className="card reveal" key={n.slug}>
                    <div className="card__body">
                      <time className="meta" dateTime={n.date}>
                        {n.date}
                      </time>
                      <h3 className="h3">{n.title}</h3>
                      <p className="body">{n.lede}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
