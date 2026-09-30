import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing, LOCALE_COOKIE } from "./i18n/routing";

/* ══════════════════════════════════════════════════════════════
   ХЭЛ СОНГОЛТ

   Дараалал:
     1. URL — `/en/...` бол English, угтваргүй бол Монгол.
     2. Өмнө сонгосон хэл (cookie) — ЗӨВХӨН нүүр хуудас `/` руу
        орж ирэхэд. English сонгосон хүн дараа нь сайт руу ороход
        `/en` нээгдэнэ. Гүн холбоос (жишээ нь Facebook-т
        хуваалцсан `/models/tiggo-7`) нь URL-ынхаа хэлээр нээгдэнэ.
     3. Хөтчийн хэлийг ашиглахгүй — `i18n/routing.ts`-ийг үз.
     4. Үндсэн — Монгол.

   Cookie-г хэн тавих вэ:
     · `/en/...` хуудас бүр → `en`
     · Монгол руу шилжүүлэгч `?lang=mn` → `mn`, дараа нь цэвэр
       хаяг руу буцаана. Ингэснээр JS-гүй ч ажиллана.
   ══════════════════════════════════════════════════════════════ */

const intl = createMiddleware(routing);
const YEAR = 60 * 60 * 24 * 365;
const cookieOpts = { path: "/", maxAge: YEAR, sameSite: "lax" as const };

export default function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;

  if (!isEn && searchParams.get("lang") === "mn") {
    const url = req.nextUrl.clone();
    url.searchParams.delete("lang");
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, "mn", cookieOpts);
    return res;
  }

  if (pathname === "/" && saved === "en") {
    const url = req.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  const res = intl(req);
  if (isEn && saved !== "en") res.cookies.set(LOCALE_COOKIE, "en", cookieOpts);
  return res;
}

export const config = {
  /* API, Next-ийн дотоод файл, `/assets` болон цэгтэй бүх хаяг
     (robots.txt, sitemap.xml, icon.svg, .pdf) middleware-ээр
     дамжихгүй. */
  matcher: ["/((?!api|_next|_vercel|assets|.*\\..*).*)"],
};
