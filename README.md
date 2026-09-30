# CHERY Mongolia — Sain Motors

Албан ёсны дистрибьюторын сайт. Next.js 15 (App Router) · React 19 ·
TypeScript · next-intl · Tailwind 3 (зөвхөн utility давхарга) · Supabase.

## Эхлүүлэх

```bash
npm install
cp .env.example .env.local   # бодит утгаа бөглөнө
npm run dev                  # http://localhost:3000
```

## Скриптүүд

| Команд | Үйлдэл |
|---|---|
| `npm run dev` | Хөгжүүлэлтийн сервер |
| `npm run build` | Production build |
| `npm start` | Build хийсэн сайтыг ажиллуулах |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript шалгалт |

## Хоёр хэл (MN / EN)

| Хаяг | Хэл |
|---|---|
| `/`, `/models/tiggo-7`, … | Монгол (үндсэн, угтваргүй) |
| `/en`, `/en/models/tiggo-7`, … | English |

- **UI бичвэр** (товч, шошго, гарчиг, алдааны мессеж): `messages/mn.json`,
  `messages/en.json`. Хоёр файлын түлхүүр ижил байх ёстой — зөрвөл
  `npm run typecheck` алдаа өгнө.
- **Агуулга** (загвар, шагнал, FAQ): `lib/content.ts` — текст талбар бүр
  `{ mn, en }`; үнэ, зураг, тоо нь нэг л удаа.
- **Нэр томьёо**: [`docs/GLOSSARY.md`](docs/GLOSSARY.md). Техникийн
  үзүүлэлтийн шошго `messages/*.json`-ийн `specs`-д нэг удаа.
- Хэл сонгогч нь ижил хуудас руу шилжүүлнэ (query, hash, сонгосон загвар
  хадгалагдана). Сонгосон хэл cookie-д хадгалагдаж, дараа нь `/` руу
  ороход тэр хэлээр нээгдэнэ. Хөтчийн хэлээр таахгүй — `middleware.ts`.
- `public/assets/js/site.js`-ийн мессеж нь `messages/*.json`-ийн `js` хэсэг.

## Бүтэц

| Хавтас | Агуулга |
|---|---|
| `app/[locale]/` | Хуудсууд: нүүр, `models/[slug]`, `brand`, `awards`, `news`, `service`, `contact`, `thanks` |
| `app/api/lead` | Тест драйв, үнийн саналын маягт → Supabase |
| `i18n/`, `middleware.ts` | Хэлний маршрут ба сонголт |
| `messages/` | UI бичвэр (mn, en) |
| `components/` | UI компонентууд (`models/` — нүүрний загварын үзүүлэн) |
| `lib/` | Агуулга (`content.ts`), хэл (`i18n.ts`), SEO/JSON-LD, Supabase клиент |
| `public/assets/` | Зураг, файл, `site.js` |
| `scripts/` | Зургийн туслах скриптүүд (sharp) |
| `supabase/migrations/` | `leads` хүснэгт ба RLS |
| `docs/` | Аудитын тэмдэглэл, нэр томьёоны толь |

Дизайны дүрэм: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## Орчны хувьсагч

`.env.example`-г үзнэ үү. `SUPABASE_SERVICE_ROLE_KEY` нь зөвхөн сервер
талд уншигдана — хэзээ ч `NEXT_PUBLIC_` угтвар тавихгүй.
