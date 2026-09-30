import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

/* ESLint 9 flat config. `eslint-config-next` 15.1 нь хуучин (.eslintrc)
   форматтай тул FlatCompat-аар дамжуулна. Энэ файл байхгүй үед
   `next lint` интерактив асуулт гаргаж, CI дээр гацдаг байв. */
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [
  { ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /* Зориуд `<a>`: `public/assets/js/site.js` нь хуудас ачаалагдахад
         НЭГ УДАА init хийдэг (hero, маягт, reveal, цэс). `<Link>`-ийн
         client-side шилжилт нь дараагийн хуудсан дээр тэдгээрийг
         дахин init хийхгүй тул бүтэн ачаалалт шаардлагатай. */
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
