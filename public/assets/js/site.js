/* CHERY Mongolia — сайтын скрипт
   Хамаарал БАЙХГҮЙ. Бүх зүйл progressive enhancement: JS ажиллахгүй
   бол агуулга бүрэн харагдана, зөвхөн интерактив давхарга алга болно. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Кино слайдер — ЧИГЛЭЛТЭЙ ГУЛСАЛТ ----------
     Шинэ кадар хажуугаас бүтнээр гулсаж орж ирэхэд хуучин нь
     арагшаа 22% ухарна (параллакс түлхэлт). Уусалт БИШ — чиглэл
     нь хэрэглэгчийн үйлдлийг (дараах/өмнөх) харуулна.

     Төлөв нь ЗӨВХӨН атрибутаар илэрхийлэгдэнэ, `style` бичихгүй:
       data-active — идэвхтэй кадр, байрандаа
       data-out    — гарч буй кадр, бүдгэрч байна
       (аль нь ч биш) — хүлээлгийн байрлалд, ШИЛЖИЛТГҮЙ
     Шилжилт дуусмагц `data-out` авагдана: тэр агшинд шилжилт
     идэвхгүй тул кадр чимээгүйхэн хүлээлгийн байрлалдаа буцна.

     ⚠ `DUR` нь `site.css`-ийн `--hero-dur`-ТАЙ ТААРАХ ЁСТОЙ.
     Богино байвал кадар шилжиж дуусаагүй байхад `data-out`
     авагдаж, зураг дундаас нь үсэрнэ. */
  function initHero(root) {
    var frames = root.querySelector(".hero__frames");
    var slides = [].slice.call(root.querySelectorAll(".hero__slide"));
    var dots = [].slice.call(root.querySelectorAll(".hero__dot"));
    var names = [].slice.call(root.querySelectorAll(".hero__name"));
    var plates = [].slice.call(root.querySelectorAll(".hero__plate"));
    var detail = root.querySelector("[data-hero-detail]");
    var lead = root.querySelector("[data-hero-lead]");
    var rail = root.querySelector(".hero__rail");
    var ctrl = root.querySelector("[data-hero-ctrl]");
    if (!frames || slides.length < 2) return;

    /* ⚠ ЭХЛЭХ ИНДЕКСИЙГ DOM-ООС УНШИНА, 0 гэж таамаглахгүй.
       Нүүрний hero нь Tiggo 8-аар нээгддэг (`HomeHero.tsx`-ийн
       `INITIAL_ID`). Энд 0 байсан үед `paint(-1)` нь идэвхтэй
       кадрыг эхний загвар руу БУЦААЖ, HTML-д зурагдсанаас өөр
       машин гэнэт гарч ирнэ. Одоо эхлэх цэг НЭГ ЛЭ газарт
       (маркапад) тодорхойлогдоно. */
    var i = 0, timer = null, outTimer = null;
    for (var n0 = 0; n0 < slides.length; n0++) {
      if (slides[n0].hasAttribute("data-active")) { i = n0; break; }
    }
    /* ⚠ 4000 → 6500. Дөрвөн секунд нь «слайдер»-ын хэмнэл байв:
       нүд загварын нэр, тайлбар, машин гурвыг уншиж амжихаас
       өмнө кадар солигддог. Люкс автомашины hero 6–8 секундэд
       явдаг. CSS-ийн `rail` анимацитай ЗААВАЛ таарах ёстой. */
    var DELAY = 6500, DUR = 850;   /* CSS: --hero-dur = 850ms, rail = 6.5s */

    /* ══ ХОЙШЛУУЛСАН КАДРЫГ ЗАЛГАХ ══
       `HomeHero.tsx` нь 2–4-р кадрын хаягийг `data-srcset` /
       `data-src`-д хийж, LCP-ийн замаас ~360 КБ-ыг гаргасан.
       Энд тэднийг буцааж залгана. Хоёр өдөөгч:
         · `window.load` — хуудас тайван болмогц
         · эхний солилт — хэрэглэгч түүнээс өмнө үйлдэл хийвэл
       `data-defer` нь залгагдмагц хасагдана тул давхар
       ажиллахгүй. */
    function hydrateFrames() {
      var pending = root.querySelectorAll(".hero__slide[data-defer]");
      if (!pending.length) return;
      [].forEach.call(pending, function (sl) {
        [].forEach.call(sl.querySelectorAll("source[data-srcset]"), function (so) {
          so.setAttribute("srcset", so.getAttribute("data-srcset"));
          so.removeAttribute("data-srcset");
        });
        var im = sl.querySelector("img[data-src]");
        if (im) {
          im.setAttribute("src", im.getAttribute("data-src"));
          im.removeAttribute("data-src");
        }
        sl.removeAttribute("data-defer");
      });
    }
    if (document.readyState === "complete") hydrateFrames();
    else window.addEventListener("load", hydrateFrames, { once: true });

    function paint(prev) {
      slides.forEach(function (s, k) {
        if (k === i) {
          s.setAttribute("data-active", "");
          s.removeAttribute("data-out");
          s.removeAttribute("aria-hidden");
        } else {
          s.removeAttribute("data-active");
          s.setAttribute("aria-hidden", "true");
          if (k === prev) s.setAttribute("data-out", "");
          else s.removeAttribute("data-out");
        }
      });
      dots.forEach(function (d, k) {
        d.setAttribute("aria-pressed", k === i ? "true" : "false");
      });
      /* Гарчиг (загварын нэр) ба хавтан кадртай ЯГ ЗЭРЭГ солигдоно —
         зураг, нэр, бичвэр, зурвас дөрөв НЭГ систем шиг хөдөлнө.
         Идэвхгүй нэрүүд `aria-hidden` тул `<h1>` нь дэлгэц уншигчид
         үргэлж ЯГ НЭГ загварын нэр болж хүрнэ. */
      var swap = function (list) {
        list.forEach(function (el, k) {
          if (k === i) { el.setAttribute("data-active", ""); el.removeAttribute("aria-hidden"); }
          else { el.removeAttribute("data-active"); el.setAttribute("aria-hidden", "true"); }
        });
      };
      swap(names);
      swap(plates);
      /* «Дэлгэрэнгүй» нь ХАРАГДАЖ БАЙГАА загварын хуудас руу
         орно. Хаяг нь `data-model`-оос бүтнэ (= загварын id).
         JS ажиллахгүй бол эхний кадрын хаяг HTML-д аль хэдийн бичигдсэн.
         `aria-label` ч дагалдана — дэлгэц уншигчид «Дэлгэрэнгүй»
         гэсэн тодорхойгүй нэр биш, загварын нэртэй хүлээн авна. */
      /* ⚠ ӨМНӨ "/models/" + id + ".html" БАЙСАН — тэр нь static
         HTML болгон бүтээж байсан үеийн үлдэгдэл. Next.js-ийн
         маршрут нь `/models/tiggo-2` тул `.html` нь 404 өгч
         байсныг энэ дамжлагад зассан. */
      var id = slides[i].getAttribute("data-model");
      var label = names[i] ? names[i].textContent.trim() : "";
      if (detail) {
        if (id) detail.setAttribute("href", "/models/" + id);
        if (label) {
          detail.setAttribute("aria-label", "CHERY " + label + " — дэлгэрэнгүй үзэх");
        }
      }
      /* Анхдагч CTA нь ХАРАГДАЖ БУЙ загварыг нэрлэнэ. Харагдах
         бичвэр («Үнийн санал авах») хэвээр — зөвхөн дэлгэц уншигчид
         аль машины тухай мэдээлэл болохыг сонсоно. */
      if (lead && label) {
        lead.setAttribute("aria-label", "CHERY " + label + " — үнийн санал авах");
      }

      /* Байрлалын тоолуур. Явцын зураасны урт нь `--p` custom
         property-оор дамжина — CSS өөрөө тооцно, JS нь px
         бодохгүй (`--dx`-тэй ижил хэв маяг). */
      /* Мобайлд сонгогч нь хэвтээ гүйдэг (дөрвөн загвар 390px-д
         багтахгүй). Идэвхтэй загвар харагдацаас ГАДНА үлдвэл
         хэрэглэгч аль машиныг үзэж байгаагаа мэдэхгүй — Tiggo 8
         (4 дэх) нээгдэхэд яг тэр болж байсныг рендерээр барив.
         Тиймээс идэвхтэйг нь харагдах бүсийн ТӨВД авчирна. */
      if (rail && rail.scrollWidth > rail.clientWidth && dots[i] && rail.scrollTo) {
        var d = dots[i];
        var target = d.offsetLeft - (rail.clientWidth - d.offsetWidth) / 2;
        try {
          rail.scrollTo({
            left: Math.max(0, target),
            behavior: reduced ? "auto" : "smooth"
          });
        } catch (err) { rail.scrollLeft = Math.max(0, target); }
      }
    }

    function show(n, dir) {
      var prev = i;
      var next = (n + slides.length) % slides.length;
      if (next === prev) return;

      /* `window.load` хүлээлгүй — хэрэглэгч аль хэдийн кадар
         солих гэж байгаа тул зураг нь ЭНД хэрэгтэй. */
      hydrateFrames();

      /* Чиглэл: заагаагүй бол индексийн зөрүүгээр. Төгсгөлөөс
         эхлэл рүү шилжихэд ч «урагшаа» мэдрэгдэнэ. */
      if (!dir) dir = next > prev ? 1 : -1;
      if (prev === slides.length - 1 && next === 0) dir = 1;
      if (prev === 0 && next === slides.length - 1) dir = -1;

      frames.setAttribute("data-dir", dir < 0 ? "prev" : "next");
      i = next;
      paint(prev);

      /* ⚠ ЗӨВХӨН `slides[prev]`-ыг цэвэрлэдэг байсан: хурдан
         дараалан дарахад өмнөх таймер цуцлагдаж, тэр кадар дээр
         `data-out` МӨНХӨД үлдэж, дараа нь дахин идэвхжихэд
         хоёр төлөв зөрчилдөж байв. Одоо идэвхтэйгээс бусад
         БҮГДИЙГ цэвэрлэнэ — төлөв нь ямар ч дарааллаас
         үл хамааран нэг утгатай. */
      clearTimeout(outTimer);
      outTimer = setTimeout(function () {
        slides.forEach(function (sl, k) {
          if (k !== i) sl.removeAttribute("data-out");
        });
      }, DUR + 40);
    }

    /* ⚠ Гараар сонгосны дараа автомат солилт ҮРГЭЛЖИЛНЭ
       (захиалагчийн шийдвэр): сонгогчийн доогуурх зураас дахин
       дүүрч, дараагийн кадар руу шилжсээр байна. Өмнө нэг удаа
       дарахад бүрмөсөн зогсдог байсныг цуцлав.

       Зогсоох механизм хоёулаа хэвээр:
         · hover / focus — уншиж байх хугацаанд зогсоно
         · `prefers-reduced-motion` — автомат солилт огт эхлэхгүй
       Гараар сонгох, чирэх, заагч, гарын товчлуур БҮГД ажиллана. */
    function play() {
      stop();
      if (reduced) return;
      timer = setInterval(function () { show(i + 1, 1); }, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    /* Сонгосны дараа тоолуур ЭХНЭЭС нь эхэлнэ (`play()` нь
       `stop()`-оор өмнөх интервалыг цуцалдаг) — хэрэглэгч
       сонгосон машинаа бүтэн 4 секунд харна. */
    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { show(k); play(); });
    });

    /* Удирдлага нь JS-гүй үед утгагүй тул маркапад `hidden` гэж
       ирдэг. Энд л нээгдэнэ — үхмэл товч хэзээ ч харагдахгүй. */
    if (ctrl) {
      ctrl.hidden = false;
      var prevBtn = ctrl.querySelector("[data-hero-prev]");
      var nextBtn = ctrl.querySelector("[data-hero-next]");

      /* Заагчаар шилжсэн нь «би өөрөө удирдаж байна» гэсэн санал
         тул зогсоолтыг ТАЙЛНА — эс тэгвээс дараах товч ажиллаад
         дараа нь юу ч болохгүй, төлөв нь ойлгомжгүй болно. */
      if (prevBtn) prevBtn.addEventListener("click", function () { show(i - 1, -1); play(); });
      if (nextBtn) nextBtn.addEventListener("click", function () { show(i + 1, 1); play(); });
    }

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { show(i + 1, 1); play(); }
      else if (e.key === "ArrowLeft") { show(i - 1, -1); play(); }
    });

    /* Хэрэглэгч уншиж байхад бүү сольё */
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else play();
    });

    /* ---------- Чирэх: хулгана + хуруу ----------
       `pointer` эвент нь хоёуланг нь нэг замаар шийднэ. Товч, холбоос
       дээрээс эхэлсэн чирэлтийг ҮЛ ТООМСОРЛОНО — эс тэгвээс «Тест
       драйв захиалах» дарахад слайд солигдоно. */
    var drag = false, x0 = 0, dx = 0, W = 1, justDragged = false;

    function peekAt(dir) {
      var k = (i + dir + slides.length) % slides.length;
      slides.forEach(function (s, idx) {
        if (idx === k && idx !== i) s.setAttribute("data-peek", dir > 0 ? "next" : "prev");
        else s.removeAttribute("data-peek");
      });
    }

    function dragStart(e) {
      if (e.button != null && e.button !== 0) return;
      if (e.target.closest && e.target.closest("a, button, input, select, textarea, summary")) return;
      drag = true; x0 = e.clientX; dx = 0;
      W = frames.getBoundingClientRect().width || 1;
      frames.style.setProperty("--dx", "0px");
      frames.setAttribute("data-dragging", "");
      stop();
      if (root.setPointerCapture && e.pointerId != null) {
        try { root.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }

    function dragMove(e) {
      if (!drag) return;
      dx = e.clientX - x0;
      /* Захын эсэргүүцэл — хэт хол чирэхэд удаашрана */
      var lim = W * 0.9;
      if (Math.abs(dx) > lim) dx = (dx > 0 ? 1 : -1) * (lim + (Math.abs(dx) - lim) * 0.25);
      frames.style.setProperty("--dx", dx + "px");
      peekAt(dx < 0 ? 1 : -1);
    }

    function dragEnd() {
      if (!drag) return;
      drag = false;
      var moved = dx;
      /* `--dx`-ийг АРИЛГАХГҮЙ: `data-dragging` авагдмагц шилжилт нь
         одоогийн байрлалаас үргэлжилнэ. Дараагийн чирэлт дээр шинэчлэгдэнэ. */
      frames.removeAttribute("data-dragging");
      slides.forEach(function (s) { s.removeAttribute("data-peek"); });

      var TH = Math.max(56, W * 0.09);
      if (Math.abs(moved) > TH) {
        /* Чирэлтийн дараах суулт богино — CSS-ийн `data-quick` */
        frames.setAttribute("data-quick", "");
        show(moved < 0 ? i + 1 : i - 1, moved < 0 ? 1 : -1);
        setTimeout(function () { frames.removeAttribute("data-quick"); }, 900);
      }

      /* Чирсэн бол дараа нь ирэх `click`-ийг залгина. `dx`-ийг шууд
         тэглэвэл click хүртэл мэдээлэл үлдэхгүй тул тусдаа тугтай. */
      justDragged = Math.abs(moved) > 6;
      setTimeout(function () { justDragged = false; }, 0);
      dx = 0;
      play();
    }

    root.addEventListener("pointerdown", dragStart);
    root.addEventListener("pointermove", dragMove, { passive: true });
    root.addEventListener("pointerup", dragEnd);
    root.addEventListener("pointercancel", dragEnd);
    /* Заагч hero-гоос гармагц чирэлт дуусна — гадна тавихад «гацахгүй» */
    root.addEventListener("pointerleave", dragEnd);
    /* Чирсний дараах хуурамч click-ийг залгина */
    root.addEventListener("click", function (e) {
      if (justDragged) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    paint(-1);
    play();
  }

  /* ---------- 2. Өнгө сонгогч ---------- */
  function initSwatches(root) {
    var btns = [].slice.call(root.querySelectorAll(".swatch"));
    var imgs = [].slice.call(root.querySelectorAll(".swatch-stage img"));
    var name = root.querySelector(".swatch-name");
    if (!btns.length || !imgs.length) return;

    btns.forEach(function (b, k) {
      b.addEventListener("click", function () {
        btns.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        imgs.forEach(function (im, j) {
          if (j === k) im.setAttribute("data-shown", "");
          else im.removeAttribute("data-shown");
        });
        if (name) {
          name.innerHTML = b.getAttribute("data-mn") +
            ' <span>(' + b.getAttribute("data-en") + ')</span>';
        }
      });
    });
  }

  /* ---------- 3. Наалдмал өгүүлэмжийн зураг ---------- */
  function initStory(root) {
    var items = [].slice.call(root.querySelectorAll(".story__item"));
    var imgs = [].slice.call(root.querySelectorAll(".story__pic img"));
    if (!items.length || !imgs.length || !("IntersectionObserver" in window)) return;

    function shown(k) {
      imgs.forEach(function (im, j) {
        if (j === k) im.setAttribute("data-shown", "");
        else im.removeAttribute("data-shown");
      });
    }
    shown(0);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) shown(items.indexOf(en.target));
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    items.forEach(function (it) { io.observe(it); });
  }

  /* ---------- 4б. Тоо өсгөх тоолуур ----------
     ⚠ Дизайны системийн §14-д «тоо өсгөх тоолуур» хориотой байсныг
     захиалагчийн шийдвэрээр ЗӨВШӨӨРӨВ (шагналын хуудсанд ЗӨВХӨН).
     Хэрэгжүүлэлт:
       · зөвхөн харагдах үед нэг удаа ажиллана (IntersectionObserver)
       · `prefers-reduced-motion` үед огт өсгөхгүй, шууд эцсийн тоо
       · JS ажиллахгүй бол HTML дотор эцсийн тоо аль хэдийн бичээстэй */
  function initCount(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var dec = parseInt(el.getAttribute("data-dec"), 10) || 0;
    var pre = el.getAttribute("data-pre") || "";
    var suf = el.getAttribute("data-suf") || "";
    if (isNaN(to)) return;

    function paint(v) { el.textContent = pre + v.toFixed(dec) + suf; }
    if (reduced || !("IntersectionObserver" in window)) { paint(to); return; }

    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || done) return;
        done = true;
        io.disconnect();

        var DUR = 1400, t0 = null;
        function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / DUR, 1);
          /* easeOutExpo — эхэндээ хурдан, төгсгөлдөө зөөлөн зогсоно */
          var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          paint(to * e);
          if (p < 1) requestAnimationFrame(step);
          else paint(to);
        }
        paint(0);
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ---------- 5. Харьцуулалт — багана унтраах ----------
     JS-гүй үед дөрвүүлээ харагдана; чекбокс нь НЭМЭЛТ хялбарчлал.
     Сүүлийн баганыг унтраахыг зөвшөөрөхгүй — хоосон хүснэгт
     хэрэглэгчид ямар ч үнэ цэн өгөхгүй. */
  function initCompare(root) {
    var boxes = [].slice.call(root.querySelectorAll('input[name="cmp"]'));
    if (!boxes.length) return;

    function apply() {
      var on = boxes.filter(function (b) { return b.checked; })
                    .map(function (b) { return b.value; });
      root.querySelectorAll("[data-col]").forEach(function (cell) {
        cell.hidden = on.indexOf(cell.getAttribute("data-col")) === -1;
      });
      boxes.forEach(function (b) { b.disabled = b.checked && on.length === 1; });
    }

    boxes.forEach(function (b) { b.addEventListener("change", apply); });
    apply();
  }

  /* ---------- 5б. Цэсний төлөв — hero дээр тунгалаг ----------
     Hero-гийн доод ирмэг цэсний доогуур орох үед `is-stuck` нэмнэ.
     Гүйлгэлтийн сонсогч БИШ, IntersectionObserver — фрэйм алдахгүй. */
  /* ⚠ ӨМНӨ IntersectionObserver-ЭЭР ХИЙГДСЭН БАЙСАН.
     Тэр нь `rootMargin: "-72px 0px 0px 0px"` дээр тулгуурладаг
     бөгөөд туршилтад ТОГТВОРГҮЙ байв: гүйлгэлтийн 1200px-д класс
     нэмэгдээд 1500px-д арилж байсныг хэмжив. Уг класс арилахад
     цагаан агуулга дээр ЦАГААН цэсний бичвэр үлдэж, цэс УНШИГДАХГҮЙ
     болно — §19-ийн контрастын шаардлагыг зөрчинө.

     Одоо ердөө `scrollY` ба hero-гийн өндрийг харьцуулна: логик нь
     нэг мөр, тайлбарлахад эргэлзээгүй, `rootMargin`-ийн нарийвчлалаас
     хамаарахгүй. `passive` тул гүйлгэлтийг хойшлуулахгүй. */
  function initNavState() {
    var nav = document.querySelector(".nav");
    var hero = document.querySelector(".hero");
    /* ⚙ ӨМНӨ `document.body.classList.contains("home")` байсан.
       Next.js-ийн root layout нь бүх хуудсанд НЭГ тул `<body>` дээр
       хуудас тусгайлсан класс тавих нь inline скрипт (CSP хориотой)
       эсвэл hydration-ы дараах useEffect (анхны рендерт цайралт)
       шаардана. Төлөвийг nav өөрөө эзэмших нь бүтцээрээ зөв. */
    if (!nav || !hero || !nav.classList.contains("nav--hero")) return;

    /* ⚠ ХЯЗГААР НЬ HERO-ГИЙН ДООД ИРМЭГ БАЙСАН: цэс нь бүтэн
       дэлгэц гүйлгэтэл тунгалаг хэвээр байж, дараа нь ЦАГААН
       болж үсэрдэг байв. Одоо цэс нь хоёр төлөвтөө ижил (цагаан
       бичвэр, цагаан тэмдэг) бөгөөд ердөө ард нь бүрхэг шил
       ойртдог тул хязгаарыг ГҮЙЛГЭЛТИЙН ЭХЭНД авчрав —
       хэрэглэгч хөдөлсөн даруйдаа хариу мэдэрнэ (§3).

       `hero` нь одоо шаардлагагүй ч шалгалт нь хэвээр: hero-гүй
       хуудсанд `nav--hero` огт тавигддаггүй. */
    var THRESHOLD = 24;

    function paint() {
      nav.classList.toggle("is-stuck", window.scrollY > THRESHOLD);
    }

    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  /* ---------- 6. Мобайл цэс ---------- */
  function initBurger() {
    var d = document.querySelector(".burger");
    if (!d) return;
    var sum = d.querySelector("summary");
    var close = function (refocus) {
      if (!d.hasAttribute("open")) return;
      d.removeAttribute("open");
      if (refocus && sum) sum.focus();
    };
    /* Төлөв: aria-label/expanded, хуудасны гүйлгэлт түгжигдэнэ */
    d.addEventListener("toggle", function () {
      var open = d.hasAttribute("open");
      if (sum) {
        sum.setAttribute("aria-expanded", open ? "true" : "false");
        sum.setAttribute("aria-label", open ? "Цэс хаах" : "Цэс нээх");
      }
      document.documentElement.classList.toggle("menu-open", open);
    });
    d.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.closest(".burger__backdrop")) close(false);
    });
    document.addEventListener("click", function (e) {
      if (!d.contains(e.target)) close(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close(true);
    });
  }

  /* ---------- 6б. Газрын зураг — дарж ачаалах ---------- */
  function initMap(box) {
    var btn = box.querySelector("[data-map-load]");
    var src = box.getAttribute("data-src");
    if (!btn || !src) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = src;
      f.title = "Шоурумын байршил — Google Maps";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.appendChild(f);
      var face = box.querySelector(".mapbox__face");
      if (face) face.remove();
    });
  }

  /* ---------- 9. МЭДЭЭЛЭЛ АВАХ МОДАЛ ----------
     Native `<dialog>`-ийн `showModal()` нь Esc-ээр хаагдах, фокусын
     урхи, дэвсгэрийг inert болгох, хаагдахад фокусыг нээсэн товч руу
     эргүүлэх зэргийг БҮГДИЙГ өөрөө хийдэг — тэднийг гараар бичихгүй.

     ⚠ Товчны `href` нь ХЭВЭЭР үлдсэн: `showModal` дэмжигдэхгүй эсвэл
     JS ачаалагдаагүй бол хэрэглэгч «Холбоо барих» хуудасны маягт руу
     хэвийн орно. Тиймээс `preventDefault` нь ЗӨВХӨН модал бодитоор
     нээгдэх боломжтой үед хийгдэнэ. */
  function initModal() {
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var dlg = document.getElementById(btn.getAttribute("data-modal-open"));
        if (!dlg || typeof dlg.showModal !== "function") return;   /* href-ээр явна */
        e.preventDefault();

        /* Аль загварын кадр харагдаж байхад дарсныг далд талбарт
           бичнэ. Харагдацыг бохирдуулахгүйгээр дилерт контекст хүрнэ. */
        var f = dlg.querySelector("[data-lead-model]");
        var active = document.querySelector(".hero__slide[data-active]");
        if (f) f.value = (active && active.getAttribute("data-model")) || "";

        /* Загварын нэр нь ХАРАГДАНА: хэрэглэгч аль машины тухай
           асууж байгаагаа маягт дээрээ баталгаажуулна. Hero-гүй
           хуудсанд (эсвэл нэр байхгүй бол) анхдагч «Захиалга»
           шошго хэвээр — хоосон мөр гарахгүй. */
        var tag = dlg.querySelector("[data-lead-model-name]");
        if (tag) {
          var mn = active && active.getAttribute("data-name");
          tag.textContent = mn ? "CHERY " + mn : "Захиалга";
        }

        dlg.showModal();
      });
    });

    document.querySelectorAll("dialog").forEach(function (dlg) {
      dlg.querySelectorAll("[data-modal-close]").forEach(function (x) {
        x.addEventListener("click", function () { dlg.close(); });
      });

      /* Хайрцгийн ГАДНА дарахад хаагдана. `<dialog>` дээрх click нь
         дэвсгэр (::backdrop) дарахад ч ирдэг тул зорилтыг шалгана. */
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) dlg.close();
      });
    });
  }

  /* ---------- 10. ХЭСГИЙН ИЛРЭЛТ — НӨХӨН БУУЛТ ----------
     `.reveal` нь CSS-ийн `animation-timeline: view()` дээр
     бүтсэн бөгөөд тэр нь Chrome/Edge-д л ажилладаг. Firefox,
     хуучин Safari дээр хуудас БҮРЭН ХӨДӨЛГӨӨНГҮЙ сууж байв.

     Энд ижил үр дүнг IntersectionObserver-ээр гаргана. Зөвхөн
     дэмжлэггүй хөтөч дээр ажиллана — эс тэгвээс хоёр механизм
     нэг элементийг зэрэг удирдана.

     ⚠ Нэг удаа илэрмэгц ажиглалтаас ГАРНА: хэрэглэгч буцаж
     гүйлгэхэд агуулга дахин бүдгэрэх нь эвгүй. */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;
    if (reduced) return;

    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 11. ДЭЭШ БУЦАХ ----------
     Нэг дэлгэц (0.9 × цонхны өндөр) гүйлгэсний дараа товч илэрч,
     дарахад дээд рүү гулсана. `prefers-reduced-motion` үед гулсалт
     нь агшин зуурын (behavior: "auto"). Гүйлгэлт нь `passive` +
     `requestAnimationFrame`-ээр хязгаарлагдсан тул фрэйм алдахгүй. */
  function initBackToTop() {
    var btn = document.querySelector("[data-to-top]");
    if (!btn) return;

    var ticking = false;
    function update() {
      ticking = false;
      var show = window.scrollY > window.innerHeight * 0.9;
      btn.classList.toggle("is-visible", show);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------- 12. ЛИДИЙН МАЯГТ ----------
     `/api/lead` руу fetch-ээр илгээж, хуудас дахин ачаалахгүйгээр
     маягтын оронд хариуг харуулна. JS-гүй үед маягт энгийн POST
     хийж `/thanks` руу redirect болно. */
  var LEAD_ERRORS = {
    validation: "Нэр, 8 оронтой утасны дугаараа шалгаад дахин илгээнэ үү.",
    rate: "Хэт олон удаа илгээлээ. Түр хүлээгээд дахин оролдоно уу.",
    config: "Маягт түр ажиллахгүй байна. Шоурум руу шууд залгана уу.",
    server: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу."
  };

  /* Утас: «9911 2233» — 8 оронтой дотоод дугаарыг 4-4 бүлэглэнэ,
     +976 угтвартай бол хэвээр үлдээнэ. */
  function formatPhone(v) {
    var plus = /^\s*\+/.test(v);
    var d = v.replace(/\D/g, "");
    if (plus || (d.length > 8 && d.indexOf("976") === 0)) {
      var rest = d.replace(/^976/, "").slice(0, 8);
      return "+976 " + (rest.length > 4 ? rest.slice(0, 4) + " " + rest.slice(4) : rest);
    }
    d = d.slice(0, 8);
    return d.length > 4 ? d.slice(0, 4) + " " + d.slice(4) : d;
  }
  function phoneDigits(v) {
    var d = v.replace(/\D/g, "");
    return d.length > 8 && d.indexOf("976") === 0 ? d.slice(3) : d;
  }

  /* Талбарын алдааг ТУХАЙН талбарын доор харуулна */
  function fieldError(input, text) {
    var field = input.closest(".field");
    if (!field) return;
    var msg = field.querySelector(".field__err");
    if (!text) {
      field.classList.remove("field--error");
      input.removeAttribute("aria-invalid");
      if (msg) msg.remove();
      return;
    }
    field.classList.add("field--error");
    input.setAttribute("aria-invalid", "true");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "field__err";
      msg.id = (input.id || input.name) + "-err";
      field.appendChild(msg);
      input.setAttribute("aria-describedby", msg.id);
    }
    msg.textContent = text;
  }

  function initLeadForms() {
    if (!window.fetch || !window.FormData) return;

    /* Загвар, зорилгыг хаягаас урьдчилан сонгоно:
       /contact?model=tiggo-8&purpose=test-drive#захиалга */
    var params = new URLSearchParams(location.search);
    var pModel = params.get("model"), pPurpose = params.get("purpose");

    document.querySelectorAll('form[action="/api/lead"]').forEach(function (form) {
      var sel = form.querySelector('select[name="model"]');
      if (sel && pModel && sel.querySelector('option[value="' + pModel + '"]')) sel.value = pModel;
      if (pPurpose) {
        var r = form.querySelector('input[name="purpose"][value="' + pPurpose + '"]');
        if (r) r.checked = true;
      }

      var phone = form.querySelector('input[name="phone"]');
      var name = form.querySelector('input[name="name"]');
      if (phone) {
        phone.addEventListener("input", function () {
          var end = phone.selectionEnd === phone.value.length;
          phone.value = formatPhone(phone.value);
          if (end) phone.setSelectionRange(phone.value.length, phone.value.length);
          if (phoneDigits(phone.value).length === 8) fieldError(phone, "");
        });
      }
      if (name) name.addEventListener("input", function () { if (name.value.trim()) fieldError(name, ""); });
      /* JS ажиллаж байвал хөтчийн bubble-ийн оронд талбарын доорх
         алдаа; JS-гүй үед `required` хэвээр ажиллана. */
      form.noValidate = true;

      var src = form.querySelector("[data-lead-source]");
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : "";
      var msg = document.createElement("p");
      msg.className = "note";
      msg.setAttribute("role", "status");
      msg.hidden = true;
      if (btn) btn.insertAdjacentElement("beforebegin", msg);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.getAttribute("aria-busy") === "true") return;
        var bad = null;
        if (name && !name.value.trim()) { fieldError(name, "Нэрээ оруулна уу."); bad = bad || name; }
        if (phone && phoneDigits(phone.value).length !== 8) {
          fieldError(phone, "8 оронтой утасны дугаараа оруулна уу.");
          bad = bad || phone;
        }
        if (bad) { bad.focus(); return; }
        if (src) src.value = location.pathname;
        form.setAttribute("aria-busy", "true");
        msg.hidden = true;
        if (btn) { btn.disabled = true; btn.classList.add("is-loading"); btn.textContent = "Илгээж байна…"; }

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        })
          .then(function (r) { return r.json().catch(function () { return { ok: false, error: "server" }; }); })
          .then(function (res) {
            if (res.ok) {
              var done = document.createElement("div");
              done.className = "form";
              done.setAttribute("role", "status");
              done.innerHTML =
                '<p class="meta">Амжилттай</p><h3 class="h3">Хүсэлт амжилттай илгээгдлээ</h3>' +
                '<p class="body">Манай зөвлөх ажлын цагаар тантай холбогдох болно.</p>';
              form.replaceWith(done);
              return;
            }
            msg.textContent = LEAD_ERRORS[res.error] || LEAD_ERRORS.server;
            msg.hidden = false;
          })
          .catch(function () {
            msg.textContent = "Интернет холболтоо шалгаад дахин оролдоно уу.";
            msg.hidden = false;
          })
          .then(function () {
            form.removeAttribute("aria-busy");
            if (btn) { btn.disabled = false; btn.classList.remove("is-loading"); btn.textContent = label; }
          });
      });
    });
  }

  /* ---------- 13. МОБАЙЛ ҮЙЛДЛИЙН МӨР (загварын хуудас) ----------
     Hero харагдаж байх үед нуугдана (тэнд товч бий), өнгөрмөгц
     доороос гарч ирнэ. Хөлд хүрэхэд дахин нуугдана — хаягийг хаахгүй. */
  function initMobileCta() {
    var bar = document.querySelector("[data-mcta]");
    var hero = document.querySelector(".hero--model");
    var foot = document.querySelector(".foot");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var heroIn = true, footIn = false;
    var paint = function () {
      var on = !heroIn && !footIn;
      bar.classList.toggle("is-on", on);
      document.documentElement.classList.toggle("has-mcta", on);
    };
    new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; paint(); }).observe(hero);
    if (foot) new IntersectionObserver(function (e) { footIn = e[0].isIntersecting; paint(); }).observe(foot);
  }

  function ready() {
    document.documentElement.classList.remove("no-js");
    initMobileCta();
    initLeadForms();
    var hero = document.querySelector(".hero");
    if (hero) initHero(hero);
    document.querySelectorAll("[data-swatches]").forEach(initSwatches);
    document.querySelectorAll("[data-story]").forEach(initStory);
    document.querySelectorAll("[data-count]").forEach(initCount);
    document.querySelectorAll("[data-cmp]").forEach(initCompare);
    document.querySelectorAll("[data-map]").forEach(initMap);
    initNavState();
    initBurger();
    initModal();
    initReveal();
    initBackToTop();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
