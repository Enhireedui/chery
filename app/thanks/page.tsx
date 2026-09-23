import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Хүсэлт хүлээн авлаа",
  robots: { index: false, follow: false },
};

/* JS-гүй маягтын илгээлт `/api/lead`-ээс энд redirect хийгдэнэ.
   JS ажиллаж байвал `site.js` маягтын оронд ижил мессежийг харуулна. */
export default function ThanksPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section">
          <div className="container">
            <div className="empty">
              <p className="meta">Амжилттай</p>
              <h1 className="h3">Хүсэлт хүлээн авлаа</h1>
              <p className="body">
                Ажлын цагаар тантай холбогдоно. Яаралтай бол шоурум руу шууд залгана уу.
              </p>
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
