/* ══════════════════════════════════════════════════════════════
   МЭДЭЭЛЭЛ АВАХ МОДАЛ — зөвхөн ХОЁР талбар: нэр ба утас.

   Дилерийн лид авахад хангалттай — талбар бүр нэмэгдэх тутам
   хөрвөлт унадаг. Загвар, зорилго, имэйл зэрэг нь «Холбоо барих»
   хуудасны бүтэн маягтад бий.

   Native `<dialog>`: Esc-ээр хаагдах, фокусын урхи, `::backdrop`,
   хаагдахад фокусыг товч руу эргүүлэх — бүгд хөтчийн дотоод зан
   төлөв тул JS-ээр гараар бичихгүй.

   ⚙ JS АЖИЛЛАХГҮЙ БОЛ: товчны `href` хэвээр байгаа тул
   `/contact#захиалга` руу орно. Модал нь зөвхөн ДАВХАРГА —
   агуулга хаана ч алдагдахгүй.

   Далд `model` талбар: аль загварын кадр харагдаж байхад дарсныг
   `site.js` бөглөнө. JS-гүй үед хоосон — хуурамч өгөгдөл үүсэхгүй.

   ⚙ ЗАГВАР НЬ ХАРАГДАНА: далд талбар нь дилерт хүрдэг ч ХЭРЭГЛЭГЧ
   өөрөө «аль машины тухай асууж байна» гэдгээ баталгаажуулах
   ёстой. Тиймээс гарчгийн дээр загварын нэр гарна. Нэр нь
   `hero__slide[data-name]`-аас ирнэ тул `lib/content.ts` цорын
   ганц эх сурвалж хэвээр. JS ажиллаагүй эсвэл hero байхгүй
   хуудсанд шошго нь «Захиалга» хэвээр — хоосон мөр гарахгүй.

   ⚙ `purpose="advice"`: маягт нь ТЕСТ ДРАЙВ БИШ, мэдээлэл авах
   хүсэлт болов. `leads_purpose_ok` хязгаарлалт нь
   ('test-drive','quote','advice') гурвыг зөвшөөрдөг тул
   миграц шаардахгүй. Тест драйвын бүтэн маягт нь «Холбоо
   барих» хуудсанд ХЭВЭЭР байна.
   ══════════════════════════════════════════════════════════════ */

export default function LeadModal() {
  return (
    <dialog className="modal" id="lead-modal" aria-labelledby="lead-title">
      <div className="modal__box">
        <button className="modal__x" type="button" data-modal-close aria-label="Хаах">
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
            Захиалга
          </p>
          {/* ⚠ `h3` → `h2` (аудитын §6). Модал нь DOM-д hero-гийн
              дараа шууд сууна; `h1` → `h3` гэсэн түвшний алгасал
              үүсгэж байв. Харагдац хэвээр — хэмжээг `.h3` анги
              хэлнэ, шошгыг таг хэлнэ. */}
          <h2 className="h3" id="lead-title">
            Мэдээлэл авах
          </h2>
          <p className="body body--lead">
            Нэр, утсаа үлдээгээрэй. Ажлын цагаар холбогдож үнэ, хувилбар,
            бэлэн байдлын талаар дэлгэрэнгүй мэдээлэл өгнө.
          </p>

          <div className="field">
            <label htmlFor="m-name">Нэр</label>
            <input
              id="m-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="m-phone">Утас</label>
            <input
              id="m-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </div>

          {/* Спам урхи — хүн харахгүй, автомат бөглөгч бөглөнө.
              Сервер дээр бөглөгдсөн бол хүсэлтийг чимээгүй хаяна. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          />

          <input type="hidden" name="purpose" value="advice" />
          <input type="hidden" name="model" data-lead-model value="" />
          <input type="hidden" name="source_path" data-lead-source value="" />

          <button className="btn btn--primary" type="submit">
            Илгээх
          </button>
        </form>
      </div>
    </dialog>
  );
}
