import { site, footerGroups } from "@/lib/content";
import BrandReveal from "@/components/BrandReveal";

/* Хөл — SERVER COMPONENT. Он нь build-time дээр тогтоно
   (static хуудас тул) — жил солигдоход дараагийн deploy-д
   шинэчлэгдэнэ. Client-side `Date` хэрэглэвэл hydration
   зөрчил үүсгэх тул зориуд серверт л тооцов. */
export default function Footer() {
  return (
    <footer className="foot">
      {/* Дээд мөр: брэнд + дөрвөн бүлэг холбоос (худалдан авагчийн зам) */}
      <div className="foot__in foot__top">
        <div className="foot__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/logo-chery-white.webp"
            alt="CHERY"
            width={500}
            height={66}
            style={{ height: "22px", width: "auto", opacity: 0.9 }}
          />
          <p>
            {site.role} — {site.legal}.
          </p>
        </div>
        {footerGroups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <strong>{g.title}</strong>
            <ul className="foot__links">
              {g.links.map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Доод мөр: шоурум, цаг, хууль зүйн мэдээлэл */}
      <div className="foot__in foot__meta">
        <div>
          <strong>Шоурум</strong>
          {site.address.line1}
          <br />
          {site.address.line2}
          <br />
          <a href={site.phoneHref}>{site.phone}</a>
        </div>
        <div>
          <strong>Цагийн хуваарь</strong>
          <ul className="foot__hours">
            {site.hours.map(([d, t]) => (
              <li key={d}>
                <span>{d}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="foot__in">
        <p className="foot__legal">
          © {new Date().getFullYear()} {site.legal}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>

      {/* Хаалтын брэнд wordmark — хулгана хөдлөхөд улаанаар асна.
          Контент биш, чимэглэл тул `aria-hidden` (лого дээр нэр
          аль хэдийн уншигдсан). */}
      <div className="foot-brand" aria-hidden="true">
        <BrandReveal text="CHERY" />
      </div>
    </footer>
  );
}
