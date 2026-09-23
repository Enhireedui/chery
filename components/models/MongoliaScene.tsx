/* ══════════════════════════════════════════════════════════════
   МОНГОЛ ТАЙЗ — машины ард зөөлөн чимэглэл.

   Санаа нь chery georgia-гийнх (Тбилисийн чимэглэл) — орон нутгийн
   дүр төрх машины ард. Энд: Богд хан уулын нуруу, Улаанбаатарын
   тэнгэрийн шугам (Blue Sky цамхагийн далбаат хэлбэр), тал нутгийн
   гэрүүд. «Мөнх хөх тэнгэр»-ийн цайвар хөхөөс тэнгэрийн хаяаны
   зөөлөн тоорын өнгө рүү.

   ⚙ ХЭМЖЭЭ: `viewBox` 1600×700, газрын шугам y=640. `.ms-scene__art`
   нь машины хайрцгаас 30%-иар хоёр тийш гарч, газрын шугамыг яг
   дугуйн доор (хайрцгийн 92%) тааруулна — `site.css` §22a1.

   ⚙ ДАВХАРГА (`data-depth`): солих үед `ModelsSection` нь давхарга
   бүрийг машины чиглэлд depth-тэй пропорциональ бага зэрэг гулсуулна
   — ойр нь их, алс нь бага. Зөвхөн `transform`.

   Ирмэг нь `.ms-scene`-ийн CSS маскаар цагаан руу уусна: хүрээтэй «зураг» биш,
   тайзны орчин. Өнгө зориуд цайвар — машин давамгайлах ёстой.
   ══════════════════════════════════════════════════════════════ */

export default function MongoliaScene() {
  return (
    <svg
      className="ms-scene__art"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dde6f4" />
          <stop offset=".62" stopColor="#ebe9f1" />
          <stop offset=".9" stopColor="#f6e6dc" />
        </linearGradient>
        <linearGradient id="mn-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ece2d6" />
          <stop offset="1" stopColor="#f6f1ea" />
        </linearGradient>
        {/* Гэр — нэг удаа зурж, давтан байрлуулна */}
        <g id="mn-ger">
          {/* Хана — бага зэрэг бөөрөнхий, дээвэр — намхан конус, тооно */}
          <path d="M-44 0Q-47 -14 -44 -28H44Q47 -14 44 0z" fill="#fbf8f4" />
          <path d="M-44.6 -24Q0 -21 44.6 -24L44 -28H-44z" fill="#9aa9d6" />
          <path d="M-50 -27Q-26 -40 -9 -49H9Q26 -40 50 -27Q0 -31 -50 -27z" fill="#efe6da" />
          <path d="M-9 -49Q0 -53 9 -49z" fill="#d6c7b3" />
          <path d="M-8 0V-18Q0 -20 8 -18V0z" fill="#e4a684" />
        </g>
      </defs>

      <rect width="1600" height="700" fill="url(#mn-sky)" />
      <circle cx="1160" cy="150" r="58" fill="#f8dccb" opacity=".85" />

      {/* Алс нуруу — Богд хан уул */}
      <g data-depth="0.25">
        <path
          fill="#d2d9ee"
          d="M-80 470L40 400L150 330L250 360L360 250L470 300L560 210L680 270L780 180L900 240L1010 170L1120 240L1230 200L1340 280L1460 230L1580 300L1700 270V700H-80z"
        />
      </g>

      {/* Ойр нуруу + Улаанбаатарын тэнгэрийн шугам */}
      <g data-depth="0.55">
        <path
          fill="#c1cae8"
          d="M-80 540L60 470L190 500L320 420L450 480L600 430L760 490L900 440L1060 490L1200 440L1360 490L1500 450L1700 480V700H-80z"
        />
        <g fill="#b3bde2">
          <rect x="1180" y="470" width="34" height="110" />
          <rect x="1222" y="380" width="30" height="200" />
          {/* Blue Sky цамхаг — далбаат хэлбэр */}
          <path d="M1262 580V220Q1306 300 1322 580z" />
          <rect x="1332" y="400" width="32" height="180" />
          <rect x="1368" y="490" width="44" height="90" />
          <rect x="1420" y="468" width="24" height="112" />
          <rect x="130" y="500" width="30" height="80" />
          <rect x="166" y="478" width="22" height="102" />
          <rect x="196" y="512" width="40" height="68" />
        </g>
      </g>

      {/* Тал нутаг ба гэрүүд */}
      <g data-depth="1">
        <path fill="url(#mn-ground)" d="M-80 600Q400 570 800 590T1700 585V700H-80z" />
        <use href="#mn-ger" transform="translate(220 612) scale(1.6)" />
        <use href="#mn-ger" transform="translate(360 620) scale(1.2)" />
        <use href="#mn-ger" transform="translate(1440 616) scale(1.35)" />
      </g>
    </svg>
  );
}
