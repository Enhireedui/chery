import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Head, CtaSection } from "@/components/blocks";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Брэнд",
  description:
    "CHERY брэнд: 22 жил дараалан Хятадын экспортын тэргүүлэгч, 120+ орон, Fortune Global 500 #223, J.D. Power шагналууд.",
  alternates: { canonical: "/brand" },
  openGraph: { title: "Брэнд — CHERY Mongolia", url: "/brand" },
};

/** Он цагийн жагсаалт — рекорд ба шагнал хоёуланд ижил бүтэц. */
function Timeline({ items }: { items: Array<[string, string, string]> }) {
  return (
    <ul className="timeline">
      {items.map(([y, t, b]) => (
        <li className="reveal" key={t}>
          <p className="meta">{y}</p>
          <div>
            <h3 className="h3">{t}</h3>
            <p className="body" style={{ marginTop: "var(--s-2)" }}>
              {b}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function BrandPage() {
  return (
    <>
      <Nav active="/brand" />
      <main id="main">
        <section className="hero">
          <div className="hero__stage">
            <div className="hero__slide" data-active>
              <Pic
                name="brand-factory"
                alt="CHERY-гийн үйлдвэрийн угсралтын шугам"
                sizes="100vw"
                eager
              />
            </div>
            <div className="hero__scrim" />
            <div className="hero__body">
              <div className="container">
                <div className="hero__copy">
                  <p className="meta">Брэнд</p>
                  <h1 className="hero__title" style={{ fontSize: "var(--fs-h1)" }}>
                    Он цагийн шалгуур<span>давсан чанар</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--tight">
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
            <Head
              eyebrow="Рекорд"
              title="Экспортын түүх"
              body="Хятадын аль ч автомашины компани давтаж чадаагүй үзүүлэлтүүд."
            />
            <Timeline items={brand.records} />
          </div>
        </section>

        <section className="section section--surface">
          <div className="container">
            <Head
              eyebrow="Хүлээн зөвшөөрөл"
              title="J.D. Power үнэлгээ"
              body="Гүйцэтгэл, загвар, чанарын олон улсын судалгаанд эзэлсэн байр."
            />
            <Timeline items={brand.awards} />
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
