import type mn from "./messages/mn.json";
import type { routing } from "./i18n/routing";

/* `t("nav.cta")` зэрэг түлхүүрийг TypeScript шалгана — байхгүй
   түлхүүр бичвэл build алдаа өгнө. */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof mn;
  }
}
