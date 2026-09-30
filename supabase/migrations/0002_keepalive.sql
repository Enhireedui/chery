-- ═══════════════════════════════════════════════════════════════
--  CHERY Mongolia — 0002_keepalive.sql
--
--  Supabase-ийн Free төлөвлөгөө 7 хоног идэвхгүй project-ийг түр
--  зогсоодог (pause). Маягтаар лид ирэхгүй долоо хоногт project
--  унтарч, дараагийн хүсэлт алдаа өгнө.
--
--  `.github/workflows/supabase-keepalive.yml` нь долоо хоногт хоёр
--  удаа энэ функцийг anon key-ээр дуудна. Функц нь ЗӨВХӨН `1`
--  буцаана — ямар ч хүснэгт уншихгүй, бичихгүй. `leads`-ийн RLS
--  хэвээр: anon роль тэр хүснэгтэд огт хандахгүй.
-- ═══════════════════════════════════════════════════════════════

create or replace function public.keepalive()
returns integer
language sql
stable
security invoker
set search_path = ''
as $$ select 1 $$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;

comment on function public.keepalive() is
  'GitHub Actions keep-alive ping (Free plan inactivity pause). Returns 1, touches no data.';
