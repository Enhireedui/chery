-- ═══════════════════════════════════════════════════════════════
--  CHERY Mongolia — 0001_leads.sql
--
--  ⚙ ЯАГААД ЗӨВХӨН НЭГ ХҮСНЭГТ (Phase 3):
--  Загвар, үзүүлэлт, өнгө, шоурум, баталгаа, шагнал — бүгд ТОГТМОЛ
--  маркетингийн агуулга. Тэд `lib/content.ts`-д байж, build-time
--  дээр static HTML болдог: хамгийн хурдан, хувилбар нь Git-д
--  хөтлөгддөг, өгөгдлийн сангийн ажиллагаа шаардахгүй.
--  Мэдээ нь одоогоор 0 нийтлэл — хүснэгт үүсгэх шаардлагагүй.
--
--  ӨГӨГДЛИЙН САН ЗӨВХӨН хэрэглэгчээс ирдэг өгөгдөлд хэрэгтэй:
--  тест драйвын хүсэлт. Тэр нь Git-д хадгалагдаж болохгүй (хувийн
--  мэдээлэл) бөгөөд байнга нэмэгддэг.
--
--  Ажиллуулах: Supabase → SQL Editor → энэ файлыг бүтнээр хуулж Run
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Хэрэглэгчээс: зөвхөн нэр, утас (маягтад ердөө хоёр талбар)
  name          text not null,
  phone         text not null,

  -- Контекст: JS нь дарах үед автоматаар бөглөнө
  model         text,          -- 'tiggo-2' | 'tiggo-4' | 'tiggo-7' | 'tiggo-8'
  source_path   text,          -- аль хуудаснаас илгээв
  purpose       text not null default 'test-drive',

  -- Дараа нь бүтэн маягт (Холбоо барих хуудас) хэрэглэх талбарууд
  message       text,

  -- Дилерийн ажлын урсгал
  status        text not null default 'new',
  note          text,

  -- Диагностик. IP ХАДГАЛАХГҮЙ — хувийн мэдээлэл цуглуулахгүй
  -- байх нь зорилго; user agent нь спам эсэхийг ойлгоход хангалттай.
  user_agent    text,

  -- ── Хязгаарлалт: сервер дээрх валидацийн ХОЁРДУГААР хамгаалалт.
  --    Апп нь аль хэдийн шалгадаг ч өгөгдлийн сан нь эцсийн эрх
  --    бүхий байх ёстой (Phase 6 «Validate everything server-side»).
  constraint leads_name_len   check (char_length(btrim(name)) between 1 and 120),
  constraint leads_phone_len  check (char_length(btrim(phone)) between 6 and 32),
  constraint leads_phone_fmt  check (phone ~ '^[0-9+()\-\s]+$'),
  constraint leads_model_ok   check (model is null or model in
                                ('tiggo-2','tiggo-4','tiggo-7','tiggo-8')),
  constraint leads_purpose_ok check (purpose in ('test-drive','quote','advice')),
  constraint leads_status_ok  check (status in ('new','contacted','done','spam')),
  constraint leads_msg_len    check (message is null or char_length(message) <= 2000),
  constraint leads_path_len   check (source_path is null or char_length(source_path) <= 300),
  constraint leads_ua_len     check (user_agent is null or char_length(user_agent) <= 400)
);

-- ── Индекс (Phase 24) ────────────────────────────────────────
-- Dashboard-ын гол хүсэлт: «шинэ лидүүд, шинээс хуучин дараалалтай».
create index if not exists leads_created_at_idx on public.leads (created_at desc);
-- Статусаар шүүх (шинэ хүсэлтүүдийг л харах)
create index if not exists leads_status_idx on public.leads (status)
  where status = 'new';
-- Давхардсан илгээлтийг шалгах хүсэлт: (phone, created_at)
create index if not exists leads_phone_recent_idx on public.leads (phone, created_at desc);

-- ── ROW LEVEL SECURITY (Phase 4, 5, 20) ─────────────────────
-- RLS-ийг ажиллуулна, ГЭХДЭЭ ямар ч policy ҮҮСГЭХГҮЙ.
--
-- Policy байхгүй + RLS on = `anon` ба `authenticated` роль нь
-- SELECT, INSERT, UPDATE, DELETE аль нь ч ХИЙЖ ЧАДАХГҮЙ.
-- Өөрөөр хэлбэл хэрэглэгчийн утасны дугаар ил тод хайгдах
-- боломж БАЙХГҮЙ (Phase 5: «Private information must never be
-- publicly queryable»).
--
-- Бичих эрх нь зөвхөн `service_role`-д — тэр нь RLS-ийг давдаг
-- бөгөөд ЗӨВХӨН сервер дээр (`/api/lead`) хэрэглэгдэнэ.
-- Supabase-ийн dashboard мөн service эрхээр ажилладаг тул
-- лидүүдийг тэндээс харна — админ UI бичих шаардлагагүй.
alter table public.leads enable row level security;

-- Илт болгохын тулд: anon роль-д ямар ч GRANT байхгүй байг.
revoke all on public.leads from anon, authenticated;

comment on table public.leads is
  'Тест драйв / зөвлөгөөний хүсэлтүүд. RLS: policy байхгүй тул зөвхөн service_role хандана. Хувийн мэдээлэл — ил тод хандалт ХОРИОТОЙ.';

-- ═══════════════════════════════════════════════════════════════
--  PHASE 25 — НӨӨЦЛӨЛТ БА СЭРГЭЭЛТ
--
--  ⚠ Git repo нь өгөгдлийн сангийн нөөц БИШ. Repo-д код л байна;
--  лид нь зөвхөн Postgres-д байна.
--
--  Supabase-ийн нөөцлөлт:
--   · Free төлөвлөгөө — өдөр тутмын нөөц 7 хоног хадгалагдана.
--     Point-in-time recovery БАЙХГҮЙ.
--   · Pro төлөвлөгөө — өдөр тутмын нөөц + PITR (7 хоног).
--
--  Хамгийн бага зөвлөмж:
--   1. Лид цуглуулж эхэлмэгц Pro-д гарах эсвэл
--   2. Сар тутам гараар export хийх:
--      Supabase → Table Editor → leads → Export as CSV
--      (эсвэл `pg_dump` — Project Settings → Database → connection string)
--   3. Сэргээлтийг ЖИЛД НЭГ УДАА туршиж үзэх — туршаагүй нөөц
--      нь нөөц биш.
-- ═══════════════════════════════════════════════════════════════
