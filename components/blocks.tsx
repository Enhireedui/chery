import { site, models, type Model } from "@/lib/content";
import { priceLabel } from "@/lib/format";
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
export function ModelCard({ m }: { m: Model }) {
  return (
    <a className="card reveal" href={modelHref(m.id)}>
      <span className="card__media">
        <Pic
          name={m.card}
          alt={`CHERY ${m.name} — гадна тал`}
          sizes="(min-width:1040px) 280px, (min-width:640px) 46vw, 92vw"
        />
      </span>
      <span className="card__body">
        <span className="meta">{m.segment}</span>
        <span className="h3">{m.name}</span>
        <span className="card__price">{priceLabel(m)}</span>
        <span className="card__cta">
          <span className="link">
            Дэлгэрэнгүй <Arrow />
          </span>
        </span>
      </span>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════
   Тест драйвын маягт — «Холбоо барих» хуудасны БҮТЭН хувилбар.

   ⚙ Модалын маягт (нэр + утас) нь `LeadModal`-д тусад нь байна.
   Энд нэр, утас, имэйл, загвар, зорилго бүгд бий.

   `action="/api/lead"` + `method="post"`:
   JS ажиллахгүй ч маягт нь СЕРВЕР РҮҮ ХҮРНЭ — route handler нь
   `Accept` толгойгоор шийдэж, JS-гүй тохиолдолд redirect-ээр
   хариулна (Phase 21). Прогрессив enhancement хэвээр.
   ══════════════════════════════════════════════════════════════ */
export function BookingForm() {
  return (
    <form className="form reveal" method="post" action="/api/lead">
      <p className="meta">Тест драйв · Үнийн санал</p>
      <h3 className="h3">Хүсэлт илгээх</h3>

      <div className="field">
        <label htmlFor="f-name">Нэр</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="f-phone">Утас</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="9911 2233" required />
      </div>
      <div className="field">
        <label htmlFor="f-email">
          Имэйл <span>(заавал биш)</span>
        </label>
        <input id="f-email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="f-model">Загвар</label>
        <select id="f-model" name="model" data-lead-model>
          <option value="">Сонгоогүй</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="fieldset">
        <legend>Зорилго</legend>
        <div className="radios">
          <label>
            <input type="radio" name="purpose" value="test-drive" defaultChecked /> Тест драйв
          </label>
          <label>
            <input type="radio" name="purpose" value="quote" /> Үнийн санал
          </label>
          <label>
            <input type="radio" name="purpose" value="advice" /> Зөвлөгөө
          </label>
        </div>
      </fieldset>

      {/* Спам урхи — хүн харахгүй, бот бөглөнө (Phase 6) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />
      <input type="hidden" name="source_path" data-lead-source value="" />

      <button className="btn btn--primary" type="submit">
        Илгээх
      </button>
    </form>
  );
}

/* ---------- Шоурум + маягтын хэсэг ---------- */
export function CtaSection() {
  return (
    <section className="section section--surface" id="захиалга">
      <div className="container split">
        <div className="head reveal" style={{ marginBottom: 0 }}>
          <p className="meta">Шоурум</p>
          <h2 className="h2">{site.address.line1}</h2>
          <p className="body">{site.address.line2}</p>
          <ul className="rows">
            {site.hours.map(([d, t]) => (
              <li key={d}>
                <span className="meta">{d}</span>
                {t}
              </li>
            ))}
          </ul>
          <div className="btn-row">
            <a className="btn btn--secondary" href={site.phoneHref}>
              {site.phone}
            </a>
            <a
              className="btn btn--secondary"
              href={site.mapLink}
              target="_blank"
              rel="noopener"
            >
              Газрын зураг дээр
            </a>
          </div>
        </div>
        <BookingForm />
      </div>
    </section>
  );
}
