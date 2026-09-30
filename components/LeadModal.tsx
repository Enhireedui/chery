import { getI18n } from "@/lib/i18n-server";

/* ══════════════════════════════════════════════════════════════
   ҮНИЙН САНАЛЫН МОДАЛ — зөвхөн ХОЁР талбар: нэр ба утас.

   Дилерийн лид авахад хангалттай — талбар бүр нэмэгдэх тутам
   хөрвөлт унадаг. Загвар, зорилго, имэйл нь «Холбоо барих»
   хуудасны бүтэн маягтад бий.

   Native `<dialog>`: Esc-ээр хаагдах, фокусын урхи, `::backdrop`,
   хаагдахад фокусыг товч руу эргүүлэх — бүгд хөтчийн дотоод зан
   төлөв тул JS-ээр гараар бичихгүй.

   ⚙ JS АЖИЛЛАХГҮЙ БОЛ: товчны `href` хэвээр тул маягт руу орно.

   Далд `model` талбар ба гарчгийн дээрх загварын нэрийг `site.js`
   hero-гийн харагдаж буй кадраас бөглөнө; JS-гүй үед хоосон.
   `purpose="quote"` — `leads_purpose_ok` хязгаарлалт нь
   ('test-drive','quote','advice') гурвыг зөвшөөрдөг.
   ══════════════════════════════════════════════════════════════ */
export default async function LeadModal() {
  const { locale, t } = await getI18n();
  return (
    <dialog className="modal" id="lead-modal" aria-labelledby="lead-title">
      <div className="modal__box">
        <button className="modal__x" type="button" data-modal-close aria-label={t("common.close")}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <form className="form form--lead" method="post" action="/api/lead">
          <p className="meta" data-lead-model-name>
            {t("modal.tag")}
          </p>
          {/* `h2` (харагдац нь `.h3`) — hero-гийн дараа түвшний алгасалгүй. */}
          <h2 className="h3" id="lead-title">
            {t("modal.title")}
          </h2>
          <p className="body body--lead">{t("modal.body")}</p>

          <div className="field">
            <label htmlFor="m-name">{t("form.name")}</label>
            <input id="m-name" name="name" type="text" autoComplete="name" required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="m-phone">{t("form.phone")}</label>
            <input id="m-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          </div>

          {/* Спам урхи — сервер дээр бөглөгдсөн бол чимээгүй хаяна. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          />

          <input type="hidden" name="purpose" value="quote" />
          <input type="hidden" name="model" data-lead-model value="" />
          <input type="hidden" name="source_path" data-lead-source value="" />
          <input type="hidden" name="locale" value={locale} />

          <button className="btn btn--primary" type="submit">
            {t("form.send")}
          </button>
        </form>
      </div>
    </dialog>
  );
}
