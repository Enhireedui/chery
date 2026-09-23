"use client";

import Pic from "@/components/Pic";
import AnimatedArrowIcon from "./AnimatedArrowIcon";
import type { ShowcaseModel } from "@/lib/models-showcase";

/* ⚠⚠ ХЭРЭГЛЭГДЭХГҮЙ БОЛСОН — `ModelIndexRow` ОРЛОВ (аудитын §7).
   Нүүр хуудсанд тайзан дээрх машин доороо карт болж дахин
   зурагдаж байсныг хасав. Файлыг лавлагаанд үлдээв; хэрэв
   хожим зурагтай карт хэрэгтэй болбол (жишээ нь /models
   хуудсанд) эндээс авч болно. ЭНЭ КОМПОНЕНТЫГ НҮҮР ХУУДСАНД
   БУЦААЖ ОРУУЛАХГҮЙ.
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ТОЙМ КАРТ — каталогийн хуудас, дэлгүүрийн бараа БИШ.

   ⚙ БҮТЭЦ: гадна нь `<button>` (тайзны загварыг СОЛИНО), дотор
   нь тусдаа `<a>` (загварын хуудас руу ОРНО). Хоёр өөр үйлдэл
   тул хоёр өөр удирдлага — нэг элементэд хоёр утга ачаалахгүй.
   `<a>` нь `<button>`-ы ДОТОР байж БОЛОХГҮЙ (HTML зөрчил) тул
   тэд ах дүү элемент болж, карт нь grid-ээр давхарлагдана.

   ⚠ ШҮҮГДСЭН КАРТ: `hidden` тавихын оронд `data-off` — CSS нь
   өндрийг нь эвтэйхэн хумина. Агуулга DOM-д ҮЛДЭНЭ тул JS-гүй
   үед дөрвүүлээ харагдана.
   ══════════════════════════════════════════════════════════════ */

export default function ModelOverviewCard({
  model,
  active,
  off,
  onSelect,
  onDetails,
}: {
  model: ShowcaseModel;
  active: boolean;
  off: boolean;
  onSelect: () => void;
  onDetails: () => void;
}) {
  return (
    <div className="ms-card" data-active={active ? "" : undefined} data-off={off ? "" : undefined}>
      {/* Тайзыг солих — картын бүх талбай дарагдана */}
      <button
        type="button"
        className="ms-card__pick"
        aria-pressed={active}
        tabIndex={off ? -1 : 0}
        onClick={onSelect}
      >
        <span className="vh">{model.name} загварыг үзүүлэнд харуулах</span>
      </button>

      <span className="ms-card__media" aria-hidden="true">
        <Pic
          name={model.image}
          alt=""
          sizes="(min-width: 1000px) 300px, (min-width: 640px) 44vw, 88vw"
        />
      </span>

      <span className="ms-card__body">
        <span className="ms-card__cat">{model.category}</span>
        <span className="ms-card__name">{model.name}</span>
        <span className="ms-card__price" data-request={model.priceType === "request" ? "" : undefined}>
          {model.price}
        </span>

        <a
          className="ms-card__link"
          href={model.href}
          tabIndex={off ? -1 : 0}
          onClick={onDetails}
          aria-label={`CHERY ${model.name} — дэлгэрэнгүй үзэх`}
        >
          Дэлгэрэнгүй үзэх
          <AnimatedArrowIcon size={14} />
        </a>
      </span>
    </div>
  );
}
