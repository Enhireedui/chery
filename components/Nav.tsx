import type { NavItem } from "@/lib/content";
import { getI18n } from "@/lib/i18n-server";
import { localePath, type Locale } from "@/lib/i18n";
import { QUOTE_HREF } from "@/lib/routes";
import { Arrow } from "@/components/blocks";

/* ══════════════════════════════════════════════════════════════
   Толгойн цэс — SERVER COMPONENT.

   ⚙ ЯАГААД `<a>` БИШ `<Link>`:
   Сайтын интерактив давхарга нь `public/assets/js/site.js` дахь
   императив код (hero карусель, чирэлт, наалдмал өгүүлэмж, модал,
   маягт). Тэр нь хуудас ачаалагдахад НЭГ удаа ажилладаг.
   `<Link>`-ээр client-side шилжилт хийвэл скрипт ДАХИН ажиллахгүй
   тул шинэ хуудасны виджетүүд «үхнэ». Бүх хуудас static тул бүтэн
   ачаалалт нь CDN-ээс хурдан бөгөөд найдвартай.
   ══════════════════════════════════════════════════════════════ */

const PhoneIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Chevron = () => (
  <svg className="nav__chev" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M2.5 4.5 6 8l3.5-3.5" />
  </svg>
);

/** Идэвхтэй эсэх: өөрөө эсвэл дэд холбоосын ХУУДАС таарвал.
 *  Маягт руу заадаг үйлдлийн цэс («Худалдан авалт») нь /contact дээр
 *  «Холбоо барих»-тай давхар тодрохгүй. */
const pathOf = (h: string) => h.split(/[?#]/)[0];
const isActive = (n: NavItem, active: string) =>
  !!active &&
  !n.href.includes("?") &&
  (pathOf(n.href) === active || (n.children ?? []).some((c) => pathOf(c.href) === active));

/* ══════════════════════════════════════════════════════════════
   ХЭЛ СОНГОГЧ — «MN / EN».

   Энгийн холбоос тул JS-гүй ч ажиллана, мөн ИЖИЛ хуудас руу
   (`/models/tiggo-7` ⇄ `/en/models/tiggo-7`) очно. Монгол руу
   буцахдаа `?lang=mn` — middleware сонголтыг cookie-д хадгалаад
   цэвэр хаяг руу шилжүүлнэ. `site.js` нь дарахад query, hash
   болон сонгосон загварыг (`?model=`) дагуулна.
   ══════════════════════════════════════════════════════════════ */
function LangSwitch({
  locale,
  path,
  label,
  names,
  full = false,
}: {
  locale: Locale;
  path: string;
  label: string;
  names: Record<Locale, string>;
  /** Мобайл цэсэнд бүтэн нэрээр («Монгол / English») */
  full?: boolean;
}) {
  const items: Array<{ l: Locale; href: string; text: string }> = [
    { l: "mn", href: `${path}?lang=mn`, text: full ? names.mn : "MN" },
    { l: "en", href: localePath("en", path), text: full ? names.en : "EN" },
  ];
  return (
    <div className={full ? "lang lang--full" : "lang"} role="group" aria-label={label}>
      {items.map((it, k) => (
        <span className="lang__item" key={it.l}>
          {k > 0 ? (
            <span className="lang__sep" aria-hidden="true">
              /
            </span>
          ) : null}
          {it.l === locale ? (
            <span className="lang__opt" aria-current="true" lang={it.l}>
              {it.text}
              {full ? null : <span className="vh"> {names[it.l]}</span>}
            </span>
          ) : (
            <a className="lang__opt" href={it.href} hrefLang={it.l} lang={it.l} data-lang-switch>
              {it.text}
              {full ? null : <span className="vh"> {names[it.l]}</span>}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}

export default async function Nav({
  active = "",
  hero = false,
  path = "/",
}: {
  active?: string;
  /** Нүүр хуудас: цэс нь hero дээр тунгалаг, гүйлгэхэд бүдэг хар болно. */
  hero?: boolean;
  /** Одоогийн хуудасны УГТВАРГҮЙ хаяг — хэл сонгогч ижил хуудас руу заана. */
  path?: string;
}) {
  const { locale, t, c, href } = await getI18n();
  const names = { mn: t("lang.mnName"), en: t("lang.enName") };

  return (
    <header className={hero ? "nav nav--hero" : "nav"}>
      <div className="nav__in">
        <a className="nav__brand" href={href("/")} aria-label={t("nav.home")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo-sain.webp" alt="" width={300} height={78} />
          <span className="nav__lock" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="nav__chery"
            src="/assets/img/logo-chery-red.webp"
            alt=""
            width={500}
            height={66}
          />
        </a>

        {/* Дэд цэс JS-гүй: `:hover` ба `:focus-within`-ээр нээгдэнэ. */}
        <nav className="nav__links" aria-label={t("nav.main")}>
          {c.nav.map((n) =>
            n.children ? (
              <div className="nav__item" key={n.href}>
                <a
                  href={href(n.href)}
                  aria-haspopup="true"
                  aria-current={isActive(n, active) ? "page" : undefined}
                >
                  {n.label}
                  <Chevron />
                </a>
                <ul className="nav__sub" aria-label={n.label}>
                  {n.children.map((ch) => (
                    <li key={ch.href}>
                      <a href={href(ch.href)}>{ch.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a key={n.href} href={href(n.href)} aria-current={isActive(n, active) ? "page" : undefined}>
                {n.label}
              </a>
            )
          )}
        </nav>

        {/* Баруун талын бүлэг: хэл · утас · CTA · бургер. */}
        <div className="nav__end">
          <LangSwitch locale={locale} path={path} label={t("lang.label")} names={names} />

          <a
            className="nav__phone"
            href={c.site.phoneHref}
            aria-label={t("nav.call", { phone: c.site.phone })}
          >
            <PhoneIcon />
            <span className="num">{c.site.phone}</span>
          </a>

          {/* `data-modal-open`: нүүр хуудсанд модал нээгдэнэ. Бусад
              хуудсанд модал БАЙХГҮЙ тул `href` нь маягт руу хөтөлнө. */}
          <a className="btn btn--primary nav__cta" href={href(QUOTE_HREF)} data-modal-open="lead-modal">
            {t("nav.cta")}
            <Arrow />
          </a>

          <details className="burger">
            <summary aria-label={t("nav.open")} aria-expanded="false" aria-controls="burger-panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </summary>
            <span className="burger__backdrop" aria-hidden="true" />
            <nav className="burger__panel" id="burger-panel" aria-label={t("nav.mobile")}>
              <LangSwitch locale={locale} path={path} label={t("lang.label")} names={names} full />
              <a className="burger__phone" href={c.site.phoneHref}>
                {c.site.phone}
              </a>
              {c.nav.map((n) =>
                n.children ? (
                  <details className="burger__group" key={n.href}>
                    <summary>
                      {n.label}
                      <Chevron />
                    </summary>
                    <div className="burger__sub">
                      {n.children.map((ch) => (
                        <a key={ch.href} href={href(ch.href)}>
                          {ch.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a key={n.href} href={href(n.href)}>
                    {n.label}
                  </a>
                )
              )}
              <a className="btn btn--primary" href={href(QUOTE_HREF)} data-modal-open="lead-modal">
                {t("nav.cta")}
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
