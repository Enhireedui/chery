import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, CtaSection } from "@/components/blocks";
import { site } from "@/lib/content";
import { dealerJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: `CHERY шоурум: ${site.address.line1}, ${site.address.line2}. Утас ${site.phone}. Тест драйв захиалах.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Холбоо барих — CHERY Mongolia", url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd()) }}
      />
      <Nav active="/contact" />
      <main id="main">
        <section className="section section--tight">
          <div className="container">
            <Head level={1} eyebrow="Холбоо барих" title="Шоурум" />
            <div className="split">
              <div className="reveal">
                <ul className="rows">
                  <li>
                    <span className="meta">Хаяг</span>
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </li>
                  <li>
                    <span className="meta">Утас</span>
                    <a className="link" href={site.phoneHref}>
                      {site.phone}
                    </a>
                  </li>
                  {site.hours.map(([d, t]) => (
                    <li key={d}>
                      <span className="meta">{d}</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="btn-row" style={{ marginTop: "var(--s-6)" }}>
                  <a
                    className="btn btn--secondary"
                    href={site.mapLink}
                    target="_blank"
                    rel="noopener"
                  >
                    Google Maps дээр харах
                  </a>
                </div>
              </div>

              {/* ⚙ Газрын зураг нь ДАРЖ ачаалагдана. Google-ийн iframe
                  нь хуудас нэвтрэнгүүт гуравдагч талын хүсэлт, cookie
                  тавьдаг тул анхнаасаа ачаалуулахгүй — гүйцэтгэл ба
                  хувийн мэдээллийн хувьд хоёуланд нь дээр. */}
              <div
                className="mapbox reveal"
                data-map
                data-src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`}
              >
                <div className="mapbox__face">
                  <p className="meta">Байршил</p>
                  <p className="mapbox__addr">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </p>
                  <button className="btn btn--secondary" type="button" data-map-load>
                    Газрын зургийг харах
                  </button>
                  <p className="mapbox__note">Дарахад Google Maps ачаалагдана.</p>
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
