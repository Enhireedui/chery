import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, CtaSection } from "@/components/blocks";
import { site, news } from "@/lib/content";

export const metadata: Metadata = {
  title: "Мэдээ, мэдээлэл",
  description:
    "CHERY-ийн шинэ загвар, брэндийн мэдээ, үйлчилгээний шинэчлэлт, үйл явдлууд.",
  alternates: { canonical: "/news" },
  openGraph: { title: "Мэдээ, мэдээлэл — CHERY Mongolia", url: "/news" },
};

/* ⚠ НИЙТЛЭЛ ЗОХИООГҮЙ. `news` нь одоогоор хоосон массив —
   бодит мэдээ гарах хүртэл хоосон төлөв харагдана. Хуурамч
   нийтлэл бичих нь хэрэглэгчийг төөрөгдүүлнэ (DESIGN-SYSTEM §11).
   Мэдээ 3 болмогц толгойн цэсэнд буцаана. */
export default function NewsPage() {
  return (
    <>
      <Nav active="/news" />
      <main id="main">
        <section className="section">
          <div className="container">
            <Head
              level={1}
              eyebrow="Мэдээ"
              title="Мэдээ, мэдээлэл"
              body="CHERY-ийн шинэ загвар, брэндийн мэдээ, үйлчилгээний шинэчлэлт, үйл явдлууд."
            />

            {news.length === 0 ? (
              <div className="empty reveal">
                <p className="meta">Хоосон</p>
                <h2 className="h3">Мэдээ удахгүй нэмэгдэнэ</h2>
                <p className="body">
                  Шинэ загвар, үйлчилгээний шинэчлэлт, үйл явдлын мэдээллийг энд
                  нийтэлнэ. Одоогоор шоурумаас шууд мэдээлэл авна уу.
                </p>
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
