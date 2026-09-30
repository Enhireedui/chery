# CHERY Mongolia — Sain Motors

Албан ёсны дистрибьюторын сайт. Next.js 15 (App Router) · React 19 ·
TypeScript · Tailwind 3 · Supabase.

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
| `npm run typecheck` | TypeScript шалгалт |

## Бүтэц

| Хавтас | Агуулга |
|---|---|
| `app/` | Хуудсууд: нүүр, `models/[slug]`, `brand`, `awards`, `news`, `service`, `contact`, `thanks`; `api/lead` — туршилтын жолоодлогын маягт |
| `components/` | UI компонентууд (`models/` — загвар сонгогч, карт) |
| `lib/` | Агуулга (`content.ts`), SEO/JSON-LD, Supabase клиент |
| `public/assets/` | Зураг, файл |
| `scripts/` | Зургийн туслах скриптүүд (sharp) |
| `supabase/migrations/` | `leads` хүснэгт ба RLS |
| `docs/` | Аудитын тэмдэглэл |

Дизайны дүрэм: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## Орчны хувьсагч

`.env.example`-г үзнэ үү. `SUPABASE_SERVICE_ROLE_KEY` нь зөвхөн сервер
талд уншигдана — хэзээ ч `NEXT_PUBLIC_` угтвар тавихгүй.
