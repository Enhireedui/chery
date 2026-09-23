import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Pic from "@/components/Pic";
import { Head, CtaSection } from "@/components/blocks";
import { site, faq, testDrive } from "@/lib/content";
import { BOOK_HREF } from "@/lib/routes";
import { faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Үйлчилгээ ба баталгаа",
  description:
    "CHERY-гийн үйлдвэрийн баталгаа 3 жил буюу 100,000 км, оригинал сэлбэг, лизингийн нөхцөл, тест драйвын маршрут ба түгээмэл асуултууд.",
  alternates: { canonical: "/service" },
  openGraph: { title: "Үйлчилгээ ба баталгаа — CHERY Mongolia", url: "/service" },
};

export default function ServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <Nav active="/service" />
      <main id="main">
        <section className="section section--ink">
          <div className="container">
            <div className="head reveal">
              <p className="meta">Албан ёсны үйлдвэрийн баталгаа</p>
              <h1 className="h1">
                {site.warranty.years} эсвэл {site.warranty.km}
              </h1>
              <p className="body">
                Худалдан авалтын эхний 3 жил, эсвэл зам туулалтын эхний 100,000 км —
                аль нь эхэлж дуусахаас хамаарна.
              </p>
            </div>
            <div className="grid grid--2">
              <div className="reveal">
                <p
                  className="h3"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,.28)",
                    paddingTop: "var(--s-5)",
                  }}
                >
                  Хамрагдана
                </p>
                <p className="body" style={{ marginTop: "var(--s-3)" }}>
                  Хөдөлгүүр, хурдны хайрцаг, цахилгааны үндсэн систем болон тэнхлэгийн
                  үйлдвэрийн доголдол.
                </p>
              </div>
              <div className="reveal">
                <p
                  className="h3"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,.28)",
                    paddingTop: "var(--s-5)",
                  }}
                >
                  Хамрагдахгүй
                </p>
                <p className="body" style={{ marginTop: "var(--s-3)" }}>
                  Тос, шүүр, тоормосны наклад зэрэг элэгддэг эд анги.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split">
            <div className="head reveal" style={{ marginBottom: 0 }}>
              <p className="meta">Тест драйв</p>
              <h2 className="h2">{testDrive.title}</h2>
              <p className="body">{testDrive.lede}</p>
              <ul className="rows">
                {testDrive.steps.map(([t, b], k) => (
                  <li key={t}>
                    <span className="meta">
                      0{k + 1} · {t}
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="btn-row">
                <a className="btn btn--primary" href={BOOK_HREF}>
                  Цаг захиалах
                </a>
              </div>
            </div>
            <div className="media r-1610 reveal" style={{ borderRadius: "var(--radius)" }}>
              <Pic
                name="life-dusk"
                alt="CHERY Tiggo — үдшийн хотын гэрэлд"
                sizes="(min-width:900px) 45vw, 92vw"
              />
            </div>
          </div>
        </section>

        <section className="section section--surface" id="асуулт">
          <div className="container">
            <Head
              eyebrow="Түгээмэл асуулт"
              title="Түгээмэл асуулт, хариулт"
              body="Хариултаа олж чадаагүй бол утсаар холбогдоно уу."
            />
            <div className="spec">
              {faq.map((f) => (
                <details className="spec__group" key={f.q}>
                  <summary>{f.q}</summary>
                  <p
                    className="body"
                    style={{ paddingBottom: "var(--s-5)", maxWidth: "70ch" }}
                  >
                    {f.a}
                  </p>
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
