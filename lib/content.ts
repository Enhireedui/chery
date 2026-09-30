import { resolve, type L, type Locale, type Localized } from "./i18n";

/* ══════════════════════════════════════════════════════════════
   CHERY Mongolia — АГУУЛГЫН ЦОРЫН ГАНЦ ЭХ СУРВАЛЖ

   ⚙ ЯАГААД ЭНЭ НЬ ӨГӨГДЛИЙН САНД БИШ, КОДОД БАЙНА:
   Загвар, үзүүлэлт, шоурум, баталгаа зэрэг нь ТОГТМОЛ маркетингийн
   агуулга — жилд хэдхэн удаа л засагдана, хувилбар нь Git-д хөтлөгдөх
   нь давуу тал, build-time дээр static HTML болж хувирдаг тул
   хамгийн хурдан. Өгөгдлийн сан нь ЗӨВХӨН хэрэглэгчээс ирдэг
   өгөгдөлд (лид) хэрэглэгдэнэ — `lib/supabase.ts`-ийг үз.

   ⚙ ХОЁР ХЭЛ: текст талбар бүр `{ mn, en }` (`L`). Үнэ, зураг,
   тоо, өнгөний код зэрэг хэлнээс үл хамаарах өгөгдөл НЭГ Л удаа
   бичигдэнэ. Хуудас нь `getContent(locale)`-оор нэг хэлний
   хувилбарыг авна. Техникийн үзүүлэлтийн ШОШГО энд байхгүй —
   `messages/*.json`-ийн `specs.rows`-д (нэр томьёоны толь,
   `docs/GLOSSARY.md`). Нэг ойлголт сайт даяар НЭГ л нэртэй.

   ⚙ ОРЧУУЛГА БИШ, НУТАГШУУЛАЛТ: English текст нь монголоос үг
   үгээр буулгасан биш — ижил утгыг англи хэлний автомашины
   брэндийн сайтад байх байгалийн хэллэгээр бичсэн (UK English).

   Бүх тоо, үнэ, тайлбар нь амьд сайт (chery.sain-motors.mn) болон
   Chery-ийн албан ёсны сурвалжаас гаралтай. Баримтгүй зүйл ЗОХИОХГҮЙ.

   Зөрчилтэй тохиолдолд баримталсан журам:
     · Үзүүлэлтийн ХҮСНЭГТ нь зар сурталчилгааны бичвэрээс дээгүүр.
     · Хоёр бие даасан хуудас нийлж байвал тэр нь эрх бүхий.
     · Аль нь ч тодорхойгүй бол ОГТ НИЙТЭЛЭХГҮЙ.
   ══════════════════════════════════════════════════════════════ */

/* ---------- ТҮЛХҮҮРҮҮД (шошго нь messages/*.json-д) ---------- */

export type SegmentKey = "compact" | "mid" | "seven";
export type SpecGroupKey = "dimensions" | "engine" | "safety" | "exterior" | "interior";
export type DimKey = "length" | "width" | "height" | "wheelbase" | "clearance";
export type SpecKey =
  | "lwh" | "wheelbase" | "track" | "clearance" | "turning" | "seats"
  | "curb" | "gross" | "payload" | "cargo" | "cd"
  | "engine" | "power" | "torque" | "vmax" | "accel" | "gearbox"
  | "drive" | "tank" | "suspFront" | "suspRear" | "tires" | "brakes";

/** Хэлнээс үл хамаарах мөр ЭСВЭЛ хоёр хэлтэй текст. */
type Text = string | L;

/* ---------- ЭХ ТӨРЛҮҮД (хоёр хэлтэй) ---------- */

interface SiteSrc {
  brandName: string;
  legal: L;
  role: L;
  phone: string;
  phoneHref: string;
  address: { line1: L; line2: L; locality: L };
  /** [өдөр, цаг] */
  hours: Array<[L, Text]>;
  geo: { lat: number; lng: number };
  mapLink: string;
  finance: { downPayment: L; term: L };
  warranty: { years: L; km: L };
}

interface NavItemSrc {
  /** Угтваргүй (Монгол) хаяг — хэлний угтварыг хуудас нэмнэ. */
  href: string;
  label: L;
  /** Дэд цэс (desktop: dropdown, мобайл: accordion) */
  children?: NavItemSrc[];
}

/** Нүүрний hero-гийн кадр. `img` нь `/assets/img/{img}.avif|webp`. */
interface SlideSrc {
  id: string;
  model: string;
  line: L;
  img: string;
  /** Кадрын байршил — зургийн `alt`-д орно. */
  scene: L;
}

interface StorySrc {
  img: string;
  eyebrow: L;
  title: L;
  body: L;
}

interface ColorSrc {
  /** Энгийн нэр («Цагаан» / «White») */
  name: L;
  /** Үйлдвэрийн будгийн нэр — брошюраас, орчуулахгүй */
  paint: string;
  hex: string;
  img: string;
}

/** Нэг мөр: түлхүүр + хувилбар тус бүрийн утга (Tiggo 4-т хоёр). */
interface SpecRowSrc {
  k: SpecKey;
  v: Text[];
}

/** Үзүүлэлтийн бүлэг. `rows` (хүснэгт) ЭСВЭЛ `list` (жагсаалт). */
interface SpecGroupSrc {
  g: SpecGroupKey;
  /** Хоёр хувилбартай загварын багануудын нэр (Tiggo 4: 1.5L CVT / 1.5T 6DCT) */
  cols?: string[];
  rows?: SpecRowSrc[];
  list?: L[];
}

interface PanelSrc {
  /** Хэсгийн зангуу — хоёр хэлэнд ИЖИЛ (хуваалцсан холбоос эвдрэхгүй) */
  id: string;
  img: string;
  imgTall?: string;
  eyebrow: L;
  title: L;
  body?: L;
  /** [утга, хэмжээний түлхүүр] — мм */
  dims?: Array<[string, DimKey]>;
  note?: L;
}

/** «Гол тоо» — шошго нь `specs.rows[k]`, `note` нь хувилбар (1.5T). */
interface FigureSrc {
  k: SpecKey;
  v: string;
  note?: string;
}

interface ModelSrc {
  id: string;
  name: string;
  /** Харьяалахын тийн ялгал: «Tiggo 7-гийн» (тоог дуудлагаар нь
   *  залгана: хоёрын, дөрвийн, долоогийн, наймын). English-д нэр. */
  gen: L;
  segment: SegmentKey;
  tagline: L;
  lede: L;
  /** `null` = үнэ нээлттэй зарлаагүй (Tiggo 7) */
  price: { from: number; to?: number; note: string } | null;
  /** Үнэ зарлаагүй загварын hero-д */
  priceNote?: L;
  /** Үзүүлэлт баталгаажаагүй загварт */
  specsNote?: L;
  hero: string;
  heroTall?: string;
  card: string;
  /** Борлуулалтын брошюр — зөвхөн Tiggo 2-д байгаа */
  brochure?: { href: string; label: string; note: L };
  panels?: PanelSrc[];
  /** `null` = үзүүлэлт баталгаажаагүй (Tiggo 7) */
  figures: FigureSrc[] | null;
  story: StorySrc[];
  colors: ColorSrc[];
  /** Tiggo 7-д үзүүлэлт баталгаажаагүй тул `null` */
  specs: SpecGroupSrc[] | null;
  gallery?: string[];
}

interface BrandSrc {
  figures: Array<[L | string, L | string]>;
  records: Array<[string, L, L]>;
  awards: Array<[string, L, L]>;
}

interface FaqSrc {
  q: L;
  a: L;
}

interface TestDriveSrc {
  title: L;
  lede: L;
  /** [гарчиг, тайлбар] */
  steps: Array<[L, L]>;
}

interface PillarSrc {
  k: L;
  t: L;
  b: L;
}

/** Мэдээний нийтлэл. Одоогоор 0 — бодит мэдээ гарах хүртэл хоосон. */
interface NewsItemSrc {
  slug: string;
  title: L;
  date: string;
  lede: L;
  body?: L;
}

interface AwardsSrc {
  lede: L;
  hero: { img: string; badge: string };
  ticker: Text[];
  figures: Array<{ pre: string; to: number; dec: number; suf: Text; label: Text }>;
  global: Array<{ year: string; title: Text; body: L; src: string }>;
  jdp: { lede: L; rows: Array<[string, string, L]> };
  byModel: Array<{ id: string; segment: string; tag?: L; list: L[] }>;
  records: Array<[string, L, L, L]>;
  markets: Array<[string, L, L, L]>;
  safety: Array<[string, string, Text, L, L]>;
}

/* ---------- ТУСЛАХ ---------- */

const same = (s: string): L => ({ mn: s, en: s });
const join = (a: L, sep: string, b: L): L => ({ mn: a.mn + sep + b.mn, en: a.en + sep + b.en });

/* Давтагдах нэг утгатай мөрүүд — сайт даяар НЭГ хэлбэрээр */
const FWD: L = { mn: "FWD (урд дугуй)", en: "FWD (front-wheel drive)" };
const MACPHERSON: L = { mn: "MacPherson, үл хамаарах", en: "MacPherson, independent" };
const F = {
  airbags4: { mn: "SRS аюулгүйн дэр – 4 ширхэг", en: "4 SRS airbags" },
  pretension: { mn: "Ослын үед урьдчилан чангардаг суудлын бүс", en: "Pretensioning seat belts" },
  beltReminder: { mn: "Суудлын бүс бүслэхийг сануулах дохио", en: "Seat belt reminder" },
  isofix: { mn: "ISOFIX® хүүхдийн суудлын бэхэлгээ", en: "ISOFIX® child seat anchors" },
  childLock: { mn: "Child Safety Lock хаалганы түгжээ", en: "Child safety door locks" },
  tcsEsp: { mn: "Шарвалтын эсрэг болон тогтворжуулагч систем", en: "Traction and stability control" },
  autohold: { mn: "Түр зогсолтын Autohold систем", en: "Auto Hold" },
  sensors: { mn: "Ухрах болон зогсоолын мэдрэгч", en: "Reversing and parking sensors" },
  underguard: { mn: "Хөдөлгүүрийн доод хэсгийн үйлдвэрийн хамгаалалт", en: "Factory engine underguard" },
  premiumLed: { mn: "Урд талын дээд зэргийн LED гэрлүүд", en: "Premium LED headlights" },
  acousticScreen: { mn: "Дуу тусгаарлагч урд салхины шил", en: "Acoustic windscreen" },
  mirrors: { mn: "Цахилгаанаар халдаг, автоматаар хураагддаг хажуугийн толь", en: "Heated, power-folding door mirrors" },
  mirrorSignals: { mn: "Хажуугийн толин дээрх дохионы гэрэл", en: "Mirror-mounted indicators" },
  sportRails: { mn: "Дээврийн спорт загварын ачааны мөр", en: "Sport roof rails" },
  leatherWheel: { mn: "Арьсан бүрээстэй, олон үйлдэлтэй жолооны хүрд", en: "Leather multifunction steering wheel" },
  usb2: { mn: "USB цэнэглэгч оролт (2 ширхэг)", en: "2 USB charging ports" },
  rearVents: { mn: "Арын эгнээний тусгайлсан агааржуулагч", en: "Rear air vents" },
  heatedSeats: { mn: "Урд суудал халаагч", en: "Heated front seats" },
  split4060: { mn: "Арын суудлын 40/60 эвхэгддэг түшлэг", en: "40/60 split-folding rear seats" },
  keyless: { mn: "Түлхүүргүй орох (Keyless entry) болон асаах систем", en: "Keyless entry and push-button start" },
  camera360: { mn: "360° HD панорамик харах камерын систем", en: "360° HD panoramic camera" },
} satisfies Record<string, L>;

/* ============================================================
   САЙТ
   ============================================================ */
export const site: SiteSrc = {
  brandName: "CHERY",
  legal: { mn: "Сайн Моторс ХХК", en: "Sain Motors LLC" },
  role: {
    mn: "Chery брэндийн Монгол дахь албан ёсны дистрибьютор",
    en: "Official distributor of Chery in Mongolia",
  },
  phone: "7255-8855",
  phoneHref: "tel:+97672558855",
  /* Бүтэн хаяг — contact-us хуудаснаас */
  address: {
    line1: { mn: "Нарны хороолол, Parko Riveria", en: "Parko Riveria, Narny Khoroolol" },
    line2: { mn: "БГД, 26-р хороо, Улаанбаатар", en: "26th Khoroo, Bayangol District, Ulaanbaatar" },
    locality: { mn: "Улаанбаатар", en: "Ulaanbaatar" },
  },
  /* contact-us хуудас БА footer хоёул ижил хэлж байгаа тул эрх бүхий.
     dealer хуудас «Бямба 09:00–21:00» гэдэг нь ганц зөрүү — засах ёстой. */
  hours: [
    [{ mn: "Даваа – Баасан", en: "Monday – Friday" }, "09:00 – 21:00"],
    [{ mn: "Бямба", en: "Saturday" }, "09:00 – 19:00"],
    [{ mn: "Ням", en: "Sunday" }, { mn: "Амарна", en: "Closed" }],
  ],
  /* contact-us дахь бодит Google Maps холбоосны координат */
  geo: { lat: 47.904448, lng: 106.902714 },
  mapLink:
    "https://www.google.com/maps/place/Chery+showroom+Sain+Motors/@47.904448,106.9001391,1248m/data=!3m2!1e3!4b1!4m6!3m5!1s0x5d96930015a25c67:0x422814b026c80918!8m2!3d47.904448!4d106.902714",
  finance: {
    downPayment: { mn: "10%-аас", en: "From 10%" },
    term: { mn: "96 сар хүртэл", en: "Up to 96 months" },
  },
  warranty: {
    years: { mn: "3 жил", en: "3 years" },
    km: { mn: "100,000 км", en: "100,000 km" },
  },
};

/* Навигаци — худалдан авагчийн хэрэгцээгээр, дотоод агуулгын
   ангиллаар биш. Дэд холбоос бүр ОДОО БАЙГАА агуулга руу заана.
   «Мэдээ» толгойн цэснээс ГАРСАН: бодит нийтлэл 0 (хоосон мэдээ
   нь «орхигдсон сайт» гэсэн дохио өгнө); хөлнөөс холбогдоно. */
export const nav: NavItemSrc[] = [
  { label: { mn: "Загварууд", en: "Models" }, href: "/models" },
  {
    label: { mn: "Chery-ийн тухай", en: "About Chery" },
    href: "/brand",
    children: [
      { label: { mn: "Chery-ийн тухай", en: "About Chery" }, href: "/brand" },
      { label: { mn: "Дэлхий дахинд", en: "Chery worldwide" }, href: "/brand#дэлхийд" },
      { label: { mn: "Технологи", en: "Safety & technology" }, href: "/awards#аюулгүй-байдал" },
      { label: { mn: "Амжилт, шагнал", en: "Awards" }, href: "/awards" },
    ],
  },
  { label: { mn: "Үйлчилгээ", en: "Service" }, href: "/service" },
  {
    label: { mn: "Худалдан авалт", en: "Shopping tools" },
    href: "/contact?purpose=quote#захиалга",
    children: [
      { label: { mn: "Үнийн санал авах", en: "Request a quote" }, href: "/contact?purpose=quote#захиалга" },
      { label: { mn: "Тест драйв захиалах", en: "Book a test drive" }, href: "/contact?purpose=test-drive#захиалга" },
      { label: { mn: "Санхүүжилт", en: "Financing" }, href: "/#нөхцөл" },
    ],
  },
  { label: { mn: "Холбоо барих", en: "Contact" }, href: "/contact" },
];

/* Хөлний бүлгүүд — худалдан авагчийн замаар. */
export const footerGroups: Array<{ title: L; links: NavItemSrc[] }> = [
  {
    title: { mn: "Загварууд", en: "Models" },
    links: [
      { label: same("TIGGO 8"), href: "/models/tiggo-8" },
      { label: same("TIGGO 7"), href: "/models/tiggo-7" },
      { label: same("TIGGO 4"), href: "/models/tiggo-4" },
      { label: same("TIGGO 2"), href: "/models/tiggo-2" },
    ],
  },
  {
    title: { mn: "Худалдан авалт", en: "Shopping tools" },
    links: [
      { label: { mn: "Үнийн санал", en: "Request a quote" }, href: "/contact?purpose=quote#захиалга" },
      { label: { mn: "Тест драйв", en: "Test drive" }, href: "/contact?purpose=test-drive#захиалга" },
      { label: { mn: "Санхүүжилт", en: "Financing" }, href: "/#нөхцөл" },
    ],
  },
  {
    title: { mn: "Эзэмшигчдэд", en: "Owners" },
    links: [
      { label: { mn: "Үйлчилгээ", en: "Service" }, href: "/service" },
      { label: { mn: "Баталгаа", en: "Warranty" }, href: "/service#баталгаа" },
      { label: { mn: "Сэлбэг", en: "Genuine parts" }, href: "/#нөхцөл" },
      { label: { mn: "Түгээмэл асуулт", en: "FAQ" }, href: "/service#асуулт" },
    ],
  },
  {
    title: same("Sain Motors · Chery"),
    links: [
      { label: { mn: "Chery-ийн тухай", en: "About Chery" }, href: "/brand" },
      { label: { mn: "Амжилт, шагнал", en: "Awards" }, href: "/awards" },
      { label: { mn: "Холбоо барих", en: "Contact" }, href: "/contact" },
    ],
  },
];

/* ============================================================
   НҮҮРНИЙ СЛАЙДЕР — амьд сайтын Slider Revolution-ы ЯГ ТЭР 4 зураг.
   Хэвтээ (2.1:1) ба босоо (0.46) хос бүрэн байдаг тул art direction
   хийх боломжтой: мобайлд тэнгэр дээр, дэлгэцэд зүүн талд бичвэр.

   ⚠ ДАРААЛАЛ НЬ ФЛАГМАНААС ЭХЭЛНЭ (Tiggo 8 → 7 → 4 → 2): автомашины
   брэнд нүүр хуудсандаа хамгийн дээд загвараа эхэлж үзүүлдэг.
   Загварын ЖАГСААЛТ (`models`, /models) нь ЭСРЭГЭЭР жижигээс том —
   тэнд хэрэглэгч үнэ, хэмжээгээр харьцуулдаг. Хоёр дараалал ЗОРИУД өөр.
   ============================================================ */
export const slides: SlideSrc[] = [
  {
    id: "tiggo-8", model: "Tiggo 8", img: "hero-t8-steppe",
    line: { mn: "7 суудалтай гэр бүлийн SUV", en: "The seven-seat family SUV" },
    scene: { mn: "Монголын тал нутгийн зам дээр, нар жаргах үед", en: "on a steppe road in Mongolia at sunset" },
  },
  {
    id: "tiggo-7", model: "Tiggo 7", img: "hero-t7-ub-v7",
    line: { mn: "Дэвшилтэт технологитой дунд оврын SUV", en: "The tech-forward mid-size SUV" },
    scene: { mn: "Улаанбаатар хотод, үдшийн бүрийд", en: "in Ulaanbaatar at dusk" },
  },
  {
    id: "tiggo-4", model: "Tiggo 4", img: "hero-t4-terelj-v2",
    line: { mn: "Өдөр тутмын хэрэглээнд тохиромжтой", en: "Made for every day" },
    scene: { mn: "Тэрэлжийн хөндийд, өглөөний нарны гэрэлд", en: "in the Terelj valley in the morning sun" },
  },
  {
    id: "tiggo-2", model: "Tiggo 2", img: "hero-t2-winter-v13",
    line: { mn: "Хотын авсаархан SUV", en: "The compact city SUV" },
    scene: { mn: "өвлийн өглөө, цастай гудамжинд", en: "on a snowy street on a winter morning" },
  },
];

/* ============================================================
   ЗАГВАРУУД
   ============================================================ */
const models: ModelSrc[] = [
  {
    id: "tiggo-2",
    name: "Tiggo 2",
    gen: { mn: "Tiggo 2-ын", en: "Tiggo 2" },
    segment: "compact",
    tagline: { mn: "Хотын өдөр тутамд", en: "Built for the city" },
    /* Хуудасны өөрийнх нь бичвэрээс */
    lede: {
      mn:
        "Очир алмааз мэт гялалзах урд дизайн, LED гэрлийн хурц шийдэл. " +
        "Хотын гудамжинд авсаархан, өдөр бүрийн хэрэглээнд бэлэн.",
      en:
        "A diamond-cut front end and crisp LED lighting. " +
        "Compact on city streets and ready for every day.",
    },
    price: { from: 48999900, note: "1.5L CVT Comfort" },
    hero: "t2-34",
    /* Утсан дээрх босоо кадар — студийн 16:9 зураг босоо дэлгэцэнд
       хажуугаараа хүчтэй тайрагддаг тул зөвхөн мобайлд. */
    heroTall: "t2-hero-tall",
    card: "t2-34",
    brochure: {
      href: "/assets/dl/chery-tiggo-2-brochure.pdf",
      label: "Tiggo 2",
      note: { mn: "Брошюр · PDF · 5.3 МБ", en: "Brochure · PDF · 5.3 MB" },
    },
    /* Бүтэн дэлгэцийн хэсгүүд. `dims` байвал хэмжээг зурган
       дээр тэмдэглэнэ, `body` байвал бичвэр гарна. */
    panels: [
      {
        id: "хэмжээ",
        img: "t2-p-side",
        /* Утсанд эх сурвалжийн өөрийн мобайл кадар (1000×1766). */
        imgTall: "t2-p-side-tall",
        eyebrow: { mn: "Хэмжээ", en: "Dimensions" },
        title: { mn: "Хотод авсаархан", en: "Compact for the city" },
        dims: [
          ["4200", "length"],
          ["1760", "width"],
          ["1570", "height"],
          ["2555", "wheelbase"],
          ["178", "clearance"],
        ],
        note: { mn: "Бүх хэмжээ миллиметрээр.", en: "All dimensions in millimetres." },
      },
      {
        id: "экстериор",
        img: "t2-p-top",
        eyebrow: { mn: "Экстериор", en: "Exterior" },
        title: { mn: "Авсаархан биет, бүтэн дээвэр", en: "Compact body, full-length roof" },
        body: {
          mn:
            "Торон радиатор ба LED гэрлүүд. Ухаалаг панорамик шилэн дээвэр, " +
            "дээврийн ачааны мөр — 4.2 метрийн биетэд орох бүхнийг оруулав.",
          en:
            "A mesh grille and LED lights, a smart panoramic glass roof and " +
            "roof rails — everything a 4.2-metre body can hold.",
        },
      },
      {
        id: "интериор",
        img: "t2-p-cabin",
        eyebrow: { mn: "Интериор", en: "Interior" },
        title: { mn: "Хүйтэнд суухад бэлэн", en: "Ready for winter mornings" },
        body: {
          mn:
            "Жолоочийн мэдээллийн самбар, төвийн ухаалаг дэлгэц, Apple CarPlay. " +
            "Урд суудал халаагч, арын эгнээнд тусгайлсан агааржуулагч, " +
            "түлхүүргүй орох, асаах систем.",
          en:
            "A driver information display, central touchscreen and Apple CarPlay. " +
            "Heated front seats, dedicated rear air vents, keyless entry " +
            "and push-button start.",
        },
      },
    ],
    /* «Гол тоо» — үзүүлэлтийн хүснэгтээс шууд */
    figures: [
      { k: "lwh", v: "4200 × 1760 × 1570" },
      { k: "wheelbase", v: "2555" },
      { k: "cargo", v: "420" },
      { k: "accel", v: "9.7" },
    ],
    story: [
      {
        img: "t2-front",
        eyebrow: { mn: "Экстериор", en: "Exterior" },
        title: { mn: "Загварлаг дизайн", en: "Striking design" },
        body: {
          mn:
            "Очир алмааз мэт гялалзах нүүрний урд дизайн болон LED гэрлийн " +
            "хурц шийдэл нь замын хөдөлгөөнд таныг онцгой, хүчирхэг харагдуулна.",
          en:
            "A diamond-inspired front end and sharp LED lighting help you " +
            "stand out in every lane.",
        },
      },
      {
        img: "t2-life",
        eyebrow: { mn: "Жолоодлого", en: "Driving" },
        title: { mn: "Аэродинамикийн шийдэл", en: "Aerodynamic by design" },
        body: {
          mn:
            "Хурд, эрч хүчийг мэдрүүлэх динамик шугамууд болон хөнгөн цагаан " +
            "хайлшин обуд нь зөвхөн үзэмж бус, тогтвортой жолоодлогын баталгаа болно.",
          en:
            "Dynamic lines that suggest speed, and alloy wheels that do more " +
            "than look good — they keep the car composed on the road.",
        },
      },
    ],
    /* Будгийн нэрс нь ЗАГВАРЫН БРОШЮРЭЭС (эх зургийн файлын нэр ч
       `ink-black`, `na-silver` гэж таарна). */
    colors: [
      { name: { mn: "Цагаан", en: "White" }, paint: "Khaki White", hex: "#E8E6E1", img: "t2-c-white" },
      { name: { mn: "Хар", en: "Black" }, paint: "Ink Black", hex: "#17181B", img: "t2-c-black" },
      { name: { mn: "Улаан", en: "Red" }, paint: "Suya Red", hex: "#8E1B22", img: "t2-c-red" },
      { name: { mn: "Саарал", en: "Silver" }, paint: "Na Silver", hex: "#A9ADB2", img: "t2-c-silver" },
    ],
    specs: [
      {
        g: "dimensions",
        rows: [
          { k: "lwh", v: ["4200 × 1760 × 1570"] },
          { k: "wheelbase", v: ["2555"] },
          { k: "track", v: ["1495 / 1484"] },
          { k: "clearance", v: ["178"] },
          { k: "turning", v: ["5.25"] },
          { k: "seats", v: ["5"] },
          { k: "curb", v: ["1215"] },
          { k: "gross", v: ["1515"] },
          { k: "cargo", v: ["420"] },
          { k: "cd", v: ["0.302"] },
        ],
      },
      {
        g: "engine",
        rows: [
          { k: "engine", v: [{ mn: "1.5L бензин", en: "1.5L petrol" }] },
          { k: "power", v: ["109"] },
          { k: "torque", v: ["140"] },
          { k: "vmax", v: ["160"] },
          { k: "accel", v: ["9.7"] },
          { k: "gearbox", v: ["CVT"] },
          { k: "drive", v: [FWD] },
          { k: "tank", v: ["50"] },
          { k: "suspFront", v: [MACPHERSON] },
          { k: "suspRear", v: [{ mn: "Хагас хамааралт", en: "Semi-independent" }] },
          { k: "tires", v: ["205/55 R16"] },
          { k: "brakes", v: [{ mn: "Дискэн, цахилгаан гар тоормос", en: "Discs, electronic parking brake" }] },
        ],
      },
      {
        g: "safety",
        list: [
          F.airbags4,
          F.pretension,
          F.beltReminder,
          F.isofix,
          F.childLock,
          { mn: "Шарвалтын эсрэг TCS систем", en: "Traction control (TCS)" },
          F.autohold,
          F.sensors,
        ],
      },
      {
        g: "exterior",
        list: [
          { mn: "Ухаалаг панорамик шилэн дээвэр (75″)", en: "Smart panoramic glass roof (75″)" },
          { mn: "Урд талын LED гэрлүүд", en: "LED headlights" },
          { mn: "Хойд талын спорт загварын LED гэрлүүд", en: "Sport-style LED tail lights" },
          { mn: "Урд салхины шил халаагч систем", en: "Heated windscreen" },
          F.mirrors,
          F.mirrorSignals,
          { mn: "Дээврийн ачааны мөр", en: "Roof rails" },
          F.underguard,
        ],
      },
      {
        g: "interior",
        list: [
          { mn: "Жолоочийн мэдээллийн хянах самбар (3.5″)", en: "Driver information display (3.5″)" },
          { mn: "Төвийн ухаалаг мультимедиа дэлгэц (9″)", en: "Central multimedia touchscreen (9″)" },
          { mn: "Bluetooth холболт", en: "Bluetooth connectivity" },
          F.leatherWheel,
          { mn: "4 чанга яригчтай дуугаралтын систем", en: "4-speaker audio system" },
          F.usb2,
          { mn: "Автомат хурд баригч (Cruise Control)", en: "Cruise control" },
          F.rearVents,
          F.heatedSeats,
          F.split4060,
          F.keyless,
        ],
      },
    ],
  },

  {
    id: "tiggo-4",
    name: "Tiggo 4",
    gen: { mn: "Tiggo 4-ийн", en: "Tiggo 4" },
    segment: "compact",
    tagline: { mn: "Практик хэрэглээ, орчин үеийн дизайн", en: "Practicality meets modern design" },
    lede: {
      mn:
        "Хүчирхэг хөдөлгүүр, дэвшилтэт ADAS системүүд болон тав тухтай салон нь " +
        "таныг замын хөдөлгөөнд өөртөө итгэлтэй оролцох боломжийг олгоно.",
      en:
        "A strong engine, advanced driver assistance and a comfortable cabin " +
        "give you the confidence to take on any drive.",
    },
    price: { from: 59999900, to: 64999900, note: "1.5L CVT / 1.5T 6DCT" },
    /* Тэрэлжийн кадарт машин баруун тийш, зүүн тал бичвэрт чөлөөтэй;
       босоо хувилбар нь утсанд. */
    hero: "hero-t4-terelj-v2",
    heroTall: "hero-t4-terelj-v2-tall",
    card: "t4-front34",
    figures: [
      { k: "lwh", v: "4320 × 1831 × 1652" },
      { k: "wheelbase", v: "2610" },
      { k: "power", v: "154", note: "1.5T" },
      { k: "accel", v: "9.5", note: "1.5T" },
    ],
    story: [
      {
        img: "t4-side",
        eyebrow: { mn: "Экстериор", en: "Exterior" },
        title: { mn: "Найдвар", en: "Dependable" },
        body: {
          mn:
            "Ажил хэрэгч хотын гудамжаас аялал зугаалгын зам хүртэл таныг " +
            "хэзээ ч замаас буцаахгүй найдвартай автомашин.",
          en:
            "From busy city streets to weekend road trips — a car you can " +
            "count on to go the distance.",
        },
      },
      {
        img: "t4-interior",
        eyebrow: { mn: "Интериор", en: "Interior" },
        title: { mn: "Хос 10.25″ дэлгэц", en: "Dual 10.25″ screens" },
        body: {
          mn:
            "Жолоочийн дижитал хянах самбар болон төвийн мультимедиа дэлгэц " +
            "хоёулаа 10.25 инч. Утасгүй цэнэглэгч, 360° панорамик камер.",
          en:
            "Both the digital instrument cluster and the central multimedia screen " +
            "measure 10.25 inches. Plus wireless charging and a 360° panoramic camera.",
        },
      },
      {
        img: "t4-boot",
        eyebrow: { mn: "Хэмнэлт", en: "Efficiency" },
        title: { mn: "1.5 турбо ба 6 шатлалт DCT", en: "1.5 turbo with 6-speed DCT" },
        body: {
          mn:
            "1.5 литрийн турбо хөдөлгүүр болон 6 шатлалт DCT хурдны хайрцаг нь " +
            "шатахуун зарцуулалтыг бага түвшинд барьж, хотын жолоодлогыг хялбарчилна.",
          en:
            "The 1.5-litre turbo engine and 6-speed dual-clutch transmission keep " +
            "fuel consumption low and make city driving effortless.",
        },
      },
    ],
    gallery: ["t4-front", "t4-front34", "t4-rear34", "t4-side", "t4-boot", "t4-wheel", "t4-interior", "t4-life"],
    colors: [
      { name: { mn: "Цагаан", en: "White" }, paint: "Khaki White", hex: "#E8E6E1", img: "t4-c-white" },
      { name: { mn: "Хар", en: "Black" }, paint: "Carbon Crystal Black", hex: "#17181B", img: "t4-c-black" },
      { name: { mn: "Улаан", en: "Red" }, paint: "Blood Stone Red", hex: "#8E1B22", img: "t4-c-red" },
      { name: { mn: "Саарал", en: "Silver" }, paint: "Moonlight Silver", hex: "#A9ADB2", img: "t4-c-silver" },
    ],
    specs: [
      {
        g: "dimensions",
        rows: [
          { k: "lwh", v: ["4320 × 1831 × 1652"] },
          { k: "wheelbase", v: ["2610"] },
          { k: "track", v: ["1550 / 1550"] },
          { k: "clearance", v: ["178"] },
          { k: "turning", v: ["5.2"] },
          { k: "seats", v: ["5"] },
          { k: "curb", v: ["1404"] },
          { k: "gross", v: ["1830"] },
          { k: "payload", v: ["426"] },
          { k: "cargo", v: ["340"] },
          { k: "cd", v: ["0.268"] },
        ],
      },
      {
        g: "engine",
        cols: ["1.5L CVT", "1.5T 6DCT"],
        rows: [
          {
            k: "engine",
            v: [
              { mn: "1.5L атмосфер", en: "1.5L naturally aspirated" },
              { mn: "1.5T турбо", en: "1.5T turbo" },
            ],
          },
          { k: "power", v: ["109", "154"] },
          { k: "torque", v: ["140", "210"] },
          { k: "vmax", v: ["160", "185"] },
          { k: "accel", v: ["9.7", "9.5"] },
          { k: "gearbox", v: ["CVT", { mn: "6 DCT автомат", en: "6-speed DCT" }] },
          { k: "drive", v: [FWD, FWD] },
          { k: "tank", v: ["50", "50"] },
          { k: "tires", v: ["215/60 R17", "215/60 R17"] },
        ],
      },
      {
        g: "safety",
        list: [
          F.airbags4,
          F.pretension,
          F.beltReminder,
          F.isofix,
          F.childLock,
          F.tcsEsp,
          F.autohold,
          F.sensors,
        ],
      },
      {
        g: "exterior",
        list: [
          F.premiumLed,
          { mn: "Хойд талын LED гэрлийн систем", en: "LED tail lights" },
          F.acousticScreen,
          F.mirrors,
          F.mirrorSignals,
          { mn: "Дуу нэвтрүүлдэггүй шилний систем", en: "Acoustic side glass" },
          F.sportRails,
          F.underguard,
        ],
      },
      {
        g: "interior",
        list: [
          { mn: "Жолоочийн дижитал хянах самбар – 10.25″", en: "10.25″ digital instrument cluster" },
          { mn: "Төвийн ухаалаг мультимедиа дэлгэц – 10.25″", en: "10.25″ central multimedia touchscreen" },
          F.camera360,
          { mn: "Утасгүй цэнэглэгч ба хурд тохируулагч", en: "Wireless charger and cruise control" },
          F.leatherWheel,
          { mn: "Дуугаралтын систем (1.5T: 6 чанга яригч / 1.5L: 4)", en: "Audio system (1.5T: 6 speakers / 1.5L: 4)" },
          F.usb2,
          F.rearVents,
          F.heatedSeats,
          F.split4060,
          F.keyless,
        ],
      },
    ],
  },

  {
    id: "tiggo-7",
    name: "Tiggo 7",
    gen: { mn: "Tiggo 7-гийн", en: "Tiggo 7" },
    segment: "mid",
    tagline: { mn: "Технологи, тав тух", en: "Technology and comfort" },
    lede: {
      mn:
        "Футурист дизайн болон ухаалаг технологийн шийдлээрээ бусдаас ялгарна. " +
        "12.3 инчийн хос дэлгэц, панорам дээвэр, агаар ионжуулагч систем.",
      en:
        "Futuristic design and smart technology set it apart. Dual 12.3-inch " +
        "screens, a panoramic roof and a cabin air ioniser.",
    },
    /* ⚠ Амьд сайт дээрх Tiggo 7-гийн үзүүлэлтийн хүснэгт нь Tiggo 2-ынх
       ХУУЛАГДСАН байна («Tiggo 2 1.5L-CVT Comfort», 4200×1760×1570,
       48,999,900₮). Тиймээс энэ загварын ТОО, ҮНИЙГ огт нийтлэхгүй. */
    price: null,
    priceNote: {
      mn: "Үнэ ба үзүүлэлтийг шоурумаас лавлана уу",
      en: "Contact the showroom for pricing and specifications",
    },
    hero: "t7-34",
    card: "t7-34",
    figures: null,
    story: [
      {
        img: "t7-side",
        eyebrow: { mn: "Экстериор", en: "Exterior" },
        title: { mn: "Загварлаг дизайн", en: "Striking design" },
        body: {
          mn:
            "Хотын гудамжинд футурист дизайн болон ухаалаг технологийн " +
            "шийдлээрээ бусдаас ялгарна.",
          en: "Futuristic design and smart technology make it stand out on any city street.",
        },
      },
      {
        img: "t7-interior",
        eyebrow: { mn: "Хүч", en: "Performance" },
        title: { mn: "Турбо хөдөлгүүр ба 4WD", en: "Turbo power and 4WD" },
        body: {
          mn:
            "1.5 литрийн TGDI турбо хөдөлгүүр болон 6 шатлалт DCT хурдны хайрцаг " +
            "нь хүчийг мэдрүүлж, 4WD системээр аливаа замыг төвөггүй туулна.",
          en:
            "A 1.5-litre TGDI turbo engine and 6-speed DCT deliver strong " +
            "performance, while the 4WD system takes any road in its stride.",
        },
      },
      {
        img: "t7-roof",
        eyebrow: { mn: "Интериор", en: "Interior" },
        title: { mn: "Тансаг зэрэглэлийн тав тух", en: "Luxury-class comfort" },
        body: {
          mn:
            "Сайжруулсан арьсан салон, агаар ионжуулагч систем нь доторх агаарыг " +
            "цэвэршүүлж, панорам дээвэр болон 12.3 инчийн хос дэлгэц нь аяллыг " +
            "илүү сонирхолтой болгоно.",
          en:
            "An upgraded leather interior and an air ioniser that keeps the cabin " +
            "air clean, while the panoramic roof and dual 12.3-inch screens make " +
            "every journey more enjoyable.",
        },
      },
    ],
    gallery: ["t7-front", "t7-34", "t7-side", "t7-wheel", "t7-interior", "t7-roof", "t7-boot"],
    colors: [
      { name: { mn: "Цагаан", en: "White" }, paint: "Khaki White", hex: "#E8E6E1", img: "t7-c-white" },
      { name: { mn: "Хар", en: "Black" }, paint: "Carbon Crystal Black", hex: "#17181B", img: "t7-c-black" },
      { name: { mn: "Улаан", en: "Red" }, paint: "Blood Stone Red", hex: "#8E1B22", img: "t7-c-red" },
      { name: { mn: "Саарал", en: "Silver" }, paint: "Moonlight Silver", hex: "#A9ADB2", img: "t7-c-silver" },
    ],
    specs: null,
    specsNote: {
      mn:
        "Tiggo 7-гийн техникийн үзүүлэлтийг баталгаажуулж байгаа бөгөөд удахгүй " +
        "нийтэлнэ. Дэлгэрэнгүй мэдээллийг шоурумаас лавлана уу.",
      en:
        "Technical specifications for the Tiggo 7 are being verified and will be " +
        "published soon. Please contact the showroom for details.",
    },
  },

  {
    id: "tiggo-8",
    name: "Tiggo 8",
    gen: { mn: "Tiggo 8-ын", en: "Tiggo 8" },
    segment: "seven",
    tagline: { mn: "Долоон суудал, бүтэн гэр бүл", en: "Seven seats. Room for everyone." },
    lede: {
      mn:
        "Гэр бүлийн бүх гишүүний тав тухыг хангасан 7 суудалтай автомашин. " +
        "Иж бүрэн ADAS систем болон 6 ширхэг SRS дэр нь аюулгүй байдлыг хангана.",
      en:
        "A seven-seater designed around the whole family’s comfort. A full " +
        "driver-assistance suite and six SRS airbags keep everyone safe.",
    },
    price: { from: 89999900, note: "1.6T GDI Luxury" },
    hero: "t8-rear34",
    card: "t8-front34",
    figures: [
      { k: "lwh", v: "4722 × 1860 × 1705" },
      { k: "wheelbase", v: "2710" },
      { k: "seats", v: "7" },
      { k: "cargo", v: "1179 / 2101" },
    ],
    story: [
      {
        img: "t8-safety",
        eyebrow: { mn: "Аюулгүй байдал", en: "Safety" },
        title: { mn: "Бат бөх их бие", en: "A strong, rigid body" },
        body: {
          mn:
            "Иж бүрэн ADAS систем болон 6 ширхэг SRS хамгаалах дэр нь ямар ч " +
            "замын нөхцөлд аюулгүй байдлыг тань бүрэн хангана.",
          en:
            "A comprehensive driver-assistance suite and six SRS airbags keep " +
            "you protected in every road condition.",
        },
      },
      {
        img: "t8-seats",
        eyebrow: { mn: "Интериор", en: "Interior" },
        title: { mn: "Чимээгүй салон", en: "A quiet cabin" },
        body: {
          mn:
            "Дуу чимээг 34 децибел хүртэл тусгаарлах технологи нь гэр бүлийн " +
            "аяллыг хамгийн амар амгалан, тансаг болгоно.",
          en:
            "Sound insulation that brings cabin noise down to 34 dB makes " +
            "every family journey calm and refined.",
        },
      },
      {
        img: "t8-console",
        eyebrow: { mn: "Технологи", en: "Technology" },
        title: { mn: "Хос 12.3″ дэлгэц", en: "Dual 12.3″ screens" },
        body: {
          mn:
            "Дуу хоолойгоор удирдах систем, GPS навигаци, 8 чанга яригчтай " +
            "дуугаралт болон 360° панорамик камер.",
          en:
            "Voice control, GPS navigation, an 8-speaker sound system and a " +
            "360° panoramic camera.",
        },
      },
    ],
    gallery: ["t8-side", "t8-rear34", "t8-wheel", "t8-roof", "t8-console", "t8-seats", "t8-door", "t8-mirror"],
    colors: [
      { name: { mn: "Цагаан", en: "White" }, paint: "Khaki White", hex: "#E8E6E1", img: "t8-c-white" },
      { name: { mn: "Хар", en: "Black" }, paint: "Carbon Crystal Black", hex: "#17181B", img: "t8-c-black" },
      { name: { mn: "Ногоон", en: "Green" }, paint: "Aurora Green", hex: "#1E4638", img: "t8-c-green" },
      { name: { mn: "Саарал", en: "Silver" }, paint: "Moonlight Silver", hex: "#A9ADB2", img: "t8-c-silver" },
    ],
    specs: [
      {
        g: "dimensions",
        rows: [
          { k: "lwh", v: ["4722 × 1860 × 1705"] },
          { k: "wheelbase", v: ["2710"] },
          { k: "track", v: ["1582 / 1604"] },
          { k: "clearance", v: ["196"] },
          { k: "turning", v: ["5.7"] },
          { k: "seats", v: ["7"] },
          { k: "curb", v: ["1658"] },
          { k: "gross", v: ["2280"] },
          { k: "cargo", v: ["1179 / 2101"] },
          { k: "cd", v: ["0.34"] },
        ],
      },
      {
        g: "engine",
        rows: [
          { k: "engine", v: ["1.6T GDI"] },
          { k: "power", v: ["183"] },
          { k: "torque", v: ["275"] },
          { k: "vmax", v: ["200"] },
          { k: "accel", v: ["9.7"] },
          { k: "gearbox", v: [{ mn: "7 DCT хос шүүрүүрт автомат", en: "7-speed dual-clutch (DCT)" }] },
          { k: "drive", v: [FWD] },
          { k: "tank", v: ["51"] },
          { k: "suspFront", v: [MACPHERSON] },
          { k: "suspRear", v: [{ mn: "Олон холбоост, үл хамаарах", en: "Multi-link, independent" }] },
          { k: "tires", v: ["235/55 R18"] },
          {
            k: "brakes",
            v: [{ mn: "Дискэн, цахилгаан гар тоормос (Autohold)", en: "Discs, electronic parking brake with Auto Hold" }],
          },
        ],
      },
      {
        g: "safety",
        list: [
          { mn: "SRS аюулгүйн дэр – 6 ширхэг", en: "6 SRS airbags" },
          F.pretension,
          { mn: "Суудлын бүс бүслэхийг сануулах гэрлэн ба дуут дохио", en: "Visual and audible seat belt reminder" },
          F.isofix,
          F.childLock,
          F.tcsEsp,
          F.autohold,
          F.sensors,
          F.underguard,
        ],
      },
      {
        g: "exterior",
        list: [
          F.premiumLed,
          { mn: "Хойд талын LED гэрлийн зурвас", en: "LED tail light strip" },
          F.acousticScreen,
          F.mirrors,
          { mn: "Хажуугийн толин дээрх дохионы LED гэрэл", en: "Mirror-mounted LED indicators" },
          F.sportRails,
          { mn: "18 инчийн хөнгөн цагаан хайлшин обуд", en: "18-inch alloy wheels" },
        ],
      },
      {
        g: "interior",
        list: [
          { mn: "Жолоочийн дижитал хянах самбар – 12.3″", en: "12.3″ digital instrument cluster" },
          { mn: "Төвийн ухаалаг мультимедиа дэлгэц – 12.3″", en: "12.3″ central multimedia touchscreen" },
          { mn: "Ухаалаг дуу хоолойгоор удирдах систем", en: "Smart voice control" },
          { mn: "GPS навигаци ба Bluetooth холболт", en: "GPS navigation and Bluetooth" },
          { mn: "8 чанга яригчтай дуугаралтын систем", en: "8-speaker audio system" },
          F.camera360,
          F.keyless,
          F.leatherWheel,
          { mn: "Урд суудал халаагч ба хурд тохируулагч", en: "Heated front seats and cruise control" },
          F.split4060,
        ],
      },
    ],
  },
];

/* ============================================================
   БРЭНД — brand хуудасны баталгаатай тоо ба шагналууд
   ⚠ «Дэлхийн хэрэглэгчид» дээр зөрчил бий: brand хуудас 14.2 сая,
     нүүр хуудас 18 сая. Тиймээс тэр тоог ЭНД ХЭРЭГЛЭХГҮЙ.
   ⚠ Fortune Global 500-ийн байр энд #223, шагналын хуудсанд #233 —
     эх сурвалжаар нягтлах шаардлагатай (захиалагчид мэдэгдсэн).
   ============================================================ */
const brand: BrandSrc = {
  figures: [
    [{ mn: "2.6 сая+", en: "2.6M+" }, { mn: "2024 оны борлуулалт", en: "Vehicles sold in 2024" }],
    ["120+", { mn: "Орон, бүс нутаг", en: "Countries and regions" }],
    ["#223", "Fortune Global 500 · 2025"],
    [{ mn: "22 жил", en: "22 years" }, { mn: "Дараалан экспортын тэргүүлэгч", en: "As China’s top car exporter" }],
  ],
  records: [
    [
      "2024",
      { mn: "1,140,000 машин экспортолсон", en: "1,140,000 vehicles exported" },
      {
        mn: "Хятадын түүхэн дэх хамгийн их экспорт. 27 секунд тутамд нэг машин гадаад зах зээлд.",
        en: "The highest export volume in Chinese history — one car shipped overseas every 27 seconds.",
      },
    ],
    [
      "2024",
      { mn: "5 сая дахь экспортын машин", en: "The 5 millionth export" },
      {
        mn: "Chery бол Хятадын 5 сая машин экспортолсон анхны компани.",
        en: "Chery is the first Chinese carmaker to export 5 million vehicles.",
      },
    ],
    [
      "2024",
      { mn: "15 сая дахь үйлдвэрлэл", en: "The 15 millionth vehicle" },
      {
        mn: "Дэлхийн 5 үйлдвэрт хамтарсан 15 сая дахь машинаа үйлдвэрлэсэн.",
        en: "Chery’s five plants worldwide together built their 15 millionth vehicle.",
      },
    ],
    [
      "2023",
      { mn: "532 удаагийн аюулгүйн туршилт", en: "532 safety tests" },
      {
        mn: "Ази дахь хамгийн том аюулгүйн туршилтын лабораторид нэг жилд.",
        en: "Carried out in a single year at Asia’s largest vehicle safety laboratory.",
      },
    ],
  ],
  awards: [
    [
      "2025 · J.D. Power APEAL",
      { mn: "Tiggo 7 Plus — Mid-size Economy SUV тэргүүн", en: "Tiggo 7 Plus — No. 1 Mid-size Economy SUV" },
      {
        mn: "795 оноо. 2024 оны дэд байрнаас 2025 онд тэргүүн байранд.",
        en: "795 points — up from second place in 2024 to first in 2025.",
      },
    ],
    [
      "2024–2025 · J.D. Power APEAL",
      { mn: "Tiggo 8 Plus — Mid-size SUV тэргүүн", en: "Tiggo 8 Plus — No. 1 Mid-size SUV" },
      {
        mn: "796 оноогоор хоёр жил дараалан сегментээ тэргүүлсэн.",
        en: "Top of its segment two years running, with 796 points.",
      },
    ],
    [
      "2023 · J.D. Power IQS",
      { mn: "Tiggo 4 Pro — Compact SUV тэргүүн", en: "Tiggo 4 Pro — No. 1 Compact SUV" },
      {
        mn: "230 загвар, 48 брэндийн дундаас анхны чанараар шалгарсан.",
        en: "Ranked first for initial quality among 230 models from 48 brands.",
      },
    ],
    [
      "2025 · J.D. Power",
      { mn: "«Five-time Champion»", en: "“Five-time Champion”" },
      {
        mn: "SSI, APEAL, IQS, CSI, VDS — таван судалгаанд нэгэн зэрэг тэргүүлсэн.",
        en: "Top-ranked in five studies at once: SSI, APEAL, IQS, CSI and VDS.",
      },
    ],
  ],
};

/* ============================================================
   ҮЙЛЧИЛГЭЭ — FAQ хуудасны бодит асуулт хариулт
   ⚠ «Албан ёсны ямар дилер компаниуд байгаа вэ?» асуултыг ХАСАВ:
     хариулт нь Jetour, Hongqi, BYD зэрэг ӨРСӨЛДӨГЧ БРЭНДҮҮДИЙГ
     «дилер» гэж жагсаасан байсан. Зөв хариултыг захиалагч өгнө.
   ============================================================ */
const faq: FaqSrc[] = [
  {
    q: { mn: "Албан ёсны дистрибьютор гэж хэн бэ?", en: "Who is the official distributor?" },
    a: {
      mn:
        "Chery брэндийн Монгол дахь албан ёсны дистрибьютороор Сайн Моторс ХХК " +
        "ажиллаж байна. Бид Chery автомашиныг албан ёсны эрхтэйгээр импортлон " +
        "борлуулж, албан ёсны баталгаат сэлбэгийг нийлүүлж, инженер техникийн " +
        "ажилтнуудад олон улсын стандартын засвар үйлчилгээний сургалт явуулдаг.",
      en:
        "Sain Motors LLC is the official distributor of Chery in Mongolia. We import " +
        "and sell Chery vehicles under an official agreement, supply genuine " +
        "warranty-backed parts, and train our technicians to international " +
        "service standards.",
    },
  },
  {
    q: { mn: "Танайхаас авсан автомашинд ямар баталгаа өгдөг вэ?", en: "What warranty do your cars come with?" },
    a: {
      mn:
        "Манай бүх шинэ автомашин үйлдвэрийн албан ёсны баталгаатай ирдэг. " +
        "Загвараас хамааран 3 жил эсвэл 100,000 км-ийн баталгаа мөрддөг.",
      en:
        "Every new car we sell comes with the official factory warranty — " +
        "3 years or 100,000 km, depending on the model.",
    },
  },
  {
    q: { mn: "Баталгаат засвар үйлчилгээнд яг юу багтдаг вэ?", en: "What exactly does the warranty cover?" },
    a: {
      mn:
        "Баталгаат хугацаанд хөдөлгүүр, хурдны хайрцаг, цахилгааны үндсэн систем " +
        "болон тэнхлэгийн үйлдвэрийн доголдлыг засварлах, солих үйлчилгээ багтана. " +
        "Харин тос, шүүр, тоормосны наклад зэрэг элэгддэг эд анги хамаарахгүй.",
      en:
        "During the warranty period we repair or replace manufacturing defects in " +
        "the engine, transmission, main electrical systems and axles. Wear items " +
        "such as oil, filters and brake pads are not covered.",
    },
  },
  {
    q: { mn: "Сэлбэг хэрэгсэл бэлэн байдаг уу?", en: "Are spare parts readily available?" },
    a: {
      mn:
        "Албан ёсны сервис төвдөө бүх загварын үндсэн болон урсгал засварын " +
        "оригинал сэлбэгийг тогтмол бэлэн байлгадаг. Ховор нэр төрлийн сэлбэгийг " +
        "үйлдвэрээс хамгийн богино хугацаанд татан авдаг.",
      en:
        "Our official service centre keeps genuine parts for routine and major " +
        "repairs in stock for every model. Less common parts are ordered from " +
        "the factory as quickly as possible.",
    },
  },
  {
    q: { mn: "Лизингийн урьдчилгаа болон хугацаа ямар байдаг вэ?", en: "What are the leasing terms?" },
    a: {
      mn:
        "Автомашины үнийн дүнгээс хамаарч урьдчилгаа төлбөр 10%-аас эхэлнэ. " +
        "Эргэн төлөх хугацааг 96 сар (8 жил) хүртэл сонгож, сарын төлбөрөө " +
        "уян хатан тохируулах боломжтой.",
      en:
        "Depending on the price of the car, down payments start from 10%. You can " +
        "choose a repayment term of up to 96 months (8 years) and set a monthly " +
        "payment that suits you.",
    },
  },
  {
    q: {
      mn: "Тест драйв хийхэд урьдчилж цаг авах шаардлагатай юу?",
      en: "Do I need to book a test drive in advance?",
    },
    a: {
      mn:
        "Шаардлагагүй. Гэхдээ таныг ирэхэд машиныг бэлэн, дараалалгүй байлгах " +
        "үүднээс вэбсайт эсвэл утсаар урьдчилан цаг захиалахыг зөвлөж байна.",
      en:
        "No, but we recommend booking online or by phone so the car is ready " +
        "and waiting when you arrive.",
    },
  },
];

/* Тест драйвын маршрут — dest-drive хуудаснаас */
const testDrive: TestDriveSrc = {
  title: { mn: "Тест драйвын маршрут", en: "The test-drive route" },
  lede: {
    mn:
      "Шоурумаас эхлэх энэхүү маршрут нь хотын зам болон хурдны хэсгийг " +
      "хослуулсан тул та Chery-гийн хүчин чадал, тав тухыг бүрэн мэдэрнэ.",
    en:
      "Starting at the showroom, the route combines city streets with a faster " +
      "stretch of road, so you can fully experience Chery’s performance and comfort.",
  },
  steps: [
    [{ mn: "Бүртгүүлэх", en: "Book" }, { mn: "Өөрт тохиромжтой цагаа сонгоно.", en: "Choose a time that suits you." }],
    [{ mn: "Зөвлөгөө", en: "Get to know it" }, { mn: "Машины ухаалаг системүүдтэй танилцана.", en: "Our consultant walks you through the car’s smart features." }],
    [{ mn: "Мэдрэх", en: "Drive" }, { mn: "Жолоодлогоос таашаал авна.", en: "Enjoy the drive." }],
  ],
};

/* Нүүрэнд гарах гурван ялгаа — бүгд баталгаатай */
const pillars: PillarSrc[] = [
  {
    k: join(site.warranty.years, " / ", site.warranty.km),
    t: { mn: "Үйлдвэрийн баталгаа", en: "Factory warranty" },
    b: {
      mn: "Хөдөлгүүр, хурдны хайрцаг, цахилгаан болон механик эд ангийн үйлдвэрийн согог.",
      en: "Covers factory defects in the engine, transmission, and electrical and mechanical components.",
    },
  },
  {
    k: join(site.finance.downPayment, " / ", site.finance.term),
    t: { mn: "Санхүүжилт", en: "Financing" },
    b: {
      mn: "Урьдчилгаа 10%-аас эхэлж, эргэн төлөлтийг 96 сар хүртэл сунгах боломжтой.",
      en: "Down payments from 10%, with repayment terms of up to 96 months.",
    },
  },
  {
    k: { mn: "Оригинал сэлбэг", en: "Genuine parts" },
    t: { mn: "Албан ёсны сервис", en: "Official service" },
    b: {
      mn: "Үндсэн болон урсгал засварын сэлбэг тогтмол бэлэн, ховор сэлбэгийг үйлдвэрээс.",
      en: "Parts for routine and major repairs always in stock; rarer parts sourced from the factory.",
    },
  },
];

/* ⚠ БОДИТ МЭДЭЭ БАЙХГҮЙ. Амьд сайтын 5 бичлэг бүгд Motors theme-ийн
   demo (Hello world, Ford, Tesla, Hyundai). Тиймээс мэдээний ХУУДАС,
   КАРТЫН БҮТЭЦ баригдсан ч нийтлэл ЗОХИООГҮЙ — хоосон төлөв харуулна. */
const news: NewsItemSrc[] = [];

/* ============================================================
   ШАГНАЛ, АМЖИЛТ

   Эх сурвалж: амьд сайтын `/index.php/brand1/` хуудас
   (`_crawl/pages/brand1.html`) — Chery-гийн БҮРЭН БОДИТ шагналын
   хуудас; бүх тоо, шагнал, эх сурвалж нь тэндээс.

   ⚠ ЗАХИАЛАГЧИЙН ТОДОРХОЙ ШИЙДВЭР: гүйдэг тууз (ticker), 0-оос өсөх
   тоолуур, тугны эможи гурвуулаа ЭРГЭЖ ОРСОН. Эдгээр нь
   `DESIGN-SYSTEM.md`-ийн §14 ба §8 дүрэмтэй зөрчилдөнө — захиалагч
   мэдсэн, зөвшөөрсөн. Бусад хуудсанд эдгээрийг ХЭРЭГЛЭХГҮЙ.

   ⚠ «2024 онд #385, 52 байр дэвшиж #233» — 385 − 233 = 152. Эх
   сурвалжаар нягтлах шаардлагатай (захиалагчид мэдэгдсэн).
   ============================================================ */
const awards: AwardsSrc = {
  lede: {
    mn:
      "26 жилийн хугацаанд дэлхийн хамгийн хурдацтай өсч буй автомашины " +
      "брэнд. Доорх бүх шагнал, тоо баримт нь бие даасан олон улсын " +
      "байгууллагын нийтэлсэн үнэлгээ.",
    en:
      "Over 26 years, one of the world’s fastest-growing car brands. Every " +
      "award and figure below comes from an independent international organisation.",
  },

  /* Hero-гийн дэвсгэр — жинхэнэ Chery кадр (Tiggo 8, үдшийн гэрэлд). */
  hero: { img: "hero-t8", badge: "Fortune Global 500 · #233" },

  /* Гүйдэг тууз — эх хуудасны `.ticker-track`-ийн ЯГ ТЭР 7 өгүүлбэр */
  ticker: [
    "Fortune Global 500 · #233",
    { mn: "22 жил дараалан экспортын тэргүүн", en: "China’s top car exporter for 22 years" },
    { mn: "120+ орон, бүс нутаг", en: "120+ countries and regions" },
    "J.D. Power Triple Crown",
    { mn: "2.6 сая+ 2024 борлуулалт", en: "2.6M+ sales in 2024" },
    { mn: "Kantar BrandZ авто ангиллын #1", en: "Kantar BrandZ #1 in automotive" },
    { mn: "5 сая машин экспортолсон анхны хятадын брэнд", en: "First Chinese brand to export 5 million cars" },
  ],

  /* «Тоо баримт» — 0-оос өсдөг тоолуур. `to` нь эцсийн тоо, `dec` нь
     аравтын орон, `pre`/`suf` нь тойрох тэмдэг. */
  figures: [
    { pre: "", to: 2.6, dec: 1, suf: { mn: " сая+", en: "M+" }, label: { mn: "2024 оны нийт борлуулалт", en: "Total sales in 2024" } },
    { pre: "", to: 22, dec: 0, suf: "", label: { mn: "Дараалсан жил экспортын тэргүүн", en: "Consecutive years as top exporter" } },
    { pre: "", to: 120, dec: 0, suf: "+", label: { mn: "Орон, бүс нутаг", en: "Countries and regions" } },
    { pre: "", to: 14.2, dec: 1, suf: { mn: " сая", en: "M" }, label: { mn: "Дэлхийн хэрэглэгчид", en: "Customers worldwide" } },
    { pre: "#", to: 233, dec: 0, suf: "", label: "Fortune Global 500 · 2025" },
  ],

  /* «Дэлхийн хүлээн зөвшөөрөл» — эх сурвалж бүрийг нэрлэсэн */
  global: [
    {
      year: "2025",
      title: "Fortune Global 500 — #233",
      body: {
        mn:
          "2024 онд #385, 2025 онд 52 байр дэвшиж #233-т орсон. Дэлхийн " +
          "автомашины үйлдвэрлэлийн жагсаалтад хамгийн хурдан дэвшсэн " +
          "компани. Орлого 59.7 тэрбум доллар.",
        en:
          "#385 in 2024, then up 52 places to #233 in 2025 — the fastest " +
          "climber among the carmakers on the list. Revenue: US$59.7 billion.",
      },
      src: "Fortune Magazine · 2025",
    },
    {
      year: "2024",
      title: { mn: "Kantar BrandZ — авто ангиллын #1", en: "Kantar BrandZ — #1 in automotive" },
      body: {
        mn:
          "Top 50 Chinese Global Brand Builders тайланд авто ангиллаар " +
          "тэргүүлсэн. «Pioneering Chinese Global Brand» шагнал хүртсэн " +
          "цорын ганц автомашины компани.",
        en:
          "Led the automotive category in the Top 50 Chinese Global Brand " +
          "Builders report, and the only carmaker to win the “Pioneering " +
          "Chinese Global Brand” award.",
      },
      src: "Kantar BrandZ · 2024",
    },
    {
      year: "2024",
      title: "Fortune China ESG Impact List",
      body: {
        mn:
          "Байгаль орчин, нийгмийн хариуцлага, засаглалын салбарт " +
          "манлайлагч гэж хүлээн зөвшөөрөгдсөн.",
        en: "Recognised as a leader in environmental, social and governance performance.",
      },
      src: "Fortune · 2024",
    },
    {
      year: "2021–2024",
      title: {
        mn: "Top 20 Best Overseas Image Enterprises — 5 удаа",
        en: "Top 20 Best Overseas Image Enterprises — five times",
      },
      body: {
        mn:
          "SASAC болон CICG-ийн дэлхийн жагсаалтад 5 удаа нэрлэгдсэн. " +
          "Хятадын экспортоороо тэргүүлэгч, нэр хүндтэй компаниудын нэг.",
        en:
          "Named five times on the global list compiled by SASAC and CICG — " +
          "one of China’s leading and most respected exporters.",
      },
      src: "SASAC · CICG",
    },
  ],

  /* J.D. Power Triple Crown — гурван судалгаа */
  jdp: {
    lede: {
      mn:
        "IQS, APEAL, SSI — J.D. Power-ийн хамгийн нэр хүндтэй гурван " +
        "судалгаанд нэгэн зэрэг тэргүүлсэн цорын ганц үндэсний брэнд.",
      en:
        "IQS, APEAL and SSI — the only Chinese brand to top J.D. Power’s three " +
        "most prestigious studies at the same time.",
    },
    rows: [
      [
        "IQS",
        "Initial Quality Study",
        {
          mn: "Анхны чанарын судалгаанд үндэсний брэндүүдийн дундаас 1-р байр (2023 ба 2024 дараалан).",
          en: "No. 1 among Chinese brands for initial quality (2023 and 2024 in a row).",
        },
      ],
      [
        "APEAL",
        "Performance & Layout",
        {
          mn: "Гүйцэтгэл, загвар, тансаглалын судалгаанд 1-р байр. Tiggo 7 Plus 795 оноо, Tiggo 8 Plus 796 оноо.",
          en: "No. 1 for performance, design and appeal. Tiggo 7 Plus scored 795 points, Tiggo 8 Plus 796.",
        },
      ],
      [
        "SSI",
        "Sales Satisfaction Index",
        {
          mn: "Борлуулалтын үйлчилгээний сэтгэл ханамжийн судалгаанд үндэсний брэндүүдийн 1-р байр.",
          en: "No. 1 among Chinese brands for sales satisfaction.",
        },
      ],
    ],
  },

  /* Загвар тус бүрийн шагнал — `models[].id`-тай холбогдоно.
     `segment` нь J.D. Power-ийн албан ангиллын нэр — орчуулахгүй. */
  byModel: [
    {
      id: "tiggo-7",
      segment: "Mid-size Economy SUV",
      tag: { mn: "Дэлхийн аварга", en: "World champion" },
      list: [
        {
          mn: "J.D. Power 2025 APEAL — Mid-size Economy SUV аварга (795 оноо)",
          en: "J.D. Power 2025 APEAL — Mid-size Economy SUV champion (795 points)",
        },
        { mn: "Бразил 2024 — «Best Value Mid-Size SUV», Auto Esporte", en: "Brazil 2024 — “Best Value Mid-Size SUV”, Auto Esporte" },
        { mn: "Катар — «Best Selling SUV», Tiggo 7 Pro Max", en: "Qatar — “Best Selling SUV”, Tiggo 7 Pro Max" },
        {
          mn: "Саудын Араб — 2024 National Automobile Award, Best Crossover",
          en: "Saudi Arabia — 2024 National Automobile Award, Best Crossover",
        },
        { mn: "ANCAP 5 одны үнэлгээ (2023, Австрали)", en: "5-star ANCAP rating (2023, Australia)" },
      ],
    },
    {
      id: "tiggo-8",
      segment: "Mid-size SUV",
      tag: { mn: "7 суудалтай флагман", en: "The seven-seat flagship" },
      list: [
        {
          mn: "J.D. Power 2024–2025 APEAL — Mid-size SUV аварга, 2 дараалсан жил (796 оноо)",
          en: "J.D. Power 2024–2025 APEAL — Mid-size SUV champion two years running (796 points)",
        },
        {
          mn: "Филиппин — «Best Midsize Crossover», 19th Annual Award",
          en: "Philippines — “Best Midsize Crossover”, 19th Annual Awards",
        },
        { mn: "Индонез 2024 — «Best Medium SUV», IIMS Surabaya", en: "Indonesia 2024 — “Best Medium SUV”, IIMS Surabaya" },
        {
          mn: "Бразил 2020 — Best SUV of the Year, гурван шагнал нэгэн зэрэг",
          en: "Brazil 2020 — Best SUV of the Year, three awards at once",
        },
      ],
    },
    {
      id: "tiggo-4",
      segment: "Compact SUV",
      list: [
        { mn: "J.D. Power 2023 IQS — Compact SUV сегментийн тэргүүн", en: "J.D. Power 2023 IQS — No. 1 Compact SUV" },
        {
          mn: "Өмнөд Африк 2024 Top Gear — «Most Improved Car of the Year»",
          en: "South Africa 2024, Top Gear — “Most Improved Car of the Year”",
        },
        {
          mn: "J.D. Power 2024–2025 APEAL — төрлийн нэгдүгээр байраа хадгалсан",
          en: "J.D. Power 2024–2025 APEAL — kept first place in its class",
        },
      ],
    },
    {
      id: "tiggo-2",
      segment: "Entry-level SUV",
      list: [
        { mn: "2024 онд 1 сая ширхэг үйлдвэрлэсэн", en: "1 millionth unit produced in 2024" },
        { mn: "Дэлхийд хамгийн их зарагддаг Chery загваруудын нэг", en: "One of Chery’s best-selling models worldwide" },
        { mn: "120+ оронд борлуулагддаг", en: "Sold in more than 120 countries" },
      ],
    },
  ],

  /* Экспортын рекорд — он дарааллаар */
  records: [
    [
      "2024",
      { mn: "1,140,000 машин экспортолсон", en: "1,140,000 vehicles exported" },
      {
        mn: "Хятадын түүхэн дэх хамгийн их экспортын тоо — 27 секунд тутамд нэг машин гадаад зах зээлд очсон.",
        en: "The highest export figure in Chinese history — one car shipped abroad every 27 seconds.",
      },
      { mn: "Экспортын рекорд", en: "Export record" },
    ],
    [
      "2024",
      { mn: "5 сая нийт машин экспортолсон", en: "5 million vehicles exported in total" },
      {
        mn: "Хятадын аль ч автомашины брэнд хийж чадаагүй босго. Анхны компани.",
        en: "A milestone no other Chinese car brand had reached — Chery was the first.",
      },
      { mn: "Түүхэн анхны", en: "Historic first" },
    ],
    [
      "2024",
      { mn: "Tiggo 7 — 1 сая машин экспортолсон", en: "Tiggo 7 — 1 million exported" },
      {
        mn: "11-р сарын 1-нд Wuhu боомтоос 1 сая дахь Tiggo 7 гарсан. Гурван дараалсан жил A-сегментийн SUV экспортын тэргүүн.",
        en: "On 1 November the millionth Tiggo 7 left the port of Wuhu. China’s top-exported A-segment SUV three years running.",
      },
      { mn: "Загварын рекорд", en: "Model record" },
    ],
    [
      "2024",
      { mn: "15 сая нийт машины үйлдвэрлэл", en: "15 million vehicles built" },
      {
        mn: "Дэлхийн таван үйлдвэрт хамтарсан 15 дахь сая машин угсрагдсан.",
        en: "The 15 millionth vehicle was assembled across Chery’s five plants worldwide.",
      },
      { mn: "Дэлхийн рекорд", en: "Global record" },
    ],
    [
      "2023",
      { mn: "937,148 машин экспортолсон", en: "937,148 vehicles exported" },
      {
        mn: "Өмнөх оноос 101.1% өсөлт. Азийн хамгийн том аюулгүйн лабораторид нэг жилд 532 туршилт — шинэ рекорд.",
        en: "Up 101.1% on the previous year, plus a record 532 tests in one year at Asia’s largest safety laboratory.",
      },
      { mn: "Экспортын рекорд", en: "Export record" },
    ],
    [
      "2002–2024",
      { mn: "22 дараалсан жил тэргүүн", en: "No. 1 for 22 years straight" },
      {
        mn: "Хятадын суудлын машин экспортоороо 22 дэх жилдээ дараалан тэргүүлсэн.",
        en: "China’s leading passenger-car exporter for the 22nd consecutive year.",
      },
      { mn: "Үндсэн рекорд", en: "Signature record" },
    ],
  ],

  /* Бүс нутгийн тэргүүлэлт */
  markets: [
    [
      "🇷🇺",
      { mn: "Орос", en: "Russia" },
      { mn: "178,000+ гэр бүлийн сонголт", en: "The choice of 178,000+ families" },
      {
        mn: "Оросын зах зээлд хамгийн их зарагдсан Хятадын SUV загваруудын нэг. Сибирийн −53°C-д туршигдсан.",
        en: "One of the best-selling Chinese SUVs in Russia. Tested at −53°C in Siberia.",
      },
    ],
    [
      "🇧🇷",
      { mn: "Бразил", en: "Brazil" },
      { mn: "«Best Value Mid-Size SUV» 2024", en: "“Best Value Mid-Size SUV” 2024" },
      {
        mn: "Auto Esporte сэтгүүлийн шагнал. PHEV загвар «Best Engine under 2.0L» хүртсэн.",
        en: "Awarded by Auto Esporte magazine. The PHEV model also won “Best Engine under 2.0L”.",
      },
    ],
    [
      "🇪🇬",
      { mn: "Египет", en: "Egypt" },
      { mn: "2023 оны хамгийн их зарагдсан брэнд", en: "Best-selling brand of 2023" },
      {
        mn: "Бүх брэндийг давж тэргүүлсэн. Tiggo 8 болон Tiggo 7 шагнал хүртсэн.",
        en: "Outsold every other brand, with awards for both the Tiggo 8 and Tiggo 7.",
      },
    ],
    [
      "🇿🇦",
      { mn: "Өмнөд Африк", en: "South Africa" },
      { mn: "NADA 2024 Dealer Satisfaction — алт", en: "NADA 2024 Dealer Satisfaction — Gold" },
      {
        mn: "Гурав дахь удаагаа дараалан. Top Gear SA: Tiggo 4 Pro «Most Improved Car of the Year».",
        en: "For the third year running. Top Gear SA named the Tiggo 4 Pro “Most Improved Car of the Year”.",
      },
    ],
    [
      "🇮🇩",
      { mn: "Индонез", en: "Indonesia" },
      { mn: "«Best Medium SUV» — IIMS Surabaya 2024", en: "“Best Medium SUV” — IIMS Surabaya 2024" },
      {
        mn: "Tiggo 8 Pro олон улсын авто шоуд шагнал хүртсэн.",
        en: "The Tiggo 8 Pro took the award at the international motor show.",
      },
    ],
    [
      "🇶🇦",
      { mn: "Катар", en: "Qatar" },
      { mn: "«Best Selling SUV» — Tiggo 7 Pro Max", en: "“Best Selling SUV” — Tiggo 7 Pro Max" },
      {
        mn: "Катарын зах зээлд хамгийн их зарагдсан SUV цол хүртсэн.",
        en: "Named the best-selling SUV in the Qatari market.",
      },
    ],
    [
      "🇪🇸",
      { mn: "Испани", en: "Spain" },
      { mn: "EBRO брэндийг сэргээх хамтын ажиллагаа", en: "Reviving the EBRO brand" },
      {
        mn: "Chery Европ дахь анхны үйлдвэрлэлээ EV Motors-тай хамтран байгуулсан. 70 жилийн түүхтэй EBRO дахин амилсан.",
        en: "Chery set up its first European production with EV Motors, bringing the 70-year-old EBRO brand back to life.",
      },
    ],
    [
      "🇵🇭",
      { mn: "Филиппин", en: "Philippines" },
      { mn: "«Best Midsize Crossover» — 19th Annual", en: "“Best Midsize Crossover” — 19th Annual Awards" },
      {
        mn: "Tiggo 8 Plus дараалсан жилүүдэд тэргүүлэгч байр эзэлсэн.",
        en: "The Tiggo 8 Plus has held the top spot year after year.",
      },
    ],
  ],

  /* Аюулгүй байдлын хараат бус үнэлгээ */
  safety: [
    [
      "5★", "A-NCAP", "Tiggo 7 Pro",
      { mn: "2023 · Австрали", en: "2023 · Australia" },
      {
        mn: "Австралийн National Car Assessment Programme-ын 5 одны үнэлгээ.",
        en: "A 5-star rating from Australia’s national car assessment programme.",
      },
    ],
    [
      "✓", "Euro NCAP", "Tiggo 9",
      { mn: "2025 · Европ", en: "2025 · Europe" },
      {
        mn: "Европын хамгийн хатуу шалгалтад амжилттай оролцсон. 10 аюулгүйн дэр, аккумулятор бүрэн бүтэн үлдсэн.",
        en: "Successfully completed Europe’s toughest assessment. 10 airbags, and the battery stayed fully intact.",
      },
    ],
    [
      "5★", "C-NCAP", { mn: "Tiggo цуврал", en: "Tiggo range" },
      { mn: "2022 · Хятад", en: "2022 · China" },
      {
        mn: "C-NCAP шалгалтад 5 од. 54 загвартаа аюулгүй байдлын сертификат — Хятадад хамгийн олон.",
        en: "5 stars in C-NCAP testing, and safety certification across 54 models — the most in China.",
      },
    ],
  ],
};

/* ============================================================
   НЭГ ХЭЛНИЙ ХУВИЛБАР
   ============================================================ */

const SOURCE = { site, nav, footerGroups, slides, models, brand, faq, testDrive, pillars, news, awards };

export type Content = Localized<typeof SOURCE>;
export type Site = Content["site"];
export type NavItem = Content["nav"][number];
export type Slide = Content["slides"][number];
export type Model = Content["models"][number];
export type SpecGroup = NonNullable<Model["specs"]>[number];

const cache = new Map<Locale, Content>();

/** Хуудас бүр үүнийг дуудна — build үед хэл тус бүрд НЭГ удаа тооцогдоно. */
export function getContent(locale: Locale): Content {
  let c = cache.get(locale);
  if (!c) {
    c = resolve(SOURCE, locale);
    cache.set(locale, c);
  }
  return c;
}

/** Загварын id-ийн жагсаалт — хэлнээс үл хамаарна (static params, sitemap). */
export const MODEL_IDS = models.map((m) => m.id);

/* ============================================================
   ЗАГВАРЫН ГОЛ ҮЗҮҮЛЭЛТ — hero-гийн нэг мөр.
   Зөвхөн `specs`-д БАЙГАА утгаас татна; олдохгүй бол мөр гарахгүй
   (Tiggo 7-д үзүүлэлт баталгаажаагүй тул хоосон). Хоёр хувилбартай
   загварт (Tiggo 4) «v1 / v2». Шошго, нэгж нь хуудсанд (messages).
   ============================================================ */
export const KEY_SPECS = ["engine", "power", "gearbox", "seats"] as const satisfies readonly SpecKey[];
export type KeySpec = (typeof KEY_SPECS)[number];

export function keySpecs(m: Model): Array<{ k: KeySpec; v: string }> {
  if (!m.specs) return [];
  const rows = m.specs.flatMap((g) => g.rows ?? []);
  const out: Array<{ k: KeySpec; v: string }> = [];
  for (const k of KEY_SPECS) {
    const r = rows.find((row) => row.k === k);
    if (r) out.push({ k, v: r.v.filter(Boolean).join(" / ") });
  }
  return out;
}
