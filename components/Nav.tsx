import { site, nav, type NavItem } from "@/lib/content";
import { QUOTE_HREF } from "@/lib/routes";
import { Arrow } from "@/components/blocks";

/* ══════════════════════════════════════════════════════════════
   Толгойн цэс — SERVER COMPONENT.

   ⚙ ЯАГААД `<a>` БИШ `<Link>`:
   Сайтын интерактив давхарга нь `public/assets/js/site.js` дахь
   императив код (hero карусель, чирэлт, наалдмал өгүүлэмж,
   харьцуулалт, модал — 9 модуль). Тэр нь `DOMContentLoaded` дээр
   нэг удаа ажилладаг. `<Link>`-ээр client-side шилжилт хийвэл
   скрипт ДАХИН ажиллахгүй тул шинэ хуудасны виджетүүд «үхнэ»;
   эсвэл дахин ажиллуулбал `window` дээрх scroll listener-ууд
   хуримтлагдаж memory leak болно.

   Бүх 12 хуудас нь static тул CDN-ээс бүтэн хуудас ачаалахад
   ~30мс. Тиймээс бүтэн хуудасны шилжилт нь энд илүү НАЙДВАРТАЙ
   бөгөөд client JS-ийг ч нэмэхгүй (Phase 17). Хэрэв хожим SPA
   шилжилт хэрэгтэй бол `site.js`-ийг React hook болгон бүтнээр
   дахин бичих ёстой — тэр нь тусдаа ажил.
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

/** Идэвхтэй эсэх: өөрөө эсвэл дэд холбоосын зам таарвал */
const isActive = (n: NavItem, active: string) =>
  !!active &&
  (n.href.split(/[?#]/)[0] === active ||
    (n.children ?? []).some((c) => c.href.split(/[?#]/)[0] === active));

export default function Nav({
  active = "",
  hero = false,
}: {
  active?: string;
  /** Нүүр хуудас: цэс нь hero дээр тунгалаг, гүйлгэхэд цагаан болно.
   *  Өмнө `body.home` байсан — төлөвийг nav өөрөө эзэмших нь
   *  Next.js-ийн нэгдсэн layout-тай тохироогүй бөгөөд
   *  бүтцээрээ цэвэр (DESIGN-SYSTEM.md §7). */
  hero?: boolean;
}) {
  return (
    <header className={hero ? "nav nav--hero" : "nav"}>
      <div className="nav__in">
        <a className="nav__brand" href="/" aria-label="CHERY Mongolia — нүүр хуудас">
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

        {/* Дэд цэс JS-гүй: `:hover` ба `:focus-within`-ээр нээгдэнэ —
            гарын Tab-аар эх холбоос руу, дараа нь дэд холбоосуудаар
            дамжина. */}
        <nav className="nav__links" aria-label="Үндсэн цэс">
          {nav.map((n) =>
            n.children ? (
              <div className="nav__item" key={n.label}>
                <a
                  href={n.href}
                  aria-haspopup="true"
                  aria-current={isActive(n, active) ? "page" : undefined}
                >
                  {n.label}
                  <Chevron />
                </a>
                <ul className="nav__sub" aria-label={n.label}>
                  {n.children.map((c) => (
                    <li key={c.href}>
                      <a href={c.href}>{c.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a key={n.href} href={n.href} aria-current={isActive(n, active) ? "page" : undefined}>
                {n.label}
              </a>
            )
          )}
        </nav>

        {/* Баруун талын бүлэг. Тусдаа хайрцаг болсон шалтгаан:
            hero дээрх цэс нь `1fr auto 1fr` торон дээр суудаг
            (тэмдэг зүүн · цэс ЯГ ТӨВД · үйлдэл баруун). Утас, CTA,
            бургер гурав тусдаа ах дүү элемент байсан тул төвийн
            баганыг бодитоор төвлүүлэх боломжгүй байв.
            Бусад хуудсанд энэ нь ердөө flex бүлэг — харагдац
            хэвээр. */}
        <div className="nav__end">
        {/* §9: дугаар нь тусгаарлагдсан биш, дүрстэй хамт нэг биет.
            Улаан хөвөгч товч БОЛГООГҮЙ — тэр нь hero-гийн гол
            CTA-тай өрсөлдөнө. Чимээгүй боловч нэг даралтын зайд. */}
        <a
          className="nav__phone"
          href={site.phoneHref}
          aria-label={`Шоурумтай холбогдох — ${site.phone}`}
        >
          <PhoneIcon />
          <span className="num">{site.phone}</span>
        </a>

        {/* ⚙ «Мэдээлэл авах» → «Үнийн санал авах». Автомашин сонгож буй
            хүний хамгийн түгээмэл дараагийн алхам бол үнэ; Tiggo 7-ийн
            үнэ нээлттэй зарлагдаагүй тул энэ нь бодит хэрэгцээ. Тест
            драйвын шууд амлалтаас босго нь бага, лид нь ижил маягтаар
            (зорилго = «Үнийн санал») ирнэ.

            `data-modal-open`: нүүр хуудсанд модал нээгдэнэ (тэнд
            `LeadModal` бий). Бусад хуудсанд модал БАЙХГҮЙ тул `href`
            нь зорилгыг урьдчилан сонгосон маягт руу хөтөлнө. */}
        <a
          className="btn btn--primary nav__cta"
          href={QUOTE_HREF}
          data-modal-open="lead-modal"
        >
          Үнийн санал авах
          <Arrow />
        </a>

        <details className="burger">
          <summary aria-label="Цэс нээх">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </summary>
          <nav className="burger__panel" aria-label="Мобайл цэс">
            <a className="burger__phone" href={site.phoneHref}>
              {site.phone}
            </a>
            {nav.map((n) =>
              n.children ? (
                <details className="burger__group" key={n.label}>
                  <summary>
                    {n.label}
                    <Chevron />
                  </summary>
                  <div className="burger__sub">
                    {n.children.map((c) => (
                      <a key={c.href} href={c.href}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                </details>
              ) : (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              )
            )}
            <a
              className="btn btn--primary"
              href={QUOTE_HREF}
              data-modal-open="lead-modal"
            >
              Үнийн санал авах
            </a>
          </nav>
        </details>
        </div>
      </div>
    </header>
  );
}
