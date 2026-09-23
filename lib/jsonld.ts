import { site, faq, type Model } from "./content";
import { abs } from "./site-url";

/* ══════════════════════════════════════════════════════════════
   Бүтэцлэгдсэн өгөгдөл (Phase 16)

   ⚠ ХУУРАМЧ бүтэцлэгдсэн өгөгдөл БИЧИХГҮЙ. Тиймээс энд байхгүй:
     · `aggregateRating` — сайтад үнэлгээ цуглуулдаггүй
     · `review` — бодит сэтгэгдэл байхгүй
     · `Product`-ийн `sku`, `gtin` — дугаар байхгүй
   Зөвхөн БАТАЛГААЖСАН баримт: хаяг, координат, цагийн хуваарь,
   үнэ (зарлагдсан загварт), FAQ (хуудсанд бодитоор байгаа).

   Хаяг нь `abs()`-ээс — домэйн солиход өөрөө дагана.
   ══════════════════════════════════════════════════════════════ */

export function dealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: `CHERY Mongolia — ${site.legal}`,
    description: site.role,
    url: abs("/"),
    telephone: "+976 7255-8855",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: "Улаанбаатар",
      addressCountry: "MN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    brand: { "@type": "Brand", name: "CHERY" },
  };
}

/** Загварын хуудас. Үнэ зарлаагүй загварт `offers` ОРУУЛАХГҮЙ —
    тодорхойгүй үнийг зохиох нь хуурамч дохио. */
export function carJsonLd(m: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `CHERY ${m.name}`,
    brand: { "@type": "Brand", name: "CHERY" },
    vehicleConfiguration: m.segment,
    ...(m.price
      ? {
          offers: {
            "@type": "Offer",
            price: m.price.from,
            priceCurrency: "MNT",
            availability: "https://schema.org/InStock",
            url: abs(`/models/${m.id}`),
            seller: {
              "@type": "AutoDealer",
              name: `CHERY Mongolia — ${site.legal}`,
            },
          },
        }
      : {}),
  };
}

/** Үйлчилгээний хуудасны FAQ — асуулт, хариулт нь хуудсанд
    БОДИТООР харагдаж байгаа тул зөв (Google-ийн шаардлага). */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Шагналын хуудас. Бүх шагнал нь `content.ts`-д эх сурвалжтай. */
export function awardsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CHERY",
    url: abs("/awards"),
    award: [
      "Fortune Global 500 — #233 (2025)",
      "Kantar BrandZ — авто ангиллын #1 (2024)",
      "J.D. Power Triple Crown — IQS, APEAL, SSI",
      "22 дараалсан жил Хятадын экспортын тэргүүн",
    ],
  };
}
