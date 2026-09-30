import { getTranslations } from "next-intl/server";

import { getContent, type Model } from "./content";
import { localePath, type Locale } from "./i18n";
import { abs } from "./site-url";

/* ══════════════════════════════════════════════════════════════
   Бүтэцлэгдсэн өгөгдөл — хуудасны хэлээр.

   ⚠ ХУУРАМЧ бүтэцлэгдсэн өгөгдөл БИЧИХГҮЙ. Тиймээс энд байхгүй:
     · `aggregateRating` — сайтад үнэлгээ цуглуулдаггүй
     · `review` — бодит сэтгэгдэл байхгүй
     · `Product`-ийн `sku`, `gtin` — дугаар байхгүй
   Зөвхөн БАТАЛГААЖСАН баримт: хаяг, координат, цагийн хуваарь,
   үнэ (зарлагдсан загварт), FAQ (хуудсанд бодитоор байгаа).
   ══════════════════════════════════════════════════════════════ */

export function dealerJsonLd(locale: Locale) {
  const { site } = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: `CHERY Mongolia — ${site.legal}`,
    description: site.role,
    url: abs(localePath(locale, "/")),
    inLanguage: locale,
    telephone: "+976 7255-8855",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.locality,
      addressCountry: "MN",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapLink,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "21:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "19:00" },
    ],
    brand: { "@type": "Brand", name: "CHERY" },
  };
}

/** Загварын хуудас. Үнэ зарлаагүй загварт `offers` ОРУУЛАХГҮЙ —
    тодорхойгүй үнийг зохиох нь хуурамч дохио. */
export function carJsonLd(m: Model, locale: Locale) {
  const { site } = getContent(locale);
  const url = abs(localePath(locale, `/models/${m.id}`));
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `CHERY ${m.name}`,
    description: m.lede,
    url,
    image: abs(`/assets/img/${m.card}.webp`),
    brand: { "@type": "Brand", name: "CHERY" },
    model: m.name,
    ...(m.price
      ? {
          offers: {
            "@type": "Offer",
            price: m.price.from,
            priceCurrency: "MNT",
            availability: "https://schema.org/InStock",
            url,
            seller: { "@type": "AutoDealer", name: `CHERY Mongolia — ${site.legal}` },
          },
        }
      : {}),
  };
}

/** Үйлчилгээний хуудасны FAQ — асуулт, хариулт нь хуудсанд
    БОДИТООР харагдаж байгаа тул зөв (Google-ийн шаардлага). */
export function faqJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: getContent(locale).faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Шагналын хуудас. Бүх шагнал нь `content.ts`-д эх сурвалжтай. */
export async function awardsJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "awards.jsonld" });
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CHERY",
    url: abs(localePath(locale, "/awards")),
    award: [
      "Fortune Global 500 — #233 (2025)",
      t("kantar"),
      "J.D. Power Triple Crown — IQS, APEAL, SSI",
      t("exports"),
    ],
  };
}
