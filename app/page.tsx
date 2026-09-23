import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import HeroParallax from "@/components/HeroParallax";
import LeadModal from "@/components/LeadModal";
import Pic from "@/components/Pic";
import ModelsSection from "@/components/models/ModelsSection";
import { Arrow, Head, CtaSection } from "@/components/blocks";
import { pillars } from "@/lib/content";
import { dealerJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "CHERY Mongolia — Албан ёсны дистрибьютор Сайн Моторс",
  description:
    "CHERY-гийн Монгол дахь албан ёсны дистрибьютор Сайн Моторс. Tiggo 2, Tiggo 4, Tiggo 7, Tiggo 8. Үйлдвэрийн баталгаа 3 жил буюу 100,000 км.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CHERY Mongolia — Албан ёсны дистрибьютор Сайн Моторс",
    description:
      "Tiggo 2, Tiggo 4, Tiggo 7, Tiggo 8. Үйлдвэрийн баталгаа 3 жил буюу 100,000 км.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd()) }}
      />
      <Nav hero />
      <main id="main">
        {/* ══════════════════════════════════════════════════════
            ХУУДАСНЫ ЦОРЫН ГАНЦ `h1` — аудитын §5.

            ⚙ ЯАГААД ХАРАГДАХГҮЙ: hero-гийн зохиомж нь ГУРВАН мөр
            (загварын нэр · нэг өгүүлбэр · үйлдэл) байхаар зориуд
            зурагдсан — §3-ын «hero-г бичвэрээр дүүргэхгүй».
            Дөрөв дэх мөр нэмбэл тэр шийдвэр эвдэрнэ.

            Гэвч hero-гийн том бичвэр нь дөрвөн загварын нэр ЗЭРЭГ
            агуулсан грид тул `h1` болох боломжгүй (тэр нь
            «Tiggo 8Tiggo 7Tiggo 4Tiggo 2» болж уншигдаж байв).

            Тиймээс семантик гарчиг нь энд, бүтэн өгүүлбэрээр.
            Дэлгэц уншигч болон хайлтын систем хуудсыг нээмэгц
            хэн, хаана, юу гэдгийг мэднэ; харагдац огт өөрчлөгдөхгүй.
            ══════════════════════════════════════════════════════ */}
        <h1 className="vh">
          CHERY Mongolia — Сайн Моторс, Chery брэндийн Монгол дахь албан ёсны
          дистрибьютор. Tiggo 2, Tiggo 4, Tiggo 7, Tiggo 8 SUV.
        </h1>

        <HomeHero />
        {/* Hero-гийн 2.5D камерын parallax (desktop, hover). Каруселийг
            хөндөхгүй — зөвхөн CSS хувьсагч бичнэ. reduced-motion/touch
            дээр огт ажиллахгүй. */}
        <HeroParallax />
        <LeadModal />

        {/* Дөрвөн картын тор → интерактив үзүүлэн.
            `id="models"` нь хэсэг дотроо хэвээр тул цэс, хөл,
            зангуу холбоос бүгд хэвээр ажиллана. */}
        <ModelsSection />

        {/* ---------- БАРИМТЫН ЗУРВАС ----------
            Хуудасны хамгийн хүчтэй БОДИТ тоонууд: баталгаа,
            санхүүжилт, сэлбэг. Өмнө нь ердийн 3 баганын тор
            дээр inline `style`-аар зурагдаж байсныг үзүүлэлтийн
            хуудас шиг зохиов — тоо нь ТОМ, шошго нь жижиг,
            тус бүрийн дээр нимгэн зураас.

            ⚠ `k` нь « / »-ээр залгасан хос утга («3 жил /
            100,000 км»). Хоёр мөр болгож задлав: нэг мөрөнд
            шахагдсан налуу зураас нь тоог уншихад саад болдог. */}
        <section className="section section--tight hp-facts">
          <div className="container">
            <div className="hp-facts__head">
              <p className="meta">Худалдан авалтын дараа</p>
              <h2 className="h2">Машинтай болоод дуусдаггүй</h2>
            </div>
            <dl className="hp-facts__grid">
              {pillars.map((p) => {
                const parts = p.k.split(" / ");
                return (
                  <div className="hp-fact reveal" key={p.t}>
                    <dt className="hp-fact__k">
                      {parts.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </dt>
                    <dd className="hp-fact__body">
                      <span className="hp-fact__t">{p.t}</span>
                      <span className="hp-fact__b">{p.b}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        {/* ---------- ХОЁР ХААЛГА ----------
            ⚠ ӨМНӨ ЭНЭ НЬ ХОЁР ТУСДАА ХЭСЭГ БАЙВ. Хоёулаа ижил
            бүтэцтэй («том зураг + нэг өгүүлбэр + холбоос»),
            хоёулаа өөр хуудас руу л заадаг, хоёулаа бүтэн
            дэлгэц эзэлдэг байв — 50 үгэнд хоёр дэлгэц. Тэр нь
            hero, загварын үзүүлэн хоёрын дараа хуудсыг сунжруулж,
            «дүүргэлт» мэдрэмж өгч байсныг аудитаар барив.

            Одоо НЭГ хэсэг, хоёр багана. Агуулга, зураг, холбоос
            АЛЬ НЬ Ч хасагдаагүй — зөвхөн зэрэгцэв. Хуудас нэг
            дэлгэцээр богиноссон, хоёр зам нь зэрэг харагдана. */}
        <section className="section hp-duo-sec">
          <div className="container">
            <div className="hp-duo">
              <a className="hp-gate reveal" href="/brand">
                <span className="hp-gate__media">
                  <Pic
                    name="brand-factory"
                    alt="CHERY-гийн үйлдвэрийн угсралтын шугам"
                    sizes="(min-width:900px) 46vw, 92vw"
                  />
                </span>
                <span className="hp-gate__body">
                  <span className="meta">Брэнд</span>
                  <span className="h3">22 жил дараалан экспортын тэргүүлэгч</span>
                  <span className="body">
                    120 гаруй орон, бүс нутагт борлуулагддаг. 2025 оны Fortune Global 500
                    жагсаалтад #223.
                  </span>
                  <span className="link">
                    Брэндтэй танилцах <Arrow />
                  </span>
                </span>
              </a>

              <a className="hp-gate reveal" href="/service">
                <span className="hp-gate__media">
                  <Pic
                    name="life-city"
                    alt="CHERY Tiggo 4 хотын гудамжинд"
                    sizes="(min-width:900px) 46vw, 92vw"
                  />
                </span>
                <span className="hp-gate__body">
                  <span className="meta">Эзэмшил</span>
                  <span className="h3">Албан ёсны сервис ба баталгаа</span>
                  <span className="body">
                    Баталгаат засвар юуг хамардаг, сэлбэг хэрхэн бэлэн байдаг, лизингийн
                    нөхцөл ямар вэ.
                  </span>
                  <span className="link">
                    Нөхцөлтэй танилцах <Arrow />
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
