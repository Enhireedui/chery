import type { Config } from "tailwindcss";

/* ══════════════════════════════════════════════════════════════
   ТОКЕНЫ ГЭРЭЭ

   ⚠ ЭНЭ ФАЙЛ НЬ САЙТЫГ ЗУРДАГГҮЙ. Одоогийн 12 хуудас нь
   `app/site.css`-ийн токен систем дээр бүтсэн (2700 мөр) бөгөөд
   тэр нь хэвээр байна. Энд тодорхойлсон өнгө, сүүдэр, easing нь
   ЯГ ижил hex-ээр `site.css`-д бас байдаг:

     --ink-950 --charcoal-900 --graphite-800 --graphite-700
     --steel-500 --mist-200 --c-accent --c-accent-deep

   Тиймээс энэ файл нь ХОЁР зорилготой:
     1. Токенуудын албан ёсны жагсаалт — дизайн, хөгжүүлэлт
        хоёрын хооронд нэг эх сурвалж.
     2. Шинэ компонентыг Tailwind-аар бичих сонголтыг нээх
        (`bg-graphite-800`, `ease-premium` гэх мэт шууд ажиллана).

   ⚠ `preflight: false` — Tailwind-ийн суурь reset нь `site.css`-ийн
   өөрийн reset-тэй зөрчилдөж, 12 хуудасны гарчиг, жагсаалт,
   зайг эвдэнэ. Зөвхөн utility давхаргыг асаав; ашиглаагүй үед
   гаралт нь ~0 байт.
   ══════════════════════════════════════════════════════════════ */

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0C0E",
        },
        charcoal: {
          900: "#121417",
        },
        graphite: {
          800: "#1A1D21",
          700: "#252A30",
        },
        steel: {
          500: "#7B838D",
        },
        mist: {
          200: "#E7E9EC",
        },
        chery: {
          red: "#D71920",
          "red-hover": "#EE2B32",
        },
      },
      boxShadow: {
        vehicle: "0 28px 70px rgba(0, 0, 0, 0.38)",
        card: "0 18px 42px rgba(0, 0, 0, 0.22)",
      },
      borderRadius: {
        automotive: "8px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
