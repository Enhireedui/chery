import { getTranslations } from "next-intl/server";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getI18n } from "@/lib/i18n-server";

/* Сайтын 404 — хэлний цэс, хөлтэй. `[...rest]` болон танигдаагүй
   загвар (`/models/tiggo-9`) энд ирнэ. */
export default async function NotFound() {
  const { href } = await getI18n();
  const t = await getTranslations("notFound");
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="container">
            <div className="empty">
              <p className="meta">{t("eyebrow")}</p>
              <h1 className="h3">{t("title")}</h1>
              <p className="body">{t("body")}</p>
              <a className="btn btn--secondary" href={href("/")}>
                {t("home")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
