import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Head, ModelCard, CtaSection } from "@/components/blocks";
import { models, type Model } from "@/lib/content";
import { mnt, pickSpec } from "@/lib/format";

export const metadata: Metadata = {
  title: "Загварууд",
  description:
    "CHERY Tiggo 2, Tiggo 4, Tiggo 7, Tiggo 8 — үнэ, үзүүлэлт, өнгө ба харьцуулалт.",
  alternates: { canonical: "/models" },
  openGraph: { title: "Загварууд — CHERY Mongolia", url: "/models" },
};

/* Зөвхөн БҮХ загварт баталгаатай байгаа мөрүүдийг харьцуулна.
   Tiggo 7-д хүснэгт байхгүй тул «—» болно, тэмдэглэл нэмнэ. */
const rows: Array<[string, (m: Model) => string]> = [
  ["Сегмент", (m) => m.segment],
  ["Үнэ", (m) => (m.price ? `${mnt(m.price.from)}-аас` : "—")],
  ["Суудал", (m) => pickSpec(m, "Суудлын тоо")],
  ["Тэнхлэг хоорондын зай", (m) => pickSpec(m, "Тэнхлэг хоорондын зай (мм)")],
  ["Тээшний багтаамж", (m) => pickSpec(m, "Тээшний хэсгийн багтаамж (л)")],
  ["Хөдөлгүүр", (m) => pickSpec(m, ["Хөдөлгүүр", "Хөдөлгүүрийн төрөл"])],
];

export default function ModelsPage() {
  return (
    <>
      <Nav active="/models" />
      <main id="main">
        <section className="section section--tight">
          <div className="container">
            <Head
              level={1}
              eyebrow="Загварууд"
              title="Tiggo цуврал"
              body="Дөрвөн загвар — авсаархан хотын SUV-оос долоон суудалтай гэр бүлийн SUV хүртэл."
            />
            <div className="grid grid--4">
              {models.map((m) => (
                <ModelCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--surface">
          <div className="container">
            <Head eyebrow="Харьцуулалт" title="Гол ялгаа" />
            <div className="table-wrap">
              <table
                className="spec__table spec__table--compare"
                style={{ minWidth: "680px" }}
              >
                <thead>
                  <tr>
                    <th scope="col">Үзүүлэлт</th>
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
            <p className="note">
              Tiggo 7-ийн үзүүлэлт баталгаажаагүй тул хүснэгтэд «—» гэж тэмдэглэв.
              Шоурумаас лавлана уу.
            </p>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
