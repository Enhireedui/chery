import type { Model } from "@/lib/content";
import { priceLabel } from "@/lib/format";
import { getI18n } from "@/lib/i18n-server";
import { modelHref } from "@/lib/routes";
import Pic from "./Pic";

/* Сум — текстэн холбоосны дараах заалт. */
export const Arrow = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---------- Хэсгийн гарчгийн блок ----------
   Хуудас тус бүрт ЯГ нэг `h1` байх ёстой, түвшин алгасахгүй.
   Тиймээс түвшин нь параметр — сохроор `h2` гаргахгүй. */
export function Head({
  eyebrow,
  title,
  body,
  level = 2,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  level?: 1 | 2;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <div className="head reveal">
      <p className="meta">{eyebrow}</p>
      <Tag className={level === 1 ? "h1" : "h2"}>{title}</Tag>
      {body ? <p className="body">{body}</p> : null}
    </div>
  );
}

/* ---------- Загварын карт ---------- */
export async function ModelCard({ m }: { m: Model }) {
  const { locale, t, href } = await getI18n();
  return (
    <a className="card reveal" href={href(modelHref(m.id))}>
      <span className="card__media">
        <Pic
          name={m.card}
          alt={t("common.exterior", { model: m.name })}
          sizes="(min-width:1040px) 280px, (min-width:640px) 46vw, 92vw"
        />
      </span>
      <span className="card__body">
        <span className="meta">{t(`models.segment.${m.segment}`)}</span>
        <span className="h3">{m.name}</span>
        <span className="card__price">{await priceLabel(m, locale)}</span>
        <span className="card__cta">
          <span className="link">
            {t("common.learnMore")} <Arrow />
          </span>
        </span>
      </span>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════
   Тест драйвын маягт — «Холбоо барих» хуудасны БҮТЭН хувилбар.

   ⚙ Модалын маягт (нэр + утас) нь `LeadModal`-д тусад нь байна.

   `action="/api/lead"` + `method="post"`:
   JS ажиллахгүй ч маягт нь СЕРВЕР РҮҮ ХҮРНЭ — route handler нь
   `Accept` толгойгоор шийдэж, JS-гүй тохиолдолд redirect-ээр
   (`locale` талбарын хэлээр) хариулна. Прогрессив enhancement.
   ══════════════════════════════════════════════════════════════ */
export async function BookingForm() {
  const { locale, t, c } = await getI18n();
  return (
    /* `#захиалга` маягт дээр — утсан дээр шоурумын мэдээлэл түрүүлж
       байрладаг тул хэсгийн зангуу нь маягтыг нугалаанаас доош үлдээж байв. */
    <form className="form reveal" id="захиалга" method="post" action="/api/lead">
      <p className="meta">{t("form.eyebrow")}</p>
      <h2 className="h3">{t("form.title")}</h2>

      <div className="field">
        <label htmlFor="f-name">{t("form.name")}</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="f-phone">{t("form.phone")}</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="9911 2233" required />
      </div>
      <div className="field">
        <label htmlFor="f-email">
          {t("form.email")} <span>{t("form.optional")}</span>
        </label>
        <input id="f-email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="f-model">{t("form.model")}</label>
        <select id="f-model" name="model" data-lead-model>
          <option value="">{t("form.noModel")}</option>
          {c.models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="fieldset">
        <legend>{t("form.purpose")}</legend>
        <div className="radios">
          <label>
            <input type="radio" name="purpose" value="test-drive" defaultChecked /> {t("form.purposeTestDrive")}
          </label>
          <label>
            <input type="radio" name="purpose" value="quote" /> {t("form.purposeQuote")}
          </label>
          <label>
            <input type="radio" name="purpose" value="advice" /> {t("form.purposeAdvice")}
          </label>
        </div>
      </fieldset>

      {/* Спам урхи — хүн харахгүй, бот бөглөнө */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />
      <input type="hidden" name="source_path" data-lead-source value="" />
      <input type="hidden" name="locale" value={locale} />

      <button className="btn btn--primary" type="submit">
        {t("form.send")}
      </button>
    </form>
  );
}

/* ---------- Шоурум + маягтын хэсэг ---------- */
export async function CtaSection() {
  const { t, c } = await getI18n();
  const { site } = c;
  return (
    <section className="section section--surface" id="шоурум">
      <div className="container split">
        <div className="head reveal" style={{ marginBottom: 0 }}>
          <p className="meta">{t("form.showroom")}</p>
          <h2 className="h2">{site.address.line1}</h2>
          <p className="body">{site.address.line2}</p>
          <ul className="rows">
            {site.hours.map(([d, h]) => (
              <li key={d}>
                <span className="meta">{d}</span>
                {h}
              </li>
            ))}
          </ul>
          <div className="btn-row">
            <a className="btn btn--secondary" href={site.phoneHref}>
              {site.phone}
            </a>
            <a className="btn btn--secondary" href={site.mapLink} target="_blank" rel="noopener">
              {t("form.onMap")}
            </a>
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
