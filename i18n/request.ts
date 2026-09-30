import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";
import mn from "../messages/mn.json";
import en from "../messages/en.json";

/* Хоёр файлын түлхүүр ЯГ ижил байх ёстой — нэг талд дутуу түлхүүр
   байвал `tsc` энд алдаа өгнө (build ч зогсоно). Орчуулга дутуу
   хуудас production-д хэзээ ч гарахгүй. */
const messages: Record<"mn" | "en", typeof mn> = { mn, en: en satisfies typeof mn };
void (mn satisfies typeof en);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: messages[locale] };
});
