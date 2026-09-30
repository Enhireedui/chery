import { getLocale, getTranslations } from "next-intl/server";

import { getContent } from "./content";
import { localePath, type Locale } from "./i18n";

/** Server component-ууд хэл, орчуулга, агуулга, хаягаа эндээс авна.
 *  `setRequestLocale` нь layout/page-д дуудагдсан тул static хэвээр. */
export async function getI18n() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  return {
    locale,
    t,
    c: getContent(locale),
    /** Хуудасны хаягийг хэлэнд тааруулна (`/models` → `/en/models`). */
    href: (path: string) => localePath(locale, path),
  };
}
