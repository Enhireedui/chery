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

   ⚙ ХОЁР ЗОХИОМЖ: `--wide` (desktop, 1600×700) ба `--tall` (утас,
   1000×800). Утсан дээр машин өргөнөө бараг эзэлдэг тул өргөн
   зохиомжийн гэр, хот харагдахгүй байв; босоо зохиомж нь уул, хотыг
   машины дээвэр дээгүүр өргөж, гэрүүдийг хоёр захад ойртуулна.
   Хоёулаа ижил давхаргатай (`data-depth`) — солих хөдөлгөөн адил.
   `id`-ууд угтвартай: нуугдсан (`display:none`) SVG доторх gradient-ийг
   нөгөө нь иш татвал зарим хөтөч зурдаггүй.

   Ирмэг нь `.ms-scene`-ийн CSS маскаар цагаан руу уусна: хүрээтэй «зураг» биш,
   тайзны орчин. Өнгө зориуд цайвар — машин давамгайлах ёстой.
   ══════════════════════════════════════════════════════════════ */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        {/* Дээд ирмэг нь тунгалаг — хуудасны цагаан руу уусна, шугам үлдэхгүй */}
        <stop offset="0" stopColor="#dde6f4" stopOpacity="0" />
        <stop offset=".2" stopColor="#dde6f4" />
        <stop offset=".62" stopColor="#ebe9f1" />
        <stop offset=".9" stopColor="#f6e6dc" />
      </linearGradient>
      <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ece2d6" />
        <stop offset="1" stopColor="#f6f1ea" />
      </linearGradient>
      {/* Гэр — хана бага зэрэг бөөрөнхий, дээвэр намхан конус, тооно */}
      <g id={`${id}-ger`}>
        <path d="M-44 0Q-47 -14 -44 -28H44Q47 -14 44 0z" fill="#fbf8f4" />
        <path d="M-44.6 -24Q0 -21 44.6 -24L44 -28H-44z" fill="#9aa9d6" />
        <path d="M-50 -27Q-26 -40 -9 -49H9Q26 -40 50 -27Q0 -31 -50 -27z" fill="#efe6da" />
        <path d="M-9 -49Q0 -53 9 -49z" fill="#d6c7b3" />
        <path d="M-8 0V-18Q0 -20 8 -18V0z" fill="#e4a684" />
      </g>
    </defs>
  );
}

/* Desktop — viewBox 1600×700, газрын шугам y=640. */
function Wide() {
  const id = "mnw";
  return (
    <svg className="ms-scene__art ms-scene__art--wide" viewBox="0 0 1600 700" aria-hidden="true" focusable="false">
      <Defs id={id} />
      <rect width="1600" height="700" fill={`url(#${id}-sky)`} />
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
        <path fill={`url(#${id}-ground)`} d="M-80 600Q400 570 800 590T1700 585V700H-80z" />
        <use href={`#${id}-ger`} transform="translate(220 612) scale(1.6)" />
        <use href={`#${id}-ger`} transform="translate(360 620) scale(1.2)" />
        <use href={`#${id}-ger`} transform="translate(1440 616) scale(1.35)" />
      </g>
    </svg>
  );
}

/* Утас — viewBox 1000×800, газрын шугам y=680. Машины хайрцаг нь
   зохиомжийн голын 80% (x 100–900), дээвэр нь ~y 410 орчим. */
function Tall() {
  const id = "mnt";
  return (
    <svg className="ms-scene__art ms-scene__art--tall" viewBox="0 0 1000 800" aria-hidden="true" focusable="false">
      <Defs id={id} />
      <rect width="1000" height="800" fill={`url(#${id}-sky)`} />
      <circle cx="770" cy="150" r="48" fill="#f8dccb" opacity=".85" />

      <g data-depth="0.25">
        <path
          fill="#d2d9ee"
          d="M-60 430L50 340L140 270L230 310L330 200L440 260L530 170L630 240L730 190L830 270L930 220L1060 290V800H-60z"
        />
      </g>

      <g data-depth="0.55">
        <path
          fill="#c1cae8"
          d="M-60 530L70 460L190 490L320 420L460 480L590 430L750 480L890 440L1060 470V800H-60z"
        />
        <g fill="#b3bde2">
          <rect x="716" y="520" width="30" height="130" />
          <rect x="752" y="440" width="32" height="210" />
          <path d="M792 650V250Q832 330 848 650z" />
          <rect x="858" y="470" width="34" height="180" />
          <rect x="898" y="540" width="44" height="110" />
          <rect x="44" y="560" width="26" height="90" />
          <rect x="76" y="530" width="24" height="120" />
          <rect x="106" y="575" width="38" height="75" />
        </g>
      </g>

      <g data-depth="1">
        <path fill={`url(#${id}-ground)`} d="M-60 646Q300 624 500 638T1060 634V800H-60z" />
        {/* Машины хоёр үзүүрт ард нь — нарийн дэлгэцэнд ч зах руу тасрахгүй */}
        <use href={`#${id}-ger`} transform="translate(250 640) scale(.75)" />
        <use href={`#${id}-ger`} transform="translate(98 652) scale(1.3)" />
        <use href={`#${id}-ger`} transform="translate(902 650) scale(1.2)" />
      </g>
    </svg>
  );
}

export default function MongoliaScene() {
  return (
    <>
      <Wide />
      <Tall />
    </>
  );
}
